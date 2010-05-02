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
        cfg = YAHOO.lang.merge(cfg, {type: 'calendar'});
        YAHOO.widget.CalendarEditor.superclass.constructor.call(this, el, cfg);
        this._calendarInit.apply(this, arguments);
    };
    var Y                   = YAHOO,
        YU                  = Y.util,
        YL                  = Y.lang,
        // Event               = YU.Event,
        Dom                 = YU.Dom,
        defaultCalendarConf = {
          close: false
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
            var calendar = new YAHOO.widget.Calendar(null, calendarContainer, calendarConfig);
            calendar.render();
            var editor = this;
            calendar.selectEvent.subscribe(function(type, args, obj) {
                var date = args[0][0].join('-');
                field.value = YAHOO.util.Date.format(new Date(date), {format: editor.get('dateFormat')});
            });
            return calendar;
        };

        YAHOO.extend(YAHOO.widget.CalendarEditor, YAHOO.widget.InlineEditor, {
            _strToDate: function(str) {
            },
            _calendarInit: function(el, cfg) {
                this.set('fieldGenerator', fieldGenerator);
                this.setAttributeConfig('calendarConfig', {});
                this.setAttributeConfig('dateFormat', {
                  value: cfg.dateFormat || '%Y-%m-%d'
                });
                var currentValue = this.get('value');


                this.set('calendarConfig', YL.isObject(cfg.calendarConfig) ? YL.merge(defaultCalendarConf, cfg.calendarConfig) : defaultCalendarConf);
                this.on('saveEvent', function() {
                  this.calendar.destroy();
                  this.calendar = null;
                });
                this.on('cancelEvent', function() {
                  this.calendar.destroy();
                  this.calendar = null;
                });
                this.subscribe('elementReplacedEvent', function() {
                    var id = this.get('id');
                    this.calendar = attachCalendar.call(this, id + '-calendar', this.get('calendarConfig'), Dom.get(this.get('id') + '-field'));
                    YAHOO.log('value: ' + this.get('value'));

                    this.calendar.select(new Date(this.get('value')));
                    var selectedDates = this.calendar.getSelectedDates();
                    if(selectedDates.length) {
                      var firstDate = selectedDates[0];
                      this.calendar.cfg.setProperty("pagedate", (firstDate.getMonth()+1) + "/" + firstDate.getFullYear());
                      this.calendar.render();
                    }
                });
            }
        });
})();
