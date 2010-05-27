/**
 * Inline editor widget
 * @module inlineeditor
 */
(function() {

    /**
     * Inline editor widget
     * @namespace YAHOO.widget
     * @class InlineEditor
     * @extends YAHOO.util.AttributeProvider
     * @requires yahoo, dom, event, element
     * @constructor
     * @title InlineEditor widget
     * @param {HTMLElement | String} el The html element what will be
     * converted to an editable field
     * @param {Object} cfg (optional) Configurations as an object.
     * @beta
     */
    YAHOO.widget.InlineEditor = function(el, cfg) {
        cfg = YAHOO.lang.isObject(cfg) ? cfg : {};
        this.init(el, cfg);
    };

    var Y                   = YAHOO,
        YU                  = Y.util,
        YL                  = Y.lang,
        Event               = YU.Event,
        Dom                 = YU.Dom,
        InlineEditor        = YAHOO.widget.InlineEditor,
        widgetName          = 'InlineEditor',
        CLASSES             = {
            /**
             * Constant representing the default class of the cancel button
             * @config CLASSES.CANCEL_BUTTON
             * @type String
             * @namespace CLASSES
             * @final
             * @static
             * @private
             */
            CANCEL_BUTTON: 'yui-inline-editor-cancel',
            /**
             * Constant representing the default class of the save button
             * @config CLASSES.SAVE_BUTTON
             * @type String
             * @final
             * @static
             * @private
             */
            SAVE_BUTTON: 'yui-inline-editor-save',
            /**
             * Constant representing the default class of the edit button
             * @config CLASSES.EDIT_BUTTON
             * @type String
             * @final
             * @static
             * @private
             */
            EDIT_BUTTON: 'yui-inline-editor-edit',
            /**
             * Constant representing the default class of the lock marker button
             * @config CLASSES.LOCKED_BUTTON
             * @type String
             * @final
             * @static
             * @private
             */
            LOCKED_BUTTON: 'yui-inline-editor-lock-marker',
            /**
             * Constant representing the class of the button container element
             * @config CLASSES.CONTROLS_CONTAINER
             * @type String
             * @final
             * @static
             * @private
             */
            CONTROLS_CONTAINER: 'yui-inline-editor-controls',
            /**
             * Constant, used to mark editable elements
             * @config CLASSES.ELEM_EDITABLE
             * @type String
             * @final
             * @static
             * @private
             */
            ELEM_EDITABLE: 'yui-inline-editor-editable',
            /**
             * Constant, used to mark locked elements
             * @config CLASSES.LOCKED
             * @type String
             * @final
             * @static
             * @private
             */
            LOCKED: 'yui-inline-editor-locked',
            /**
             * Constant, used to mark when the elem editing is active
             * @config CLASSES.EDITING_ACTIVE
             * @type String
             * @final
             * @static
             * @private
             */
            EDITING_ACTIVE: 'yui-inline-editor-editing',
            /**
             * Constant, a class for the element which contains a radio field group
             * @config CLASSES.RADIO_GROUP_CONTAINER
             * @type String
             * @final
             * @static
             * @private
             */
            RADIO_GROUP_CONTAINER: 'yui-inline-editor-radio-group',
            /**
             * Constant, a class for the element which contains a radio field and
             * it's label
             * @config CLASSES.RADIO_ITEM_CONTAINER
             * @type String
             * @final
             * @static
             * @private
             */
            RADIO_ITEM_CONTAINER: 'yui-inline-editor-radio-item',
            /**
             * Constant, a class for the element which marks that the element is empty
             * @config CLASSES.EMPTY
             * @type String
             * @final
             * @static
             * @private
             */
            EMPTY: 'yui-inline-editor-empty'
        },
        STRINGS = {
            /**
             * Default innerHTML value of the edit button
             * @property InlineEditor.EDIT_BUTTON_TEXT
             * @static
             * @type String
             * @final
             */
            EDIT_BUTTON_TEXT:   'edit',
            /**
             * Default innerHTML value of the lock button which represents if a field
             * is not editable
             * @property InlineEditor.LOCK_BUTTON_TEXT
             * @static
             * @type String
             * @final
             */
            LOCK_BUTTON_TEXT:   'locked',
            /**
             * Default innerHTML value of the save button
             * @property InlineEditor.SAVE_BUTTON_TEXT
             * @static
             * @type String
             * @final
             */
            SAVE_BUTTON_TEXT:   'save',
            /**
             * Default innerHTML value of the cancel button which represents if a field
             * is not editable
             * @property InlineEditor.CANCEL_BUTTON_TEXT
             * @static
             * @type String
             * @final
             */
            CANCEL_BUTTON_TEXT: 'cancel',
            /**
             * Default innerHTML value of the field which has to be shown when the value is empty
             * @property InlineEditor.EMPTY_TEXT
             * @static
             * @type String
             * @final
             */
            EMPTY_TEXT:         'field is emtpy, please edit it'
        },
        /**
         * @event cancelEvent
         * @description Fires when a user cancels the editing
         * @type YAHOO.util.CustomEvent
         */
        cancelEvent         = 'cancelEvent',
        /**
         * @event saveEvent
         * @description Fires when a user saves the editor.
         *
         * second is an object which contains all of the form element's values.
         * If you create a custom editor with more than one fields, you can access
         * to the additional field values through the second argument
         * @type YAHOO.util.CustomEvent
         * @param {Object} arg An object which  has two properties:
         * <ul>
         * <li><code>value &lt;String&gt;</code> The value of the edit field</li>
         * <li><code>values &lt;Object&gt;</code> All of the form element's values.
         * Useful if you create a custom editor with more than one fields, you can
         * access to the additional field values through this property</li>
         * </ul>
         */
        saveEvent           = 'saveEvent',
        /**
         * @event beforeSaveEvent
         * @description Fires before the saving starts
         * @type YAHOO.util.CustomEvent
         */
        beforeSaveEvent     = 'beforeSaveEvent',
        /**
         * @event editStartedEvent
         * @description Fires when the node content has been replaced to
         * and editor field
         * @type YAHOO.util.CustomEvent
         */
        editStartedEvent    = 'editStartedEvent',
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
         * @event lockedClickEvent
         * @description Fires when a user clicks on the locked button
         * @type YAHOO.util.CustomEvent
         */
        lockedClickEvent      = 'lockedClickEvent',
        /**
         * @event emptyValueEvent
         * @description Fires when a user tries to save empty value
         * @type YAHOO.util.CustomEvent
         */
        emptyValueEvent     = 'emptyValueEvent',
        /**
         * @event elementReplacedEvent
         * @description Fires when the original element replaced to the editor
         * @type YAHOO.util.CustomEvent
         */
        elementReplacedEvent       = 'elementReplacedEvent',
        /**
         * @event beforeElementReplacedEvent
         * @description Fires before the original element replaced to the editor
         */
        beforeElementReplacedEvent = 'beforeElementReplacedEvent',
        /**
         * @event beforeElementReplacedEvent
         * @description Fires when the editor the original element
         */
        elementRestoredEvent       = 'elementRestoredEvent',
        /**
         * @event beforeElementReplacedEvent
         * @description Fires before the editor replaced to the original element
         */
        beforeElementRestoredEvent = 'beforeElementRestoredEvent',
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
        VALID_TYPES         = ['text', 'textarea', 'select', 'radio', 'checkbox'],
        /**
         * Generates a specified HTML element for the form
         * @method _genField
         * @private
         * @param {String} type The type of the edit field
         * @param {String} name The name of the edit field
         * @param {String} value The value of the edit field
         * @return {HTMLElement} The html input or textarea element which value and name is set
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
        /**
         * Generates an html option element
         * @method _genOption
         * @private
         * @param {String} label The shown text of the option
         * @param {String} value Value of the option
         * @param {Boolean} selected Should be selected or not
         * @return {HMLOptionElement} The option element
         */
        _genOption = function(label, value, selected) {
            var option = document.createElement('option');
            // option.innerHTML = label;
            option.value = value;
            option.text = label;
            option.innerHTML = label;
            option.selected = selected;
            return option;
        },
        /**
         * Generates a tex type input element
         * @method _genInputField
         * @private
         * @param {String} name The name of the field
         * @param {String} value The value of the field
         * @return {HTMLInputElement} An input element
         */
        _genInputField = function(name, value) {
            var field = _genField('input', name, value);
            Dom.setAttribute(field, 'type', 'text');
            return field;
        },
        /**
         * Generates a single radio input field with it's label
         * @method _genRadioField
         * @private
         * @param {String} name The name of the field
         * @param {String} label String shown in the label element
         * @param {String} value Value of the field
         * @param {Boolean} checked Should set the checked attribute for the elment or not
         * @return {HTMLSpanElement} A span element contains the field and it's label element
         */
        _genRadioField = function(name, label, value, checked) {
            var radioContainer = document.createElement('span'),
            //    labelElem      = document.createElement('label'),
            //    field          = _genField('input', name, value),
            fieldId        = Dom.generateId();

            if(checked) {
              radioContainer.innerHTML = '<label for="' + fieldId + '">' + label + '</label><input type="radio" name="' + name + '" value="' + value + '" checked="checked">';
            } else {
              radioContainer.innerHTML = '<label for="' + fieldId + '">' + label + '</label><input type="radio" name="' + name + '" value="' + value + '">';
            }
            // Dom.addClass(radioContainer, CLASSES.RADIO_ITEM_CONTAINER);
            // Dom.setAttribute(field, 'id', fieldId);
            // Dom.setAttribute(labelElem, 'for', fieldId);
            // labelElem.innerHTML = label;

            // Dom.setAttribute(field, 'type', 'radio');
            // // need to set it here again, because IE sets the vlaue to 'on'
            // field.value = value;
            // field.name = name;
            // if(checked) {
            //    field.checked = true;
            // }
            // Y.log('name = ' + field.name + ', value = ' + field.value + ', checked = ' + field.checked);
            return radioContainer;
        },
        /**
         * Generates an input element for the editing
         * @method genTextField
         * @private
         * @param {String} name The name of the text field
         * @param {String} value The value of the text field
         * @return {HTMLInputElement} An INPUT (text type) element
         */
        genTextField = function(name, value) {
            return _genInputField(name, value, 'text');
        },
        /**
         * Generates an INPUT (checkbox type) inside a LABEL element
         * @method genCheckboxField
         * @private
         * @param {String} name The name of the text field
         * @param {String} value The value of the text field
         * @return {HTMLInputElement} A LABEL element
         */
        genCheckboxField = function(name, value) {
            var labelElem = document.createElement('label');
            if(value === true) {
              labelElem.innerHTML = '<input type="checkbox" name="' + name + '" value="1" id="' + Dom.generateId() + '" checked="checked">';
            } else {
              labelElem.innerHTML = '<input type="checkbox" name="' + name + '" value="1" id="' + Dom.generateId() + '">';
            }
            return labelElem;
        },
        /**
         * Generates a textarea element for the editing
         * @method genTextAreaField
         * @private
         * @param {String} name The name of the textarea field
         * @param {String} value The value of the textarea field
         * @return {HTMLTextareaElement} A textarea element
         */
        genTextAreaField = function(name, value) {
            var field = _genField('textarea', name, value);
            Dom.setAttribute(field, 'rows', 10);
            Dom.setAttribute(field, 'cols', 40);
            return field;
        },
        /**
         * Generates a select field
         * @method genSelectField
         * @private
         * @param {String} name The name of the select field
         * @param {String} value The current value
         * @param {Object} selectableValues The possible option values
         * @return {HTMLSelectField} A select field
         */
        genSelectField = function(name, value, selectableValues) {
            var field = _genField('select', name, ''),
                label, option,
                i, sl, oValue, itemLabel, itemValue;
            if(YL.isArray(selectableValues)) {
                for (i = 0, sl = selectableValues.length; i < sl; i++) {
                    oValue = selectableValues[i];
                    itemLabel = oValue.label;
                    itemValue = oValue.value;

                    option = _genOption(itemLabel, itemValue, (itemLabel == value || itemValue == value));
                    field.appendChild(option);
                }
            } else {
              for(label in selectableValues) {
                  if(selectableValues.hasOwnProperty(label)) {
                      option = _genOption(label, selectableValues[label], (label == value || selectableValues[label] == value));
                      field.appendChild(option);
                  }
              }
            }
            return field;
        },
        /**
         * Generates a radio field group
         * @method genRadioField
         * @private
         * @param {String} name The name of the radio field
         * @param {String} value The current value
         * @param {Object} selectableValues The possible input values
         * @return {HTMLSpanElement} A span element which contains all of the radio fields
         */
        genRadioField = function(name, value, selectableValues) {
            var field = document.createElement('span'),
                radio,
                label,
                i, sl, oValue, itemLabel, itemValue;
            Dom.addClass(field, CLASSES.RADIO_GROUP_CONTAINER);
            if(YL.isArray(selectableValues)) {
                for (i = 0, sl = selectableValues.length; i < sl; i++) {
                    oValue = selectableValues[i];
                    itemLabel = oValue.label;
                    itemValue = oValue.value;
                    radio = _genRadioField(name, label, itemValue, (itemLabel == value || itemValue == value));
                    field.appendChild(radio);
                }
            } else {
              for(label in selectableValues) {
                  if(selectableValues.hasOwnProperty(label)) {
                      radio = _genRadioField(name, label, selectableValues[label], (label == value || selectableValues[label] == value));
                      field.appendChild(radio);
                  }
              }
            }
            return field;
        },
        /**
         * Collects the all of the values of the form
         * @method getFormValues
         * @param {HTMLFormElement} form The form element
         * @private
         * @return {String} an object, where the key is the name of the input field
         *  and the value is the the value of the input field
         */
        getFormValues = function(form) {
            var elements,
                values = {},
                i,
                el,
                elem,
                name,
                value,
                elemtype;


            if(form && form.nodeName == 'FORM') {
                elements = form.elements;
                el = elements.length;
                for (i=0; i < el; i++) {
                    elem = elements[i];
                    name = elem.name;
                    value = elem.value;
                    if(name) {
                        if(elem.nodeName == 'INPUT') {
                            elemtype = Dom.getAttribute(elem, 'type');

                            if(elemtype == 'checkbox') {
                                values[name] = elem.checked ? true : false;
                            } else if(elemtype != 'radio' || elem.checked) {

                                values[name] = value;
                            }
                        } else {
                            values[name] = value;
                        }
                    }
                }
            }
            return values;
        },

        DEFAULT_CONFIG      = {
            /**
             * Constant representing the default editor type
             * @property TYPE
             * @namespace DEFAULT_CONFIG
             * @type String
             * @private
             * @static
             * @final
             */
            TYPE: 'text',
            /**
             * Constant, allow to save the editor if empty or not by default
             * @property ALLOW_EMPTY
             * @namespace DEFAULT_CONFIG
             * @type Boolean
             * @private
             * @static
             * @final
             */
            ALLOW_EMPTY: false,
            /**
             * Constant representing the default field name
             * @property FIELD_NAME
             * @namespace DEFAULT_CONFIG
             * @type String
             * @private
             * @static
             * @final
             */
            FIELD_NAME: 'field',
            /**
             * Constant, a default method to generate the edit fields for the form
             * @property FIELD_GENERATOR
             * @namespace DEFAULT_CONFIG
             * @type Function
             * @private
             * @static
             * @final
             */
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

                    case 'checkbox':
                        field = genCheckboxField(fieldName, value, selectableValues);
                        break;
                }
                return field;
            },
            /**
             * Constant, a default method to process the new value before saving it
             * @property PROCESS_BEFORE_SAVE_METHOD
             * @namespace DEFAULT_CONFIG
             * @type Function
             * @return String The field value
             * @private
             * @static
             * @final
             */
            PROCESS_BEFORE_SAVE_METHOD: function(value) {
                return value;
            },
            /**
             * Constant, a default method to process the value befor read it into the editor
             * @property PROCESS_BEFORE_READ_METHOD
             * @namespace DEFAULT_CONFIG
             * @type Function
             * @return String The field value
             * @private
             * @static
             * @final
             */
            PROCESS_BEFORE_READ_METHOD: function(value) {
                return value;
            },
            /**
             * Validate the new value before save
             * @property VALIDATION_METHOD
             * @return Boolean The value is valid or not
             * @private
             * @final
             */
            VALIDATION_METHOD: function(value) {
                return true;
            },
            /**
             * Default value for the selectableValues attribute
             * @property SELECTABLE_VALUES
             * @type Object | Null
             * @private
             * @final
             */
            SELECTABLE_VALUES: null,
            /**
             * Default value for the animToColor attribute
             * @private ANIM_TO_COLOR
             * @type String
             * @private
             * @final
             */
            ANIM_TO_COLOR: '#D7EEFF',
            /**
             * Default value for the animFromColor attribute
             * @private ANIM_FROM_COLOR
             * @type String
             * @private
             * @final
             */
            ANIM_FROM_COLOR: '#FFFFFF',
            /**
             * Default value for the animOnMouseover attribute
             * @private ANIM_ON_MOUSEOVER
             * @type Boolean
             * @private
             * @final
             */
            ANIM_ON_MOUSEOVER: false,
            /**
             * Default value for the locked attribute
             * @private LOCKED
             * @type Boolean
             * @private
             * @final
             */
            LOCKED: false,
            /**
             * Set to true if the field need to be expanded
             * @property InlineEditor.DEFAULT_CONFIG.SET_FIELD_SIZE
             * @type Boolean
             * @default true
             */
            SET_FIELD_SIZE: true
        },
        /**
         * Validates the type of the editor
         * @method validateType
         * @private
         * @param {String} type The name of the editor type
         * @return {Boolean} true if the given type is allowed
         */
        validateType = function(type) {
            var valid = false,
                vl    = VALID_TYPES.length,
                i;
            if(YL.isString(type)) {
                for (i = 0; i < vl; i++) {
                    if(VALID_TYPES[i] === type) {
                        valid = true;
                        break;
                    }
                }
            }
            if(!valid) {
                Y.log('field type is invalid:  ' + valid, 'error', widgetName);
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
            var _ret        = false,
                KeyListener = YU.KeyListener,
                listener;
            if(field) {
                listener = new KeyListener(field, saveKeys, {fn: scope.save, scope: scope, correctScope: true});
                listener.enable();
                listener = new KeyListener(field, cancelKeys, {fn: scope.cancel, scope: scope, correctScope: true});
                listener.enable();
                _ret = true;
            }
            return _ret;
        },
        _preprocessHTMLValue = function(value) {
          var preprocess = this.get('processBeforeRead');
          if(YL.isFunction(preprocess)) {
            value = preprocess.call(this, value);
          }
          return value;
        };



    YL.extend(InlineEditor, YAHOO.util.AttributeProvider, {
        /**
         * Saves the value, triggers the saveEvent event
         * The method runs when user clicks on the save button, or
         * press enter (or cntrl enter in textarea) in the edit
         * field
         * @method save
         * @return {Boolean} true if the saving was succes
         */
        save: function() {
            this.fireEvent(beforeSaveEvent);
            var fieldName   = this.get('fieldName'),
                values      = getFormValues(this._editor),
                value       = YL.trim(values[fieldName]),
                validator   = this.get('validator'),
                _ret = false;

            if(value === '' && !this.get('allowEmpty')) {
                Y.log("the field value is empty and it's not allowed", 'warn', widgetName);
                this.fireEvent(emptyValueEvent);
            } else {
                if(validator.call(this, value)) {
                    this.set('value', value);
                    this._stopEdit();
                    this.fireEvent(saveEvent, {value: value, values: values});
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
         * press escape in the edit field
         * @method cancel
         * @return {Boolean} true if the cancelling was succes
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
         * @return {Boolean} true if the edit successfully started
         */
        edit: function() {
            if(this._editStarted || this.get('locked')) {return false;}
            var element = this.get('element');
            Dom.addClass(element, CLASSES.EDITING_ACTIVE);
            this._replaceElement();
            this._editStarted = true;
            this.fireEvent(editStartedEvent);
            return true;
        },
        /**
         * Stops the editing
         * @method _stopEdit
         * @private
         */
        _stopEdit: function() {
            if(!this._editStarted) {return false;}
            var element = this.get('element');
            Dom.removeClass(element, CLASSES.EDITING_ACTIVE);
            this._restoreElement();
            this._editStarted = false;
            return true;
        },
        /**
         * Attach buttons, event listeners to the editable element
         * @method _setEditable
         * @private
         */
        _setEditable: function() {
            var element = this.get('element');
            Dom.addClass(element, CLASSES.ELEM_EDITABLE);
            if(this.get('locked')) {
              Dom.addClass(element, CLASSES.LOCKED);
            }
            Event.on(element, 'click', function(e) {
                var target = Event.getTarget(e);
                if(target == element && !this._editStarted) {
                    this.edit();
                }
            }, this, true);
            if(this.get('animOnMouseover') && YL.isFunction(YU.ColorAnim)) {
                Event.on(element, 'mouseover', function() {
                    if(!this._editStarted) {
                        var fromColor = this.get('animFromColor'),
                            toColor = this.get('animToColor'),
                            anim = new YU.ColorAnim(element, {backgroundColor: {to: toColor, from: fromColor}}, 0.3);
                        anim.onComplete.subscribe(function() {
                            var anim = new YU.ColorAnim(element, {backgroundColor: {to: fromColor}}, 0.3);
                            anim.animate();
                        });
                        anim.animate();
                    }

                }, this, true);
            }
        },
        /**
         *
         * @method _createEditor
         * @private
         * @return {HTMLFormElement | False} returns a form element
         * or false if the edit field is not created
         */
        _createEditor: function() {
            var form = createForm(this.get('id')),
                type = this.get('type'),
                value = this.get('value'),
                fieldName = this.get('fieldName'),
                selectableValues = this.get('selectableValues'),
                generator = this.get('fieldGenerator'),
                _ret = false,
                field;

                field = generator.call(this, type, fieldName, value, selectableValues);

                _attachKeyListeners(field, this, this.get('saveKeys'), this.get('cancelKeys'));


            if(field.nodeType === 1) {
                this._createControls();
                form.appendChild(field);
                form.appendChild(this.controls.container);
                Event.on(form, 'submit', Event.stopEvent, Event, true);
                _ret = form;
            }
            return _ret;
        },
        /**
         * Replaces the editable element to a form
         * @method _replaceElement
         * @private
         */
        _replaceElement: function() {
            var element = this.get('element'),
                fieldName = this.get('fieldName'),
                editor  = this._createEditor(),
                field;

            if(!editor) {
                Y.log('editor is not an element', 'error', widgetName);
                return false;
            }
            this.fireEvent(beforeElementReplacedEvent);
            element.innerHTML = '';
            element.appendChild(editor);
            field = editor[fieldName];

            // need to focus with a latency, to give time for other stuffs to initializate
            // (basically the autocomplete inline editor needed that)
            setTimeout(function() {
              try {
                field.focus();
              } catch(e){}
            }, 100);
            if(this.get('setFieldSize')) {
              Dom.setStyle(field, 'width', editor.offsetWidth - 10 + 'px');
            }
            this._editor = editor;
            this.fireEvent(elementReplacedEvent);
        },
        /**
         * Removes the edit form and sets the editable element's content
         * to the current value
         * @method _restoreElement
         * @private
         */
        _restoreElement: function() {
            var element          = this.get('element'),
                value            = this.get('value'),
                htmlValue        = this.get('htmlValue'),
                selectableValues = this.get('selectableValues'),
                html,
                label,
                i, sl, oValue, itemLabel, itemValue;

            this.fireEvent(beforeElementRestoredEvent);
            if(YL.isArray(selectableValues)) {
                for (i = 0, sl = selectableValues.length; i < sl; i++) {
                    oValue = selectableValues[i];
                    itemLabel = oValue.label;
                    itemValue = oValue.value;
                    if(itemValue == value) {
                        html = itemLabel;
                        break;
                    }
                }
            } else if(YL.isObject(selectableValues)) {
                for (label in selectableValues) {
                    if(selectableValues[label] == value) {
                        html = label;
                        break;
                    }
                }
            } else {
                html = htmlValue;
            }
            if(!html) {
              html = this._yui_inline_editor_strings.EMPTY_TEXT;
            }

            element.innerHTML = html;
            this.fireEvent(elementRestoredEvent);
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
                if(container && container.parentNode) {
                    containerParent = container.parentNode;
                    containerParent.removeChild(container);
                } else {
                  if(controls.cancel) {
                    cancel = controls.cancel;
                    cancelParent = cancel.parentNode;
                    if(cancelParent) {
                        cancelParent.removeChild(cancel);
                        Y.log('cancel button removed', 'info', widgetName);
                    }
                    delete controls.cancel;
                  }
                  if(controls.save) {
                    save = controls.save;
                    saveParent = save.parentNode;
                    if(saveParent) {
                        saveParent.removeChild(save);
                        Y.log('save button removed', 'info', widgetName);
                    }
                    delete controls.save;
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
            var button    = document.createElement('button'),
                container = document.createElement('span'),
                strings   = this._yui_inline_editor_strings,
                cancelButton,
                saveButton,
                editButton,
                lockedButton;

            Dom.setAttribute(button, 'type', 'button');
            Dom.addClass(button, 'yui-inline-editor-button');
            Dom.addClass(container, CLASSES.CONTROLS_CONTAINER);

            this._destroyControls();

            if(type === 'edit') {
                editButton = button.cloneNode(false);
                lockedButton = button.cloneNode(false);
                Dom.addClass(editButton, CLASSES.EDIT_BUTTON);
                Dom.addClass(lockedButton, CLASSES.LOCKED_BUTTON);
                editButton.innerHTML = strings.EDIT_BUTTON_TEXT;
                lockedButton.innerHTML = strings.LOCK_BUTTON_TEXT;
                Event.on(editButton, 'click', function(event) {
                    this.edit(event);
                    this.fireEvent(editClickEvent, event);
                }, this, true);
                Event.on(lockedButton, 'click', function(event) {
                    this.fireEvent(lockedClickEvent, event);
                }, this, true);
                container.appendChild(editButton);
                container.appendChild(lockedButton);
                this.controls = {
                    edit: editButton,
                    locked: lockedButton,
                    container: container
                };
            } else {
                cancelButton = button.cloneNode(false);
                saveButton  = button.cloneNode(false);

                Dom.addClass(cancelButton, CLASSES.CANCEL_BUTTON);
                Dom.addClass(saveButton, CLASSES.SAVE_BUTTON);

                cancelButton.innerHTML = strings.CANCEL_BUTTON_TEXT;
                saveButton.innerHTML = strings.SAVE_BUTTON_TEXT;
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
            }
        },
        /**
         * Adds the edit button to editable element.
         * @method _addEditControl
         * @private
         */
        _addEditControl: function() {
            this._createControls('edit');

            var element  = this.get('element'),
                controls = this.controls;

            element.appendChild(controls.container);
        },
        /**
         * Returns the current value.
         * For some elements (eg select), the actual value and the displayed value
         * are not the same, this method returns the value
         * @method _getValue
         * @return String The actual value
         * @private
         */
        _getValue: function() {
            var htmlValue        = this.get('htmlValue'),
                selectableValues = this.get('selectableValues'),
                key,
                _ret,
                i, sl, oValue, itemLabel, itemValue;

            if(YL.isArray(selectableValues)) {
                for (i = 0, sl = selectableValues.length; i < sl; i++) {
                    oValue    = selectableValues[i];
                    itemLabel = oValue.label;
                    itemValue = oValue.value;
                    if(itemLabel == htmlValue) {
                        _ret = itemValue;
                        break;
                    }
                }
            } else if(YL.isObject(selectableValues)) {
                for(key in selectableValues) {
                    if(key == htmlValue) {
                        _ret = selectableValues[key];
                        break;
                    }
                }
            } else {
                _ret = htmlValue;
            }
            return _preprocessHTMLValue.call(this, _ret);
        },
        /**
         * Wrapper method, which used to set the htmlValue when the
         * current value is changed
         * @method _setValue
         * @param {String | Integer} value The new value to set
         * @private
         */
        _setValue: function(value) {
            var selectableValues = this.get('selectableValues'),
                key,
                i, sl, oValue, itemLabel, itemValue;

            if(YL.isArray(selectableValues)) {
                for (i = 0, sl = selectableValues.length; i < sl; i++) {
                    oValue    = selectableValues[i];
                    itemLabel = oValue.label;
                    itemValue = oValue.value;
                    if(itemValue == value) {
                        this.set('htmlValue', itemLabel);
                        break;
                    }
                }
            } else if(YL.isObject(selectableValues)) {
                for(key in selectableValues) {
                    if(selectableValues[key] == value) {
                        this.set('htmlValue', key);
                        break;
                    }
                }
            } else {
                this.set('htmlValue', value);
            }
        },
        /**
         * The save keys can be different for different type of editors.
         * If the saveKeys are not overwritten by a configuration, we
         * need to get the correct keys for all of the editor types
         * @method _getSaveKeys
         * @param {String} name
         * @param {Object} value
         * @return {Object} The save keys definition
         * @private
         */
        _getSaveKeys: function(name, value) {
            if(!YL.isObject(value)) {
                if(this.get('type') === 'textarea') {
                    value = {ctrl: true, keys:[13]};
                } else {
                    value = {keys:[13]};
                }
            }
            return value;
        },
        /**
         * The cancel keys can be different for different type of editors.
         * If the cancel are not overwritten by a configuration, we
         * need to get the correct keys for all of the editor types
         * @method _getCancelKeys
         * @param {String} name
         * @param {Object} value
         * @return {Object} The cancel keys definition
         * @private
         */
        _getCancelKeys: function(name, value) {
            if(!YL.isObject(value)) {
                value = {keys: [27]};
            }
            return value;
        },

        /**
         * Initialization method, it's called in the constructor.
         * Sets the configurations and adds the default listeners,
         * classes to the editable element
         * @method init
         * @param {String | HTMLElement} el The editable element
         * @param {Object} cfg (optional) Configurations as an object
         * @private
         */
        init: function(el, cfg) {
            var strings,
                element = Dom.get(el),
                elementInnerHTML;

            if(!element) {
                Y.log('Inline Editor element not found', 'error', widgetName);
                return false;
            }

            // overwrite the strings object to make possible to customize the button texts for each instance
            strings = YL.merge(STRINGS, YL.isObject(cfg.strings) ? cfg.strings : {});
            this._yui_inline_editor_strings = strings;

            elementInnerHTML = element.innerHTML;
            // if the html is the same as the empty text, than make the value empty
            if(elementInnerHTML === strings.EMPTY_TEXT) {
              elementInnerHTML = '';
            }
            cfg = cfg || {};
            /**
             * (Generated) ID of the editor
             * @attribute id
             * @type String
             * @final
             */
            this.setAttributeConfig('id', {
                value: Dom.generateId(),
                readOnly: true
            });
            /**
             * The editable element
             * @attribute element
             * @type HTMLElement
             * @default a reference to the editable element
             * @final
             */
            this.setAttributeConfig('element', {
                value: element,
                readOnly: true
            });
            /**
             * The type of the inline editor.
             * @attribute type
             * @default 'text'
             * @type String
             */
            this.setAttributeConfig('type', {
                validator: validateType,
                value: cfg.type || DEFAULT_CONFIG.TYPE
            });
            /**
             * The name of the edit field
             * @attribute fieldName
             * @default field
             * @type String
             */
            this.setAttributeConfig('fieldName', {
                validator: YL.isString,
                value: cfg.fieldName || DEFAULT_CONFIG.FIELD_NAME
            });
            /**
             * You can define a custom method what generates the edit field.
             * With that option you can create custom edit fields<br>
             * params:
             * <ul>
             * <li><strong>type</strong> String</li>
             * <li><strong>fieldName</strong> String </li>
             * <li><strong>value</strong> String | Integer</li>
             * <li<strong>selectableValues</strong> Object</li>
             * </ul>
             * @attribute fieldGenerator
             * @type Function
             */
            this.setAttributeConfig('fieldGenerator', {
                validator: YL.isFunction,
                value: cfg.fieldGenerator || DEFAULT_CONFIG.FIELD_GENERATOR
            });
            /**
             * The current html value of the field.
             * Mostly it's the same as the value property, but in some cases
             * (eg. with select field) it's different
             * @attribute htmlValue
             * @type String | Integer
             */
            this.setAttributeConfig('htmlValue', {
                value: elementInnerHTML
            });
            /**
             * The current value of the field
             * @attribute value
             * @type String | Integer
             */
            this.setAttributeConfig('value', {
                getter: this._getValue,
                method: this._setValue,
                setter: function(value) {
                  var preprocess = this.get('processBeforeSave');
                  if(YL.isFunction(preprocess)) {
                    value = preprocess.call(this, value);
                  }
                  return value;
                }
            });

            /**
             * This option is used to set the possible selectable values for 'select' and 'radio'
             * editor types
             * It should be an object with key - value pairs:
             *  the key will be displayed for the user.
             *  For example, if you creates a editor which type is select do this:<br/>
             *      <code>{foo:1,bar:2}</code><br/>
             *  the value of the options will be the numbers and the foo/bar will be used as the
             *  inner HTML of the option
             * @attribute selectableValues
             * @default null
             * @type Object
             */
            this.setAttributeConfig('selectableValues', {
                validator: YL.isObject,
                value: YL.isObject(cfg.selectableValues) ? cfg.selectableValues : DEFAULT_CONFIG.SELECTABLE_VALUES
            });
            /**
             * Set to true if you want to allow to save an empty editor
             * @attribute allowEmpty
             * @default false
             * @type Boolean
             */
            this.setAttributeConfig('allowEmpty', {
                value: YL.isBoolean(cfg.allowEmpty) ? cfg.allowEmpty : DEFAULT_CONFIG.ALLOW_EMPTY
            });

            /**
             * If you need to mainpulate the value before read it into the edit field,
             * you can use this config option.
             * The value of the config should be a function which returns the processed value
             * @attribute processBeforeRead
             * @type Function
             */
            this.setAttributeConfig('processBeforeRead', {
                validator: YL.isFunction,
                value: YL.isFunction(cfg.processBeforeRead) ? cfg.processBeforeRead : DEFAULT_CONFIG.PROCESS_BEFORE_READ_METHOD
            });
            /**
             * If you need to mainpulate the value before saving, you can use this config option.
             * The value of the config should be a function which returns the processed value
             * @attribute processBeforeSave
             * @type Function
             */
            this.setAttributeConfig('processBeforeSave', {
                validator: YL.isFunction,
                value: YL.isFunction(cfg.processBeforeSave) ? cfg.processBeforeSave : DEFAULT_CONFIG.PROCESS_BEFORE_SAVE_METHOD
            });
            /**
             * If you need to validate the value before saving, you can use this config option.
             * The value is passed as an argument
             * returns true if the value is valid
             * @attribute validator
             * @type Function
             */
            this.setAttributeConfig('validator', {
                validator: YL.isFunction,
                value: YL.isFunction(cfg.validator) ? cfg.validator : DEFAULT_CONFIG.VALIDATION_METHOD
            });

            /**
             * The config is to override the default key listeners to save the editor's value
             * @attribute saveKeys
             * @type Object
             * @see YAHOO.util.KeyListener
             */
            this.setAttributeConfig('saveKeys', {
                validator: YL.isObject,
                getter: this._getSaveKeys,
                value: YL.isObject(cfg.saveKeys) ? cfg.saveKeys : null
            });

            /**
             * The config is to override the default key listeners to cancel the editor
             * @attribute cancelKeys
             * @type Object
             * @see YAHOO.util.KeyListener
             */
            this.setAttributeConfig('cancelKeys', {
                validator: YL.isObject,
                getter: this._getCancelKeys,
                value: YL.isObject(cfg.cancelKeys) ? cfg.cancelKeys : null
            });

            /**
             * Change the bacgkground color of the editable element on mouse over.
             * @attribute animOnMouseover
             * @default true
             * @type String
             */
            this.setAttributeConfig('animOnMouseover', {
                validator: YL.isBoolean,
                value: YL.isBoolean(cfg.animOnMouseover) ? cfg.animOnMouseover : DEFAULT_CONFIG.ANIM_ON_MOUSEOVER
            });
            /**
             * Change the background color of the editable element to this color,
             * @attribute animToColor
             * @default #D7EEFF
             * @type String
             */
            this.setAttributeConfig('animToColor', {
                validator: YL.isString,
                value: YL.isString(cfg.animToColor) ? cfg.animToColor : DEFAULT_CONFIG.ANIM_TO_COLOR
            });

            /**
             * Change the background color of the editable element from this color,
             * @attribute animFromColor
             * @default #FFFFFF
             * @type String
             */
            this.setAttributeConfig('animFromColor', {
                validator: YL.isString,
                value: YL.isString(cfg.animFromColor) ? cfg.animFromColor : DEFAULT_CONFIG.ANIM_FROM_COLOR
            });

            /**
             * Set to true if you want to disable the editing
             * @attribute locked
             * @default false
             * @type Boolean
             */
            this.setAttributeConfig('locked', {
                validator: YL.isBoolean,
                value: YL.isBoolean(cfg.locked) ? cfg.locked : Dom.hasClass(this.get('element'), CLASSES.LOCKED) ? true : DEFAULT_CONFIG.LOCKED,
                method: function(value) {
                    if(value) {
                        this._stopEdit();
                        Dom.addClass(this.get('element'), CLASSES.LOCKED);
                    } else {
                        Dom.removeClass(this.get('element'), CLASSES.LOCKED);
                    }
                }
            });
            /**
             * If it's true, the edit field will be resized. It's size is the same as it's form's size but -10px.
             * @attribute setFieldSize
             * @default true
             * @type Boolean
             */
            this.setAttributeConfig('setFieldSize', {
                validator: YL.isBoolean,
                value: YL.isBoolean(cfg.setFieldSize) ? cfg.setFieldSize : DEFAULT_CONFIG.SET_FIELD_SIZE
            });

            if(this.get('value') === '' || Dom.hasClass(this.get('element'), CLASSES.EMPTY)) {
              this.get('element').innerHTML = this._yui_inline_editor_strings.EMPTY_TEXT;
            }
            this._addEditControl();
            this._setEditable();
        }
    });
    InlineEditor.STRINGS = STRINGS;
    InlineEditor.DEFAULT_CONFIG = DEFAULT_CONFIG;
})();
