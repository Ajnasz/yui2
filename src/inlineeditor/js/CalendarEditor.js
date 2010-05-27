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
