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
        YAHOO.widget.AutocompleteEditor.superclass.constructor.call(this, el, cfg);
        this._autocompleteInit.apply(this, arguments);
    };
    var Y                   = YAHOO,
        YU                  = Y.util,
        YL                  = Y.lang,
        Event               = YU.Event,
        Dom                 = YU.Dom,
        AutocompleteEditor  = YAHOO.widget.AutocompleteEditor,
        acItemSelectEvent   = 'acItemSelectEvent',

        fieldGenerator = function() {
            var doc = document,
                container = doc.createElement('div'),
                field = doc.createElement('input'),
                results = doc.createElement('div')
                ;

            Dom.setAttribute(field, 'type', 'text');
            Dom.setAttribute(field, 'name', this.get('fieldName'));
            Dom.setAttribute(field, 'id', this.get('id') + '-field');
            Dom.setAttribute(results, 'id', this.get('id') + '-results');
            container.appendChild(field);
            container.appendChild(results);
            return container;
        },
        attachAutocomplete = function(field, container, dataSource) {
            var ac = new YAHOO.widget.AutoComplete(field, container, dataSource);
            return ac;
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
                this.setAttributeConfig('lastSelected', {value: null});
                this.subscribe('elementReplacedEvent', function() {
                    var id = this.get('id'),
                    autocomplete = attachAutocomplete(id + '-field', id + '-results', this.get('dataSource')),
                    _editor = this;
                    autocomplete.itemSelectEvent.subscribe(function(eventName, args){
                        _editor.fireEvent(acItemSelectEvent, args);
                        _editor.set('lastSelected', args);
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
