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
