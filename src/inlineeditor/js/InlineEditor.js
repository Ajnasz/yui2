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
            FIELD_NAME: 'field',
            FIELD_GENERATOR: function() {
                var field;
                switch(this.get('type')) {
                    case 'text':
                        field = genTextField(this.get('fieldName'), this.get('value'));
                        break;
                    case 'textarea':
                        field = genTextAreaField(this.get('fieldName'), this.get('value'));
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
        genTextField = function(name, value) {
            var element = document.createElement('input');
            Dom.setAttribute(element, 'name', name);
            Dom.setAttribute(element, 'value', value);
            return element;
        },
        genTextAreaField = function(name, value) {
            var element = document.createElement('textarea');
            Dom.setAttribute(element, 'name', name);
            Dom.setAttribute(element, 'value', value);
            return element;
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
        };



    YAHOO.extend(InlineEditor, YAHOO.util.AttributeProvider, {
        save: function() {
            var values = getFormValues(this._editor);
            this.set('value', values[this.get('fieldName')]);
            this._stopEdit();
            this.fireEvent(saveEvent, values);
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
                field = generator.call(this);

            if(field.nodeType === 1) {
                this._createControls();
                form.appendChild(field);
                form.appendChild(this.controls.container);
            }
            return form;
        },
        _replaceElement: function() {
            var element = this.get('element'),
                editor = this._createEditor();
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
         * TODO finish this
         */
        _attachKeyListeners: function() {
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
                    Y.log('set html');
                    cancelButton.innerHTML = 'cancel';
                    saveButton.innerHTML = 'save';
                    Y.log('set events');
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

                    Y.log('set controls');
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

            this._addEditControl();
            this._setEditable();
        }
    });
})();
