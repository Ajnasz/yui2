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
            TYPE: 'text'
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
        };



        YAHOO.extend(InlineEditor, YAHOO.util.AttributeProvider, {
            save: function() {
                this.fireEvent(saveEvent);
            },
            cancel: function() {
                this.fireEvent(cancelEvent);
            },
            edit: function() {
                this.fireEvent(editStartedEvent);
            },
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
                    containerParent = container.parentNode;
                    if(container) {
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
            _createControls: function() {
                var button = document.createElement('button'),
                    cancelButton = button.cloneNode(false),
                    saveButton = button.cloneNode(false),
                    editButton = button.cloneNode(false);

                // if the controls already exists, need to delete them
                this._destroyControls();

                Y.log('set class');
                Dom.addClass(cancelButton, CLASSES.CANCEL_BUTTON);
                Dom.addClass(saveButton, CLASSES.SAVE_BUTTON);
                Dom.addClass(editButton, CLASSES.EDIT_BUTTON);
                Y.log('set html');
                cancelButton.innerHTML = 'cancel';
                saveButton.innerHTML = 'save';
                editButton.innerHTML = 'edit';
                Y.log('set events');
                Event.on(cancelButton, 'click', function(event) {
                    this.cancel(event);
                    this.fireEvent(cancelClickEvent, event);
                }, this, true);
                Event.on(saveButton, 'click', function(event) {
                    this.save(event);
                    this.fireEvent(saveClickEvent, event);
                }, this, true);
                Event.on(editButton, 'click', function(event) {
                    this.edit(event);
                    this.fireEvent(editClickEvent, event);
                }, this, true);

                Y.log('set controls');
                this.controls = {
                    cancel: cancelButton,
                    save: saveButton
                };
            },
            _addControls: function() {
                this._createControls();

                var element = this.get('element'),
                    controlsContainer = document.createElement('span'),
                    controls = this.controls;

                Dom.addClass(controlsContainer, CLASSES.CONTROLS_CONTAINER);

                controlsContainer.appendChild(controls.cancel);
                controlsContainer.appendChild(controls.save);
                element.appendChild(controlsContainer);

                controls.container = controlsContainer;
                
            },
            save: function() {
            },
            init: function(el, cfg) {
                var element = Dom.get(el);
                if(!element) {
                    Y.log('Inline Editor element not found', 'error');
                    return;
                }
                cfg = cfg || {};
                this.setAttributeConfig('element', { value: element });
                /**
                 * @attribute type
                 * The type of the inline editor. If it's not specified
                 * in the config then the default value is normally 'text'
                 */
                this.setAttributeConfig('type', {
                    validator: validateType,
                    value: cfg.type || DEFAULT_CONFIG.TYPE
                });

                this._addControls();
            }
        });

})();
