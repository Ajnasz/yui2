(function() {

    /**
     * @namespace YAHOO.widget
     * @class InlineEditor
     * @extends YAHOO.util.AttributeProvider
     * @requires yahoo, dom, event, element
     * @constructor
     * @title InlineEditor widget
     * @param {HTMLElement | String} el The html element what will be
     * converted to an editable field
     * @param {Object} cfg (optional)
     * @beta
     */
    YAHOO.widget.InlineEditor = function(el, cfg) {
        this.init.apply(this, arguments);
    };

    var Y                   = YAHOO,
        YU                  = Y.util,
        YL                  = Y.lang,
        Event               = YU.Event,
        Dom                 = YU.Dom,
        InlineEditor        = YAHOO.widget.InlineEditor,
        CLASSES             = {
            CANCEL_BUTTON: 'yui-inline-editor-cancel',
            SAVE_BUTTON: 'yui-inline-editor-save',
            EDIT_BUTTON: 'yui-inline-editor-edit',
            CONTROLS_CONTAINER: 'yui-inline-editor-controls',
            ELEM_EDITABLE: 'yui-inline-editor-editable',
            EDITING_ACTIVE: 'yui-inline-editor-editing',
            RADIO_GROUP_CONTAINER: 'yui-inline-editor-radio-group',
            RADIO_ITEM_CONTAINER: 'yui-inline-editor-radio-item'
        },
        /**
         * @event cancelEvent
         * @description Fires when a user cancels the editing
         * @type YAHOO.util.CustomEvent
         */
        cancelEvent         = 'cancelEvent',
        /**
         * @event saveEvent
         * @description Fires when a user saves the editor
         * @type YAHOO.util.CustomEvent
         */
        saveEvent           = 'saveEvent',
        /**
         * @event editStartedEvent
         * @description Fires when the node content has been replaced to
         * and editor field
         * @type YAHOO.util.CustomEvent
         */
        editStartedEvent           = 'editStartedEvent',
        /**
         * @event cancelClickEvent
         * @description Fires when a user clicks on the cancel button
         * @type YAHOO.util.CustomEvent
         */
        cancelClickEvent    = 'cancelClickEvent',
        /**
         * @event saveClickEvent
         * @description Fires when a user clicks on the save button
         * @type YAHOO.util.CustomEvent
         */
        saveClickEvent      = 'saveClickEvent',
        /**
         * @event editClickEvent
         * @description Fires when a user clicks on the edit button
         * @type YAHOO.util.CustomEvent
         */
        editClickEvent      = 'editClickEvent',
        /**
         * @event emptyValueEvent
         * @description Fires when a user tries to save empty value
         * @type YAHOO.util.CustomEvent
         */
        emptyValueEvent     = 'emptyValueEvent',
        /**
         * @event valueNotValidEvent
         * @description Fires when a user tries to save a value which
         * seems not valid by the validator method
         * @type YAHOO.util.CustomEvent
         */
        valueNotValidEvent  = 'valueNotValidEvent',

        /**
         * Constant representing the valid inline editor types
         * @property VALID_TYPES
         * @private
         * @static
         * @final
         */
        VALID_TYPES         = ['text', 'textarea', 'select', 'radio'],
        /**
         * Constant representing the default editor type
         * @property TYPE
         * @namespace DEFAULT_CONFIG
         * @private
         * @static
         * @final
         */
        DEFAULT_CONFIG      = {
            TYPE: 'text',
            ALLOW_EMPTY: false,
            FIELD_NAME: 'field',
            FIELD_GENERATOR: function(type, fieldName, value, selectableValues) {
                var field;
                switch(type) {
                    case 'text':
                        field = genTextField(fieldName, value);
                        break;
                    case 'textarea':
                        field = genTextAreaField(fieldName, value);
                        break;

                    case 'select':
                        field = genSelectField(fieldName, value, selectableValues);
                        break;

                    case 'radio':
                        field = genRadioField(fieldName, value, selectableValues);
                        break;
                }
                return field;
            },
            PROCESS_BEFORE_SAVE_METHOD: function(value) {
                return value;
            },
            PROCESS_BEFORE_READ_METHOD: function(value) {
                return value;
            },
            VALIDATION_METHOD: function(value) {
                return true;
            },
            POSSIBLE_VALUES: null
        },
        /**
         * Validates the type of the editor
         * @method validateType
         * @private
         * @param {String} type The name of the editor type
         * @returns true if the given type is allowed
         * @type Boolean
         */
        validateType = function(type) {
            var valid = false;
            if(YL.isString(type)) {
                for (var i = 0, vl = VALID_TYPES.length; i < vl; i++) {
                    if(VALID_TYPES[i] === type) {
                        valid = true;
                        break;
                    }
                }
            }
            if(!valid) {
                Y.log('field type is invalid:  ' + valid, 'error');
                throw new Error('field type is invalid');
            }
            return valid;
        },
        /**
         * Creates a form for the editor, where the edit field will be shown
         * @method createForm
         * @private
         * @param {String} id The form (generally the editor's) id
         */
        createForm = function(id) {
            var form = document.createElement('form');
            Dom.setAttribute(form, 'id', 'yui-inline-editor-' + id);
            Dom.addClass(form, 'yui-inline-editor-form');
            return form;
        },
        /**
         * Generates a specified HTML element for the form
         * @method _genField
         * @private
         * @param {String} type The type of the edit field
         * @param {String} name The name of the edit field
         * @param {String} value The value of the edit field
         * @returns The html input or textarea element which value and name is set
         * @type HTMLElement
         */
        _genField = function(type, name, value) {
            if(!YL.isString(type) || !YL.isString(name) || (!YL.isString(value) && !YL.isNumber(value))) {
                return false;
            }
            var element = document.createElement(type);
            Dom.setAttribute(element, 'name', name);
            element.value = value;
            return element;
        },
        _genOption = function(label, value, selected) {
            return new Option(label, value, selected);
        },
        _genInputField = function(name, value, type) {
            var field = _genField('input', name, value);
            Dom.setAttribute(field, 'type', 'text');
            return field;
        },
        _genRadioField = function(name, label, value, checked) {
            var radioContainer = document.createElement('span'),
                labelElem = document.createElement('label'),
                field = _genField('input', name, value),
                fieldId = Dom.generateId();

            Dom.addClass(radioContainer, CLASSES.RADIO_ITEM_CONTAINER)
            Dom.setAttribute(field, 'id', fieldId);
            Dom.setAttribute(labelElem, 'for', fieldId);
            labelElem.innerHTML = label;

            Dom.setAttribute(field, 'type', 'radio');
            if(checked) {
                Dom.setAttribute(field, 'checked', 'checked');
            }
            radioContainer.appendChild(field);
            radioContainer.appendChild(labelElem);
            return radioContainer;
        },
        /**
         * Generates an input element for the editing
         * @method genTextField
         * @private
         * @param {String} name The name of the text field
         * @param {String} value The value of the text field
         * @returns An input (text type) element
         * @type HTMLInputElement
         */
        genTextField = function(name, value) {
            return _genInputField(name, value, 'text');
        },

        /**
         * Generates a textarea element for the editing
         * @method genTextAreaField
         * @private
         * @param {String} name The name of the textarea field
         * @param {String} value The value of the textarea field
         * @returns A textarea element
         * @type HTMLTextareaElement
         */
        genTextAreaField = function(name, value) {
            var field = _genField('textarea', name, value);
            Dom.setAttribute(field, 'rows', 10);
            Dom.setAttribute(field, 'cols', 40);
            return field;
        },
        genSelectField = function(name, value, selectableValues) {
            var field = _genField('select', name, ''), option;
            for(var label in selectableValues) {
                field.appendChild(_genOption(label, selectableValues[label], (label == value || selectableValues[label] == value)));
            }
            return field;
        },
        genRadioField = function(name, value, selectableValues) {
            var field = document.createElement('span'),
                radio;
            Dom.addClass(field, CLASSES.RADIO_GROUP_CONTAINER);
            for(var label in selectableValues) {
                radio = _genRadioField(name, label, selectableValues[label], (label == value || selectableValues[label] == value))
                field.appendChild(radio);
            }
            return field;
        },
        /**
         * Collects the element values of a form
         * @method getFormValues
         * @param {HTMLFormElement} form The form element
         * @returns an object, where the key is the name of the input field
         *  and the value is the the value of the input field
         * @type String
         */
        getFormValues = function(form) {
            var elements,
                values = {};

            if(form && form.nodeName == 'FORM') {
                elements = form.elements;

                for (var i = 0, el = elements.length, elem, name, value, type; i < el; i++) {
                    elem = elements[i];
                    name = Dom.getAttribute(elem, 'name');
                    if(name) {
                        switch(elem.nodeName) {
                            case 'INPUT':
                                if(Dom.getAttribute(elem, 'type') != 'radio' || elem.checked) {
                                    values[name] = elem.value;
                                }
                                break;
                            default:
                                values[name] = elem.value;
                        }
                    }
                }
            }
            return values;
        },

        /**
         * Method allows to control the saving and cancelling with keyboard
         * @method _attachKeyListeners
         * @private
         * @param {HTMLElement} field The form element where need to attach key listener events
         * @param {YAHOO.widget.InlineEditor} scope An inline editor instance
         * @param {Object} saveKeys The object literal representing the key(s) to detect.
         * Possible attributes are shift(boolean), alt(boolean), ctrl(boolean) and keys(either
         * an int oran array of ints representing keycodes).
         * @param {Object} cancelKeys The object literal representing the key(s) to detect.
         * Possible attributes are shift(boolean), alt(boolean), ctrl(boolean) and keys(either
         * an int oran array of ints representing keycodes).
         */
        _attachKeyListeners = function(field, scope, saveKeys, cancelKeys) {
            var _ret = false,
                KeyListener = YU.KeyListener;
            if(field) {
                new KeyListener(field, saveKeys, {fn: scope.save, scope: scope, correctScope: true}).enable();
                new KeyListener(field, cancelKeys, {fn: scope.cancel, scope: scope, correctScope: true}).enable();
                _ret = true;
            }
            return _ret;
        }
        ;



    YAHOO.extend(InlineEditor, YAHOO.util.AttributeProvider, {
        /**
         * Saves the value, triggers the saveEvent event
         * The method runs when user clicks on the save button, or
         * press enter (or cntrl enter in textarea) in the edit
         * field
         * @method save
         * @returns true if the saving was succes
         * @type Boolean
         */
        save: function() {
            var values = getFormValues(this._editor),
                value = YL.trim(values[this.get('fieldName')]),
                preprocess = this.get('processBeforeSave'),
                validator = this.get('validator'),
                _ret = false;

            value = preprocess.call(this, value);
            if(value == '' && !this.get('allowEmpty')) {
                Y.log("the field value is empty and it's not allowed");
                this.fireEvent(emptyValueEvent);
            } else {
                if(validator.call(this, value)) {
                    this.set('value', value);
                    this._stopEdit();
                    this.fireEvent(saveEvent, value, values);
                    _ret = true;
                } else {
                    this.fireEvent(valueNotValidEvent);
                }
            }
            return _ret;
        },
        /**
         * Drops all of the changes in the field, and restores the
         * original state
         * The method runs when user clicks on the cancel button, or
         * press escape in the edit * field
         * @method save
         * @returns true if the cancelling was succes
         * @type Boolean
         */
        cancel: function() {
            this._stopEdit();
            this.fireEvent(cancelEvent);
            return true;
        },
        /**
         * Starts the editing, replace the content of the editable
         * element to a form what can be editable
         * @method edit
         * @returns true if the edit successfully started
         * @type Boolean
         */
        edit: function() {
            if(this._editStarted) return false;
            var element = this.get('element');
            Dom.addClass(element, CLASSES.EDITING_ACTIVE);
            this._replaceElement();
            this._editStarted = true;
            this.fireEvent(editStartedEvent);
            return true
        },
        _stopEdit: function() {
            if(!this._editStarted) return false;
            var element = this.get('element');
            Dom.removeClass(element, CLASSES.EDITING_ACTIVE);
            this._restoreElement();
            this._editStarted = false;
            return true;
        },
        _setEditable: function() {
            var element = this.get('element');
            Dom.addClass(element, CLASSES.ELEM_EDITABLE);
            Event.on(element, 'click', function(e) {
                var target = Event.getTarget(e);
                if(target == element && !this._editStarted) {
                    this.edit();
                }
            }, this, true);
        },
        _createEditor: function() {
            var form = createForm(this.get('id')),
                type = this.get('type'),
                value = this.get('value'),
                preprocess = this.get('processBeforeRead'),
                fieldName = this.get('fieldName'),
                selectableValues = this.get('selectableValues'),
                generator = this.get('fieldGenerator'),
                field;

                if(YL.isFunction(preprocess)) {
                    value = preprocess.call(this, value);
                }
                field = generator.call(this, type, fieldName, value, selectableValues),
                _attachKeyListeners(field, this, this.get('saveKeys'), this.get('cancelKeys'));

                _ret = false;

            if(field.nodeType === 1) {
                this._createControls();
                form.appendChild(field);
                form.appendChild(this.controls.container);
                Event.on(form, 'submit', Event.stopEvent);
                _ret = form;
            }
            return _ret
        },
        _replaceElement: function() {
            var element = this.get('element'),
                editor = this._createEditor();

            if(!editor) {
                Y.log('editor is not an element', 'error');
                return false;
            }
            element.innerHTML = '';
            element.appendChild(editor);
            try {
                editor.elements[0].focus();
            } catch(e){}
            this._editor = editor;
        },
        _restoreElement: function() {
            var element = this.get('element'),
                value = this.get('value'),
                type = this.get('type'),
                selectableValues = this.get('selectableValues'),
                html;

            if(YL.isObject(selectableValues)) {
                for (var label in selectableValues) {
                    if(selectableValues[label] == value) {
                        html = label;
                        break;
                    }
                }
            } else {
                html = value;
            }
            element.innerHTML = html;
            this._addEditControl();
            delete this._editor;
        },


        /**
         * Removes buttons from the dom and
         * deletes the references to them
         * @method _destroyControls
         * @private
         */
        _destroyControls: function() {
            var controls = this.controls,
                cancel,
                cancelParent,
                save,
                saveParent,
                container,
                containerParent;

            if(controls) {
                container = controls.container;
                if(container) {
                    containerParent = container.parentNode;
                    containerParent.removeChild(container);
                } else {
                    cancel = controls.cancel;
                    cancelParent = cancel.parentNode;
                    save = controls.save;
                    saveParent = cancel.parentNode;
                    save = controls.save;
                    saveParent = cancel.parentNode;
                    if(cancelParent) {
                        cancelParent.removeChild(cancel);
                        Y.log('cancel button removed', 'info');
                    }
                    if(saveParent) {
                        saveParent.removeChild(save);
                        Y.log('save button removed', 'info');
                    }
                }

                delete this.controls;
            }
        },
        /**
         * Creates the control buttons, like edit button,
         * save button, and cancel button
         * @method _createControls
         * @param {String} type If the value is 'edit' then
         * the edit button will be created, otherwise the
         * save and cancel buttons
         * @private
         */
        _createControls: function(type) {
            var button = document.createElement('button'),
                container = document.createElement('span'),
                cancelButton,
                saveButton,
                editButton;

            Dom.setAttribute(button, 'type', 'button');
            Dom.addClass(button, 'yui-inline-editor-button');
            this._destroyControls();
            Dom.addClass(container, CLASSES.CONTROLS_CONTAINER);

            switch(type) {
                case 'edit':
                    editButton = button.cloneNode(false);
                    Dom.addClass(editButton, CLASSES.EDIT_BUTTON);
                    editButton.innerHTML = 'edit';
                    Event.on(editButton, 'click', function(event) {
                        this.edit(event);
                        this.fireEvent(editClickEvent, event);
                    }, this, true);
                    container.appendChild(editButton);
                    this.controls = {
                        edit: editButton,
                        container: container
                    };
                    break;

                default:
                    cancelButton = button.cloneNode(false);
                    saveButton = button.cloneNode(false);
                    Dom.addClass(cancelButton, CLASSES.CANCEL_BUTTON);
                    Dom.addClass(saveButton, CLASSES.SAVE_BUTTON);
                    cancelButton.innerHTML = 'cancel';
                    saveButton.innerHTML = 'save';
                    Event.on(cancelButton, 'click', function(event) {
                        this.cancel(event);
                        this.fireEvent(cancelClickEvent, event);
                    }, this, true);
                    Event.on(saveButton, 'click', function(event) {
                        this.save(event);
                        this.fireEvent(saveClickEvent, event);
                    }, this, true);
                    container.appendChild(cancelButton);
                    container.appendChild(saveButton);

                    this.controls = {
                        cancel: cancelButton,
                        save: saveButton,
                        container: container
                    };
                    break;
            }
        },
        /**
         * Adds the edit button to editable element.
         * @method _addEditControl
         * @private
         */
        _addEditControl: function() {
            this._createControls('edit');

            var element = this.get('element'),
                controlsContainer = document.createElement('span'),
                controls = this.controls;

            element.appendChild(controls.container);

        },
        _getValue: function() {
            var htmlValue = this.get('htmlValue'),
                selectableValues = this.get('selectableValues'),
                _ret;

            if(YL.isObject(selectableValues)) {
                for(var key in selectableValues) {
                    if(key == htmlValue) {
                        _ret = selectableValues[key];
                        break;
                    }
                }
            } else {
                _ret = htmlValue;
            }
            return _ret;
        },
        _setValue: function(value) {
            var htmlValue = this.get('htmlValue'),
                selectableValues = this.get('selectableValues');

            if(YL.isObject(selectableValues)) {
                for(var key in selectableValues) {
                    if(selectableValues[key] == value) {
                        this.set('htmlValue', key);
                        break;
                    }
                }
            } else {
                this.set('htmlValue', value);
            }
        },
        _getSaveKeys: function(value) {
            if(!YL.isObject(value)) {
                switch(this.get('type')) {
                    case 'textarea':
                        value = {ctrl: true, keys:[13]};
                        break;
                    default:
                        value = {keys:[13]};
                        break;


                }
            }
            return value;
        },
        _getCancelKeys: function(value) {
            if(!YL.isObject(value)) {
                value = {keys: [27]};
            }
            return value;
        },


        init: function(el, cfg) {
            var element = Dom.get(el);
            if(!element) {
                Y.log('Inline Editor element not found', 'error');
                return false;
            }
            cfg = cfg || {};
            this.setAttributeConfig('id', {
                value: Dom.generateId(),
                readOnly: true
            });
            this.setAttributeConfig('element', {
                value: element,
                readOnly: true
            });
            /**
             * @attribute type
             * @type String
             * The type of the inline editor. If it's not specified
             * in the config then the default value is normally 'text'
             */
            this.setAttributeConfig('type', {
                validator: validateType,
                value: cfg.type || DEFAULT_CONFIG.TYPE
            });
            /**
             * @attribute fieldName
             * @type String
             * The name of the edit field. Default is 'field'
             */
            this.setAttributeConfig('fieldName', {
                validator: YL.isString,
                value: cfg.fieldName || DEFAULT_CONFIG.FIELD_NAME
            });
            /**
             * @attribute fieldGenerator
             * @type Function
             * You can define a custom method what generates the edit field.
             * With that option you can create custom edit fields
             * @param {String} type
             * @param {String} fieldName
             * @param {String | Integer} value
             * @param {Object} selectableValues
             */
            this.setAttributeConfig('fieldGenerator', {
                validator: YL.isFunction,
                value: cfg.fieldGenerator || DEFAULT_CONFIG.FIELD_GENERATOR
            });
            this.setAttributeConfig('htmlValue', {
                value: element.innerHTML
            })
            /**
             * @attribute value
             * The current value of the field
             */
            this.setAttributeConfig('value', {
                getter: this._getValue,
                method: this._setValue
            });
            /**
             * @attribute selectableValues
             * @type Object
             * This option is used to set the possible selectable values for 'select' and 'radio'
             * editor types
             * It should be an object with key - value pairs:
             *  the key will be displayed for the user.
             *  For example, if you creates a editor which type is select do this:
             *      select fields: {foo:1,bar:2}
             *  the value of the options will be the numbers and the foo/bar will be used as the
             *  inner HTML of the option
             */
            this.setAttributeConfig('selectableValues', {
                validator: YL.isObject,
                value: YL.isObject(cfg.selectableValues) ? cfg.selectableValues : DEFAULT_CONFIG.POSSIBLE_VALUES
            });
            /**
             * @attribute allowEmpty
             * @type Boolean
             * Set to true if you want to allow to save an empty editor
             */
            this.setAttributeConfig('allowEmpty', {
                value: YL.isBoolean(cfg.allowEmpty) ? cfg.allowEmpty : DEFAULT_CONFIG.ALLOW_EMPTY
            });

            /**
             * @attribute processBeforeRead
             * @type Function
             * If you need to mainpulate the value before saving, you can use this config option.
             * The value of the config should be a function which returns the processed value
             */
            this.setAttributeConfig('processBeforeRead', {
                validator: YL.isFunction,
                value: YL.isFunction(cfg.processBeforeRead) ? cfg.processBeforeRead : DEFAULT_CONFIG.PROCESS_BEFORE_READ_METHOD
            });
            /**
             * @attribute processBeforeSave
             * @type Function
             * If you need to mainpulate the value before saving, you can use this config option.
             * The value of the config should be a function which returns the processed value
             */
            this.setAttributeConfig('processBeforeSave', {
                validator: YL.isFunction,
                value: YL.isFunction(cfg.processBeforeSave) ? cfg.processBeforeSave : DEFAULT_CONFIG.PROCESS_BEFORE_SAVE_METHOD
            });
            /**
             * @attribute validator
             * @type Function
             * If you need to validate the value before saving, you can use this config option.
             * @returns true if the value is valid
             */
            this.setAttributeConfig('validator', {
                validator: YL.isFunction,
                value: YL.isFunction(cfg.validator) ? cfg.validator : DEFAULT_CONFIG.VALIDATION_METHOD
            });

            /**
             * @attribute saveKeys
             * @type Object
             * The attribute is to override the default key listeners to save the editor's value
             * @see YAHOO.util.KeyListener
             */
            this.setAttributeConfig('saveKeys', {
                validator: YL.isObject,
                getter: this._getSaveKeys,
                value: YL.isObject(cfg.saveKeys) ? cfg.saveKeys : null

            /**
             * @attribute cancelKeys
             * @type Object
             * The attribute is to override the default key listeners to cancel the editor
             * @see YAHOO.util.KeyListener
             */           });
            this.setAttributeConfig('cancelKeys', {
                validator: YL.isObject,
                getter: this._getCancelKeys,
                value: YL.isObject(cfg.cancelKeys) ? cfg.cancelKeys : null
            });

            this._addEditControl();
            this._setEditable();
        }
    });
})();
