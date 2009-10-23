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
            CONTROLS_CONTAINER: 'yui-inline-editor-controls-container',
            ELEM_EDITABLE: 'yui-inline-editor-editable',
            EDITING_ACTIVE: 'yui-inline-editor-editing',
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
         * Constant representing the valid inline editor types
         * @property VALID_TYPES
         * @private
         * @static
         * @final
         */
        VALID_TYPES         = ['text', 'textarea'],
        DEFAULT_CONFIG      = {
            /**
            * Constant representing the default editor type
            * @property TYPE
            * @namespace DEFAULT_CONFIG
            * @private
            * @static
            * @final
            */
            TYPE: 'text',
            ALLOW_EMPTY: false,
            FIELD_NAME: 'field',
            FIELD_GENERATOR: function() {
                var field;
                switch(this.get('type')) {
                    case 'text':
                        field = genTextField(this.get('fieldName'), this.get('value'));
                        _attachKeyListeners(field, this, {keys:[13]}, {keys: [27]});
                        break;
                    case 'textarea':
                        field = genTextAreaField(this.get('fieldName'), this.get('value'));
                        _attachKeyListeners(field, this, {ctrl: true, keys:[13]}, {keys: [27]});
                        break;
                }
                return field;
            }
        },
        /**
         * Validates the type of the editor
         * @method validateType
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
            return valid;
        },
        createForm = function(id) {
            var form = document.createElement('form');
            Dom.setAttribute(form, 'id', 'yui-inline-editor-' + id);
            Dom.addClass(form, 'yui-inline-editor-form');
            return form;
        },
        _genField = function(type, name, value) {
            if(!YL.isString(type)) {
                return false;
            }
            var element = document.createElement(type);
            Dom.setAttribute(element, 'name', name);
            element.value = value;
            return element;
        },
        genTextField = function(name, value) {
            return _genField('input', name, value);
        },

        genTextAreaField = function(name, value) {
            var field = _genField('textarea', name, value);
            Dom.setAttribute(field, 'rows', 10);
            Dom.setAttribute(field, 'cols', 40);
            return field;
        },
        getFormValues = function(form) {
            var values,
                elements;
            if(form && form.nodeName == 'FORM') {
                elements = form.elements;
                values = {};
                for (var i = 0, el = elements.length, elem, name, value; i < el; i++) {
                    elem = elements[i];
                    name = Dom.getAttribute(elem, 'name');
                    if(name) {
                        values[name] = elem.value;
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
            Y.log('Keylisteners attached: ' + _ret, 'info');
            return _ret;
        }
        ;



    YAHOO.extend(InlineEditor, YAHOO.util.AttributeProvider, {
        save: function() {
            var values = getFormValues(this._editor),
                value = YL.trim(values[this.get('fieldName')]);
            if(value == '' && !this.get('allowEmpty')) {
                Y.log("the field value is empty and it's not allowed");
                this.fireEvent(emptyValueEvent);
                return false;
            }
            this.set('value', value);
            this._stopEdit();
            this.fireEvent(saveEvent, values);
            return true;
        },
        cancel: function() {
            this._stopEdit();
            this.fireEvent(cancelEvent);
        },
        edit: function() {
            this._startEdit();
            this.fireEvent(editStartedEvent);
        },
        _startEdit: function() {
            var element = this.get('element');
            Dom.addClass(element, CLASSES.EDITING_ACTIVE);
            this._replaceElement();
        },
        _stopEdit: function() {
            var element = this.get('element');
            Dom.removeClass(element, CLASSES.EDITING_ACTIVE);
            this._restoreElement();
        },
        _setEditable: function() {
            var element = this.get('element');
            Dom.addClass(element, CLASSES.ELEM_EDITABLE);
        },
        _createEditor: function() {
            var form = createForm(this.get('id')),
                type = this.get('type'),
                generator = this.get('fieldGenerator'),
                field = generator.call(this),
                _ret = false;

            if(field.nodeType === 1) {
                this._createControls();
                form.appendChild(field);
                form.appendChild(this.controls.container);
                Event.on(form, 'submit', function(e) {
                    Event.stopEvent(e);
                });
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
            this._editor = editor;
        },
        _restoreElement: function() {
            var element = this.get('element');
            element.innerHTML = this.get('value');
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
                Y.log('controls destroyed', 'info');
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


        init: function(el, cfg) {
            var element = Dom.get(el);
            if(!element) {
                Y.log('Inline Editor element not found', 'error');
                return;
            }
            cfg = cfg || {};
            this.setAttributeConfig('id', {
                value: Dom.generateId(),
                readOnly: true
            });
            /**
             *
             */
            this.setAttributeConfig('element', {
                value: element,
                readOnly: true
            });
            /**
             * @attribute type
             * The type of the inline editor. If it's not specified
             * in the config then the default value is normally 'text'
             */
            this.setAttributeConfig('type', {
                validator: validateType,
                value: cfg.type || DEFAULT_CONFIG.TYPE
            });
            /**
             * @attribute fieldName
             */
            this.setAttributeConfig('fieldName', {
                validator: YL.isString,
                value: cfg.fieldName || DEFAULT_CONFIG.FIELD_NAME
            });
            /**
             * @attribute fieldGenerator
             */
            this.setAttributeConfig('fieldGenerator', {
                validator: YL.isFunction,
                value: cfg.fieldGenerator || DEFAULT_CONFIG.FIELD_GENERATOR
            });
            /**
             * @attribute displayValue
             */
            this.setAttributeConfig('displayValue', {
                value: cfg.displayValue || element.innerHTML
            });
            /**
             * @attribute value
             * The current value of the field
             */
            this.setAttributeConfig('value', {
                value: cfg.value || this.get('displayValue')
            });
            /**
             * @attribute allowEmpty
             * Set to true if you want to allow to save an empty editor
             */
            this.setAttributeConfig('allowEmpty', {
                value: YL.isBoolean(cfg.allowEmpty) ? cfg.allowEmpty : DEFAULT_CONFIG.ALLOW_EMPTY
            });

            this._addEditControl();
            this._setEditable();
        }
    });
})();