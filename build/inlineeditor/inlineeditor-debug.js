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
             * The default class of buttons
             * @config CLASSES.BUTTON
             * @type String
             * @namespace CLASSES
             * @final
             * @static
             * @private
             */
            BUTTON: 'yui-inline-editor-button',
            /**
             * Represents the default class of the cancel button
             * @config CLASSES.CANCEL_BUTTON
             * @type String
             * @namespace CLASSES
             * @final
             * @static
             * @private
             */
            CANCEL_BUTTON: 'yui-inline-editor-cancel',
            /**
             * Represents the default class of the save button
             * @config CLASSES.SAVE_BUTTON
             * @type String
             * @final
             * @static
             * @private
             */
            SAVE_BUTTON: 'yui-inline-editor-save',
            /**
             * Represents the default class of the edit button
             * @config CLASSES.EDIT_BUTTON
             * @type String
             * @final
             * @static
             * @private
             */
            EDIT_BUTTON: 'yui-inline-editor-edit',
            /**
             * Represents the default class of the lock marker button
             * @config CLASSES.LOCKED_BUTTON
             * @type String
             * @final
             * @static
             * @private
             */
            LOCKED_BUTTON: 'yui-inline-editor-lock-marker',
            /**
             * Represents the class of the button container element
             * @config CLASSES.CONTROLS_CONTAINER
             * @type String
             * @final
             * @static
             * @private
             */
            CONTROLS_CONTAINER: 'yui-inline-editor-controls',
            /**
             * Class to mark editable elements
             * @config CLASSES.ELEM_EDITABLE
             * @type String
             * @final
             * @static
             * @private
             */
            ELEM_EDITABLE: 'yui-inline-editor-editable',
            /**
             * Class to mark locked elements
             * @config CLASSES.LOCKED
             * @type String
             * @final
             * @static
             * @private
             */
            LOCKED: 'yui-inline-editor-locked',
            /**
             * Class to mark when the elem editing is active
             * @config CLASSES.EDITING_ACTIVE
             * @type String
             * @final
             * @static
             * @private
             */
            EDITING_ACTIVE: 'yui-inline-editor-editing',
            /**
             * A class for the element which contains a radio field group
             * @config CLASSES.RADIO_GROUP_CONTAINER
             * @type String
             * @final
             * @static
             * @private
             */
            RADIO_GROUP_CONTAINER: 'yui-inline-editor-radio-group',
            /**
             * A class for the element which contains a radio field and
             * it's label
             * @config CLASSES.RADIO_ITEM_CONTAINER
             * @type String
             * @final
             * @static
             * @private
             */
            RADIO_ITEM_CONTAINER: 'yui-inline-editor-radio-item',
            /**
             * A class for the element which marks that the element is empty
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
             * @property InlineEditor.STRINGS.EDIT_BUTTON_TEXT
             * @static
             * @type String
             */
            EDIT_BUTTON_TEXT:   'edit',
            /**
             * Default innerHTML value of the lock button which represents if a field
             * is not editable
             * @property InlineEditor.STRINGS.LOCK_BUTTON_TEXT
             * @static
             * @type String
             */
            LOCK_BUTTON_TEXT:   'locked',
            /**
             * Default innerHTML value of the save button
             * @property InlineEditor.STRINGS.SAVE_BUTTON_TEXT
             * @static
             * @type String
             */
            SAVE_BUTTON_TEXT:   'save',
            /**
             * Default innerHTML value of the cancel button which represents if a field
             * is not editable
             * @property InlineEditor.STRINGS.CANCEL_BUTTON_TEXT
             * @static
             * @type String
             */
            CANCEL_BUTTON_TEXT: 'cancel',
            /**
             * Default innerHTML value of the field which has to be shown when the value is empty
             * @property InlineEditor.STRINGS.EMPTY_TEXT
             * @static
             * @type String
             */
            EMPTY_TEXT:         'field is empty, click to edit it'
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
         * @type YAHOO.util.CustomEvent
         */
        beforeElementReplacedEvent = 'beforeElementReplacedEvent',
        /**
         * @event beforeElementReplacedEvent
         * @description Fires when the editor the original element
         * @type YAHOO.util.CustomEvent
         */
        elementRestoredEvent       = 'elementRestoredEvent',
        /**
         * @event beforeElementReplacedEvent
         * @description Fires before the editor replaced to the original element
         * @type YAHOO.util.CustomEvent
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
         * @event beforeEditEvent
         * @description Fires before the editing starts. If a subscribed
         * method returns false the editing won't start
         * @type YAHOO.util.CustomEvent
         */
        beforeEditEvent = 'beforeEditEvent',

        // variables for config names
        idConfig = 'id',
        elementConfig = 'element',
        typeConfig = 'type',
        fieldNameConfig = 'fieldName',
        fieldGeneratorConfig = 'fieldGenerator',
        htmlValueConfig = 'htmlValue',
        valueConfig = 'value',
        selectableValuesConfig = 'selectableValues',
        allowEmptyConfig = 'allowEmpty',
        processBeforeReadConfig = 'processBeforeRead',
        processBeforeSaveConfig = 'processBeforeSave',
        validatorConfig = 'validator',
        saveKeysConfig = 'saveKeys',
        cancelKeysConfig = 'cancelKeys',
        animOnMouseoverConfig = 'animOnMouseover',
        animToColorConfig = 'animToColor',
        animFromColorConfig = 'animFromColor',
        lockedConfig = 'locked',
        setFieldSizeConfig = 'setFieldSize',

        /**
         * Represents the valid inline editor types
         * @property VALID_TYPES
         * @type Array
         * @private
         * @static
         * @final
         * @default ['text', 'textarea', 'select', 'radio', 'checkbox']
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
             * @property InlineEditor.DEFAULT_CONFIG.TYPE
             * @type String
             * @default 'text'
             */
            TYPE: 'text',
            /**
             * Constant, allow to save the editor if empty or not by default
             * @property InlineEditor.DEFAULT_CONFIG.ALLOW_EMPTY
             * @type Boolean
             * @default FALSE
             */
            ALLOW_EMPTY: false,
            /**
             * Constant representing the default field name
             * @property InlineEditor.DEFAULT_CONFIG.FIELD_NAME
             * @type String
             * @default 'field'
             */
            FIELD_NAME: 'field',
            /**
             * Constant, a default method to generate the edit fields for the form
             * @property InlineEditor.DEFAULT_CONFIG.FIELD_GENERATOR
             * @type Function
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
             * A default method to process the new value before saving it
             * @property InlineEditor.DEFAULT_CONFIG.PROCESS_BEFORE_SAVE_METHOD
             * @type Function
             * @returns a string which is the field value
             */
            PROCESS_BEFORE_SAVE_METHOD: function(value) {
                return value;
            },
            /**
             * Constant, a default method to process the value befor read it into the editor
             * @property InlineEditor.DEFAULT_CONFIG.PROCESS_BEFORE_READ_METHOD
             * @type Function
             * @returns a string which is the field value
             */
            PROCESS_BEFORE_READ_METHOD: function(value) {
                return value;
            },
            /**
             * Validate the new value before save
             * @property InlineEditor.DEFAULT_CONFIG.VALIDATION_METHOD
             * @return a boolean, which is the value is valid or not
             * @default TRUE
             */
            VALIDATION_METHOD: function(value) {
                return true;
            },
            /**
             * Default value for the selectableValues attribute
             * @property InlineEditor.DEFAULT_CONFIG.SELECTABLE_VALUES
             * @type Object | Null
             * @default NULL
             */
            SELECTABLE_VALUES: null,
            /**
             * Default value for the animToColor attribute
             * @property InlineEditor.DEFAULT_CONFIG.ANIM_TO_COLOR
             * @type String
             * @default #D7EEFF
             */
            ANIM_TO_COLOR: '#D7EEFF',
            /**
             * Default value for the animFromColor attribute
             * @property InlineEditor.DEFAULT_CONFIG.ANIM_FROM_COLOR
             * @type String
             * @default #FFFFFF
             */
            ANIM_FROM_COLOR: '#FFFFFF',
            /**
             * Default value for the animOnMouseover attribute
             * @property InlineEditor.DEFAULT_CONFIG.ANIM_ON_MOUSEOVER
             * @type Boolean
             * @default FALSE
             */
            ANIM_ON_MOUSEOVER: false,
            /**
             * Default value for the locked attribute
             * @property InlineEditor.DEFAULT_CONFIG.LOCKED
             * @type Boolean
             * @default FALSE
             */
            LOCKED: false,
            /**
             * Set to true if the field need to be expanded
             * @property InlineEditor.DEFAULT_CONFIG.SET_FIELD_SIZE
             * @type Boolean
             * @default TRUE
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
        /**
         * Pass the current value through a user defined method
         * @method _preprocessHTMLValue
         * @param {String} value
         * @private
         * @return String The changed value
         */
        _preprocessHTMLValue = function(value) {
          var preprocess = this.get(processBeforeReadConfig);
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
            var fieldName   = this.get(fieldNameConfig),
                values      = getFormValues(this._editor),
                value       = YL.trim(values[fieldName]),
                validator   = this.get(validatorConfig),
                _ret = false;

            if(value === '' && !this.get(allowEmptyConfig)) {
                Y.log("the field value is empty and it's not allowed", 'warn', widgetName);
                this.fireEvent(emptyValueEvent);
            } else {
                if(validator.call(this, value)) {
                    this.set(valueConfig, value);
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
            if(this._editStarted || this.get(lockedConfig) || this.fireEvent(beforeEditEvent) === false) {return false;}
            var element = this.get(elementConfig);
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
            var element = this.get(elementConfig);
            Dom.removeClass(element, CLASSES.EDITING_ACTIVE);
            this._restoreElement();
            this._editStarted = false;
            return true;
        },
        /**
         * Attach buttons, event listeners to the editable element
         * @method _setEditable
         * @protected
         */
        _setEditable: function() {
            var element = this.get(elementConfig), anim,
                finisAnimation;
            Dom.addClass(element, CLASSES.ELEM_EDITABLE);
            if(this.get(lockedConfig)) {
              Dom.addClass(element, CLASSES.LOCKED);
            }
            Event.on(element, 'click', function(e) {
                var target = Event.getTarget(e);
                if(target == element && !this._editStarted) {
                    this.edit();
                }
            }, this, true);
            if(this.get(animOnMouseoverConfig) && YL.isFunction(YU.ColorAnim)) {
                finisAnimation = function() {
                    Dom.setStyle(element, 'background-color', '');
                };
                Event.on(element, 'mouseover', function() {
                    if(!this._editStarted && !this.get(lockedConfig)) {
                        var fromColor = this.get(animFromColorConfig),
                            toColor = this.get(animToColorConfig);
                        anim = new YU.ColorAnim(element, {
                          backgroundColor: {
                            to: toColor,
                            from: fromColor
                          }
                        }, 0.3);
                        anim.onComplete.subscribe(function() {
                            var anim = new YU.ColorAnim(element, {
                              backgroundColor: {
                                to: fromColor
                              }
                            }, 0.3);
                            anim.onComplete.subscribe(finisAnimation);
                            anim.animate();
                        });
                        anim.animate();
                    }

                }, this, true);
                this.subscribe(editStartedEvent, function() {
                  if(anim.isAnimated()) {
                    anim.stop();
                  }
                  finisAnimation();
                });
            }
        },
        /**
         * Generates the editor form
         * @method _createEditor
         * @protected
         * @return {HTMLFormElement | False} returns a form element
         * or false if the edit field is not created
         */
        _createEditor: function() {
            var form = createForm(this.get(idConfig)),
                type = this.get(typeConfig),
                value = this.get(valueConfig),
                fieldName = this.get(fieldNameConfig),
                selectableValues = this.get(selectableValuesConfig),
                generator = this.get(fieldGeneratorConfig),
                _ret = false,
                field;

                field = generator.call(this, type, fieldName, value, selectableValues);

                _attachKeyListeners(field, this, this.get(saveKeysConfig), this.get(cancelKeysConfig));


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
         * @protected
         */
        _replaceElement: function() {
            var element = this.get(elementConfig),
                fieldName = this.get(fieldNameConfig),
                editor  = this._createEditor(),
                field,
                size;

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
            if(this.get(setFieldSizeConfig)) {
              size = +Dom.getStyle(editor, 'width').replace('px', '');
              if(isNaN(size)) {
                size = editor.offsetWidth;
              }
              Dom.setStyle(field, 'width', +size - 10 + 'px');
            }
            this._editor = editor;
            this.fireEvent(elementReplacedEvent);
        },
        /**
         * Removes the edit form and sets the editable element's content
         * to the current value
         * @method _restoreElement
         * @protected
         */
        _restoreElement: function() {

            var element          = this.get(elementConfig),
                value            = this.get(valueConfig),
                htmlValue        = this.get(htmlValueConfig),
                selectableValues = this.get(selectableValuesConfig),
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
         * @protected
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
         * @protected
         */
        _createControls: function(type) {
            this._destroyControls();

            var button    = document.createElement('button'),
                container = document.createElement('span'),
                strings   = this._yui_inline_editor_strings,
                cancelButton,
                saveButton,
                editButton,
                lockedButton;

            // fixes #2528689
            // http://yuilibrary.com/projects/yui2/ticket/
            button.setAttribute('type', 'button');
            Dom.addClass(button, CLASSES.BUTTON);
            Dom.addClass(container, CLASSES.CONTROLS_CONTAINER);

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
         * @protected
         */
        _addEditControl: function() {
            this._createControls('edit');

            var element  = this.get(elementConfig),
                controls = this.controls;

            element.appendChild(controls.container);
        },
        /**
         * Returns the current value.
         * For some elements (eg select), the actual value and the displayed value
         * are not the same, this method returns the value
         * @method _getValue
         * @return String The actual value
         * @protected
         */
        _getValue: function() {
            var htmlValue        = this.get(htmlValueConfig),
                selectableValues = this.get(selectableValuesConfig),
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
         * @param {String} value The new value to set
         * @protected
         */
        _setValue: function(value) {
            var selectableValues = this.get(selectableValuesConfig),
                key,
                i, sl, oValue, itemLabel, itemValue;

            if(YL.isArray(selectableValues)) {
                for (i = 0, sl = selectableValues.length; i < sl; i++) {
                    oValue    = selectableValues[i];
                    itemLabel = oValue.label;
                    itemValue = oValue.value;
                    if(itemValue == value) {
                        this.set(htmlValueConfig, itemLabel);
                        break;
                    }
                }
            } else if(YL.isObject(selectableValues)) {
                for(key in selectableValues) {
                    if(selectableValues[key] == value) {
                        this.set(htmlValueConfig, key);
                        break;
                    }
                }
            } else {
                this.set(htmlValueConfig, value);
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
         * @protected
         */
        _getSaveKeys: function(name, value) {
            if(!YL.isObject(value)) {
                if(this.get(typeConfig) === 'textarea') {
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
         * @protected
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
         * @protected
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
            this.setAttributeConfig(idConfig, {
                value: Dom.generateId(),
                readOnly: true
            });
            /**
             * A reference to the editable element
             * @attribute element
             * @type HTMLElement
             * @final
             */
            this.setAttributeConfig(elementConfig, {
                value: element,
                readOnly: true
            });
            /**
             * The type of the inline editor.
             * @attribute type
             * @default 'text'
             * @type String
             */
            this.setAttributeConfig(typeConfig, {
                validator: validateType,
                value: cfg.type || DEFAULT_CONFIG.TYPE
            });
            /**
             * The name of the edit field
             * @attribute fieldName
             * @default 'field'
             * @type String
             */
            this.setAttributeConfig(fieldNameConfig, {
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
             * <li><strong>value</strong> String</li>
             * <li<strong>selectableValues</strong> Object</li>
             * </ul>
             * @attribute fieldGenerator
             * @type Function
             */
            this.setAttributeConfig(fieldGeneratorConfig, {
                validator: YL.isFunction,
                value: cfg.fieldGenerator || DEFAULT_CONFIG.FIELD_GENERATOR
            });
            /**
             * The current html value of the field.
             * Mostly it's the same as the value property, but in some cases
             * (eg. with select field) it's different
             * @attribute htmlValue
             * @type String
             */
            this.setAttributeConfig(htmlValueConfig, {
                value: elementInnerHTML
            });
            /**
             * The current value of the field
             * @attribute value
             * @type String
             */
            this.setAttributeConfig(valueConfig, {
                getter: this._getValue,
                method: this._setValue,
                setter: function(value) {
                  var preprocess = this.get(processBeforeSaveConfig);
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
             * @default NULL
             * @type Object
             */
            this.setAttributeConfig(selectableValuesConfig, {
                validator: YL.isObject,
                value: YL.isObject(cfg.selectableValues) ? cfg.selectableValues : DEFAULT_CONFIG.SELECTABLE_VALUES
            });
            /**
             * Set to true if you want to allow to save an empty editor
             * @attribute allowEmpty
             * @default FALSE
             * @type Boolean
             */
            this.setAttributeConfig(allowEmptyConfig, {
                value: YL.isBoolean(cfg.allowEmpty) ? cfg.allowEmpty : DEFAULT_CONFIG.ALLOW_EMPTY
            });

            /**
             * If you need to mainpulate the value before read it into the edit field,
             * you can use this config option.
             * The value of the config should be a function which returns the processed value
             * @attribute processBeforeRead
             * @type Function
             */
            this.setAttributeConfig(processBeforeReadConfig, {
                validator: YL.isFunction,
                value: YL.isFunction(cfg.processBeforeRead) ? cfg.processBeforeRead : DEFAULT_CONFIG.PROCESS_BEFORE_READ_METHOD
            });
            /**
             * If you need to mainpulate the value before saving, you can use this config option.
             * The value of the config should be a function which returns the processed value
             * @attribute processBeforeSave
             * @type Function
             */
            this.setAttributeConfig(processBeforeSaveConfig, {
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
            this.setAttributeConfig(validatorConfig, {
                validator: YL.isFunction,
                value: YL.isFunction(cfg.validator) ? cfg.validator : DEFAULT_CONFIG.VALIDATION_METHOD
            });

            /**
             * The config is to override the default key listeners to save the editor's value
             * @attribute saveKeys
             * @type Object
             * @see YAHOO.util.KeyListener
             */
            this.setAttributeConfig(saveKeysConfig, {
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
            this.setAttributeConfig(cancelKeysConfig, {
                validator: YL.isObject,
                getter: this._getCancelKeys,
                value: YL.isObject(cfg.cancelKeys) ? cfg.cancelKeys : null
            });

            /**
             * Change the bacgkground color of the editable element on mouse over.
             * @attribute animOnMouseover
             * @default TRUE
             * @type Boolean
             */
            this.setAttributeConfig(animOnMouseoverConfig, {
                validator: YL.isBoolean,
                value: YL.isBoolean(cfg.animOnMouseover) ? cfg.animOnMouseover : DEFAULT_CONFIG.ANIM_ON_MOUSEOVER
            });
            /**
             * Change the background color of the editable element to this color,
             * @attribute animToColor
             * @default #D7EEFF
             * @type String
             */
            this.setAttributeConfig(animToColorConfig, {
                validator: YL.isString,
                value: YL.isString(cfg.animToColor) ? cfg.animToColor : DEFAULT_CONFIG.ANIM_TO_COLOR
            });

            /**
             * Change the background color of the editable element from this color,
             * @attribute animFromColor
             * @default #FFFFFF
             * @type String
             */
            this.setAttributeConfig(animFromColorConfig, {
                validator: YL.isString,
                value: YL.isString(cfg.animFromColor) ? cfg.animFromColor : DEFAULT_CONFIG.ANIM_FROM_COLOR
            });

            /**
             * Set to true if you want to disable the editing
             * @attribute locked
             * @default FALSE
             * @type Boolean
             */
            this.setAttributeConfig(lockedConfig, {
                validator: YL.isBoolean,
                value: YL.isBoolean(cfg.locked) ? cfg.locked : Dom.hasClass(this.get(elementConfig), CLASSES.LOCKED) ? true : DEFAULT_CONFIG.LOCKED,
                method: function(value) {
                    if(value) {
                        this._stopEdit();
                        Dom.addClass(this.get(elementConfig), CLASSES.LOCKED);
                    } else {
                        Dom.removeClass(this.get(elementConfig), CLASSES.LOCKED);
                    }
                }
            });
            /**
             * If it's true, the edit field will be resized. It's size is the same as it's form's size but -10px.
             * @attribute setFieldSize
             * @default TRUE
             * @type Boolean
             */
            this.setAttributeConfig(setFieldSizeConfig, {
                validator: YL.isBoolean,
                value: YL.isBoolean(cfg.setFieldSize) ? cfg.setFieldSize : DEFAULT_CONFIG.SET_FIELD_SIZE
            });

            if(this.get(valueConfig) === '' || Dom.hasClass(element, CLASSES.EMPTY)) {
                element.innerHTML = this._yui_inline_editor_strings.EMPTY_TEXT;
                // Set the value to empty string if the field is defined as empty
                this.set(valueConfig, '');
            }
            this._addEditControl();
            this._setEditable();
        }
    });
    InlineEditor.STRINGS = STRINGS;
    InlineEditor.DEFAULT_CONFIG = DEFAULT_CONFIG;
})();
/**
 * Inline editor widget
 * @module inlineeditor
 * @namespace YAHOO.widget
 */
(function() {
    /**
     * Inline editor thing where the input field is autocomplete
     * @class AutocompleteEditor
     * @constructor
     * @extends YAHOO.widget.InlineEditor
     * @requires yahoo, dom, event, element
     * @title AutocompleteEditor widget
     * @param {HTMLElement | String} el The html element what will be
     * converted to an editable field
     * @param {Object} cfg (optional) Configurations as an object.
     * @beta
     */
    YAHOO.widget.AutocompleteEditor = function(el, cfg) {
        cfg = YAHOO.lang.merge(YAHOO.lang.isObject(cfg) ? cfg : {}, {type: 'autocomplete'});
        YAHOO.widget.AutocompleteEditor.superclass.constructor.call(this, el, cfg);
        this._autocompleteInit(el, cfg);
    };
    var Y                   = YAHOO,
        YU                  = Y.util,
        YL                  = Y.lang,
        // Event               = YU.Event,
        Dom                 = YU.Dom,
        // AutocompleteEditor  = YAHOO.widget.AutocompleteEditor,
        /**
         * @event acItemSelectEvent
         * @description Fires when an item is selected from autocomplete dropdown list
         * @type YAHOO.util.CustomEvent
         */
        acItemSelectEvent   = 'acItemSelectEvent',

        fieldGenerator = function() {
            var doc = document,
                container = doc.createElement('div'),
                field = doc.createElement('input'),
                results = doc.createElement('div');

            Dom.setAttribute(field, 'type', 'text');
            Dom.setAttribute(field, 'name', this.get('fieldName'));
            Dom.setAttribute(field, 'id', this.get('id') + '-field');
            Dom.setAttribute(results, 'id', this.get('id') + '-results');
            container.appendChild(field);
            container.appendChild(results);
            return container;
        },
        attachAutocomplete = function(field, container, dataSource) {
            return new Y.widget.AutoComplete(field, container, dataSource);
        },
        setLastSelected = function(args) {
            this.setAttributeConfig('lastSelected', {readOnly: true, value: args});
        };

        YAHOO.extend(YAHOO.widget.AutocompleteEditor, YAHOO.widget.InlineEditor, {
            _autocompleteInit: function(el, cfg) {
                this.set('fieldGenerator', fieldGenerator);
                this.setAttributeConfig('dataSource', {value: cfg.dataSource});
                /**
                * Stores the last selected autocomplete item properties
                * @config lastSelected
                * @default null
                * @type Array
                * @readonly
                */
                this.setAttributeConfig('lastSelected', {readOnly: true, value: null});
                /**
                 * Save the editor when user selects an item from the autocomplete
                 * @config saveOnSelect
                 * @default true
                 * @type Boolean
                 */
                this.setAttributeConfig('saveOnSelect', {
                    validator: YL.isBoolean,
                    value: YL.isBoolean(cfg.saveOnSelect) ? cfg.saveOnSelect : true
                });
                this.subscribe('editStartedEvent', function() {
                    setLastSelected.call(this, null);
                    this.set('value', '');
                });
                this.subscribe('elementReplacedEvent', function() {
                    var id = this.get('id'),
                    autocomplete = attachAutocomplete(id + '-field', id + '-results', this.get('dataSource')),
                    _editor = this;
                    autocomplete.itemSelectEvent.subscribe(function(eventName, args){
                        _editor.fireEvent(acItemSelectEvent, args);
                        setLastSelected.call(_editor, args);
                        if(_editor.get('saveOnSelect')) {
                            _editor.save();
                        }
                    });
                    /**
                     * Autocomplete instance
                     * @property autocomplete
                     * @type YAHOO.util.Autocomplete
                     * @readonly
                     */
                    this.autocomplete = autocomplete;
                });
            }
        });
})();
/**
 * Inline editor widget
 * @module inlineeditor
 * @namespace YAHOO.widget
 */
(function() {
    /**
     * Inline editor thing where the input field is autocomplete
     * @class CalendarEditor
     * @constructor
     * @extends YAHOO.widget.InlineEditor
     * @requires yahoo, dom, event, element
     * @title CalendarEditor widget
     * @param {HTMLElement | String} el The html element what will be
     * converted to an editable field
     * @param {Object} cfg (optional) Configurations as an object.
     * @beta
     */
    YAHOO.widget.CalendarEditor = function(el, cfg) {
        cfg = YAHOO.lang.merge(YAHOO.lang.isObject(cfg) ? cfg : {}, {type: 'calendar'});
        YAHOO.widget.CalendarEditor.superclass.constructor.call(this, el, cfg);
        this._calendarInit(el, cfg);
    };
    var Y                   = YAHOO,
        YU                  = Y.util,
        YL                  = Y.lang,
        // Event               = YU.Event,
        Dom                 = YU.Dom,
        widgetName          = 'calendarEditor',
        defaultCalendarConf = {
          close: false
        },

        /**
         * Date.parse with progressive enhancement for ISO-8601
         * © 2010 Colin Snover <http://zetafleet.com>
         * Released under MIT license.
         * @method YAHOO.util.Date.parseDate
         * @return timestamp
         * @type Integer
         */
        parseDate = function(date) {
            var timestamp = Date.parse(date), struct, minutesOffset;
            if(isNaN(timestamp) && (struct = /(\d{4})-?(\d{2})-?(\d{2})(?:[T ](\d{2}):?(\d{2}):?(\d{2})(?:\.(\d{3}))?(?:(Z)|([\-+])(\d{2})(?::?(\d{2}))?))?/.exec(date))) {
                minutesOffset = 0;
                if(struct[8] !== 'Z') {
                    minutesOffset = +struct[10] * 60 + struct[11];

                    if(struct[9] === '+') {
                        minutesOffset = 0 - minutesOffset;
                    }
                }
                timestamp = Date.UTC(+struct[1], +struct[2] - 1, +struct[3], +struct[4] || 0, (+struct[5] + minutesOffset) || 0, +struct[6] || 0, +struct[7] || 0);
            }
            return timestamp;
        },
        fieldGenerator = function() {
            var doc = document,
                container = doc.createElement('div'),
                field = doc.createElement('input'),
                calendar = doc.createElement('div');

            Dom.setAttribute(field, 'type', 'hidden');
            Dom.setAttribute(field, 'name', this.get('fieldName'));
            Dom.setAttribute(field, 'id', this.get('id') + '-field');
            Dom.setAttribute(calendar, 'id', this.get('id') + '-calendar');
            container.appendChild(field);
            container.appendChild(calendar);
            return container;

        },
        attachCalendar = function(calendarContainer, calendarConfig, field) {
            var calendar = new YAHOO.widget.Calendar(null, calendarContainer, calendarConfig),
                editor = this;
            calendar.render();
            calendar.selectEvent.subscribe(function(type, args, obj) {
                var dateParts = args[0][0], date;
                // need to change month and day fields to 2 digits becuase the Date object can not parse one digit day and month strings
                if(String(dateParts[1]).length == 1) {
                  dateParts[1] = '0' + dateParts[1];
                }
                if(String(dateParts[2]).length == 1) {
                  dateParts[2] = '0' + dateParts[2];
                }
                date = dateParts.join('-');
                field.value = YU.Date.format(new Date(parseDate(date)), {format: editor.get('dateFormat')});
            });
            return calendar;
        };

        YAHOO.extend(YAHOO.widget.CalendarEditor, YAHOO.widget.InlineEditor, {
            _calendarInit: function(el, cfg) {
                this.set('fieldGenerator', fieldGenerator);
                this.setAttributeConfig('calendarConfig', {});
                this.setAttributeConfig('dateFormat', {
                  value: cfg.dateFormat || '%Y-%m-%d'
                });
                /**
                 * Save the editor when user selects a date
                 * @config saveOnSelect
                 * @default true
                 * @type Boolean
                 */
                this.setAttributeConfig('saveOnSelect', {
                    validator: YL.isBoolean,
                    value: YL.isBoolean(cfg.saveOnSelect) ? cfg.saveOnSelect : true
                });

                /**
                 * Calendar configuration options
                 * @config calendarConfig
                 * @default <pre><code>{ close: false }</code></pre>
                 */
                this.set('calendarConfig', YL.isObject(cfg.calendarConfig) ?
                                              YL.merge(defaultCalendarConf, cfg.calendarConfig) :
                                              defaultCalendarConf);
                this.on('saveEvent', function() {
                  var calendar = this.calendar;
                  calendar.hide();
                  YL.later(100, calendar, calendar.destroy);
                  this.calendar = null;
                });
                this.on('cancelEvent', function() {
                  this.calendar.hide();
                  this.calendar = null;
                });
                this.subscribe('elementReplacedEvent', function() {
                    var id = this.get('id'),
                         selectedDates,
                         editor = this,
                         firstDate;
                    this.calendar = attachCalendar.call(this, id + '-calendar', this.get('calendarConfig'), Dom.get(this.get('id') + '-field'));
                    YAHOO.log('value: ' + this.get('value'));

                    this.calendar.select(new Date(parseDate(this.get('value'))));
                    selectedDates = this.calendar.getSelectedDates();
                    if(selectedDates.length) {
                      firstDate = selectedDates[0];
                      this.calendar.cfg.setProperty("pagedate", (firstDate.getMonth()+1) + "/" + firstDate.getFullYear());
                      this.calendar.render();
                    }
                    this.calendar.selectEvent.subscribe(function(type, args, obj) {
                      if(editor.get('saveOnSelect')) {
                        editor.save();
                      }
                    });
                });
                if(!/DIV|H\d/.test(this.get('element').nodeName.toUpperCase())) {
                  Y.log("the calendar editor won't work in Internet Explorer, because the container element can not contain TABLE element", 'warn', widgetName);
                }
            }
        });
        YAHOO.util.Date.parse = parseDate;
})();
/**
 * Inline editor widget
 * @module inlineeditor
 * @namespace YAHOO.widget
 */
(function() {
    YAHOO.widget.RatingEditor = function(el, cfg) {
          cfg = cfg || {};
          cfg = YAHOO.lang.merge(cfg, {type: 'rating'});
          YAHOO.widget.RatingEditor.superclass.constructor.call(this, el, cfg);
          this._ratingInit.apply(this, arguments);
    };
    var Y                   = YAHOO,
        YU                  = Y.util,
        YL                  = Y.lang,
        Event               = YU.Event,
        Dom                 = YU.Dom,
        Selector            = YU.Selector,

        fieldGenerator = function(type, fieldName, value) {
          var fields = '',
              maxRate = this.get('maxRate'),
              i = 1, output;

          while(i <= maxRate) {
            if(value == i) {
              fields += '<label class="yui-rate-' + i + '"><input type="radio" name="' + fieldName +'" value="' + i + '" checked="checked"></label>';
            } else {
              fields += '<label class="yui-rate-' + i + '"><input type="radio" name="' + fieldName +'" value="' + i + '" /></label>';
            }
            i++;
          }
          output = document.createElement('p');
          Dom.addClass(output, 'yui-rating yui-selected-rate' + value);

          output.innerHTML = fields;
          return output;

        },
        htmlFromValue = function(value) {
          var output = '';
          if(value !== '') {
            output = '<span class="yui-selected-rate' + value + ' yui-rate"><span class="yui-rate-indicator"></span></span>';
          }
          return output;
        };
        YAHOO.extend(YAHOO.widget.RatingEditor, YAHOO.widget.InlineEditor, {
          _ratingInit: function(cfg) {
            this.set('fieldGenerator', fieldGenerator);
            this.setAttributeConfig('maxRate', {
              validator: YL.isNumber,
              value: YL.isNumber(cfg.maxRate) ? cfg.maxRate : 5
            });
            this.setAttributeConfig('value', {
              getter: function(name, value) {
                var output;
                if(YL.isNumber(value)) {
                  output = value;
                } else {
                  output = this.get('htmlValue').replace(/\n/g, '').replace(/.*yui-selected-rate(\d+).*/, '$1');
                }
                if(output ===  this._yui_inline_editor_strings.EMPTY_TEXT) {
                  output = '';
                }
                if(output !== '') {
                  output = +output;
                }
                return output;
              }
            });
            this.subscribe('elementReplacedEvent', function() {
              var editor = this._editor,
                  labels = Selector.query('input[type="radio"]', editor);

              Event.on(labels, 'click', function(e) {
                var p = editor.firstChild, target;
                p.className = '';
                target = Event.getTarget(e);
                Dom.addClass(p, 'yui-rating yui-selected-rate' + target.value);
              });
            });
            this.subscribe('elementRestoredEvent', function() {
                var htmlValue = htmlFromValue(this.get('value'));
                this.set('htmlValue', htmlValue);
                // keep the empty string if the value is empty
                if(htmlValue !== '') {
                  this.get('element').innerHTML = htmlValue;
                }
            });
          }
        });
})();
YAHOO.register("inlineeditor", YAHOO.widget.InlineEditor, {version: "@VERSION@", build: "@BUILD@"});
