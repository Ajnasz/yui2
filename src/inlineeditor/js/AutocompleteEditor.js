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
