/**
 * Inline editor widget
 * @module inlineeditor
 * @namespace YAHOO.widget
 */
(function() {
    /**
     * Rating editor class
     * @namespace YAHOO.widget
     * @class RatingEditor
     * @constructor
     * @extends YAHOO.widget.InlineEditor
     * @param {String} el Id of the editable element
     * @param {Object} cfg Configuration properties
     */
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

        /**
         * Method which generates the edit field
         * @method fieldGenerator
         * @private
         * @param {String} type Editor type
         * @param {String} fieldName Name of the edit field
         * @param {String} value Value of the field
         * @return {HTMLParagraphElement} a paragraph element
         */
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
        /**
         * Generates HTML text which will display rating stars from the current value
         * @method htmlFromValue
         * @private
         * @param {String | Integer} value Value
         * @return {String} HTML fragment
         */
        htmlFromValue = function(value) {
          var output = '';
          if(value !== '') {
            output = '<span class="yui-selected-rate' + value + ' yui-rate"><span class="yui-rate-indicator"></span></span>';
          }
          return output;
        };

        Y.extend(YAHOO.widget.RatingEditor, Y.widget.InlineEditor, {
          /**
           * Initialize the editor
           * @method _ratingInit
           * @param {Object} cfg Configuratoion properties object
           * @protected
           */
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
