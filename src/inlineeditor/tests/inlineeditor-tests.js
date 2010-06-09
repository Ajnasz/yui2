var editor1 = null,
    editor2 = null;
    editor3 = null,
    editor4 = null,
    editor5 = null,
    editor6 = null,
    editor7 = null,
    editor8 = null,
    editor9= null,
    calendarEditor = null,
    autocompleteEditor = null;
(function() {
    var Dom = YAHOO.util.Dom,
        Event = YAHOO.util.Event,
        Tool = YAHOO.tool,
        Suite = new Tool.TestSuite('yuisuite'),
        Assert = YAHOO.util.Assert;
    YAHOO.widget.InlineEditor.DEFAULT_CONFIG.SET_FIELD_SIZE = false;

    Event.onDOMReady(function() {
      var logger = new Tool.TestLogger(null, { height: '80%' });
        YAHOO.widget.InlineEditor.STRINGS.EDIT_BUTTON_TEXT = 'start editing';
      editor1 = new YAHOO.widget.InlineEditor('element', {strings: {
        SAVE_BUTTON_TEXT: 'save the new text'
      }});
      editor2 = new YAHOO.widget.InlineEditor('paragraph', {type: 'textarea',
                                processBeforeSave: function(value) {
                                    var output = value.replace(/\n/g, '<br>');
                                    return output;
                                },
                                processBeforeRead: function(value) {
                                    var output = value.replace(/<br\s*\/?>/ig, '\n');
                                    return output;
                                }
      });
      editor3 = new YAHOO.widget.InlineEditor('span-for-select', {type: 'select', selectableValues: [
          {label: 'ingyom', value: 1},
          {label: 'bingyom', value: 2},
          {label: 'malibe', value: 3},
          {label: 'tuta', value: 4},
          {label: 'libe', value: 5},
          {label: 'talibe', value: 6}
      ]});
      editor4 = new YAHOO.widget.InlineEditor('span-for-radio', {type: 'radio', selectableValues: {
          ingyom: 1,
          bingyom: 2,
          malibe: 3,
          tuta: 4,
          libe: 5,
          talibe: 6
      }});
      var editor5 = new YAHOO.widget.InlineEditor('span-for-checkbox', {type: 'checkbox', selectableValues:[
        {label: 'selected', value: true},
        {label: 'not selected', value:false}
      ]});
      editor6 = new YAHOO.widget.RatingEditor('span-for-rating-editor', {});
      editor7 = new YAHOO.widget.InlineEditor('span-for-stop-editing');
      editor7.subscribe('beforeEditEvent', function(){Dom.get('a-container').innerHTML = 'before edit event fired';return false;});
      editor8 = new YAHOO.widget.InlineEditor('span-for-empty-editor', {strings: {EMPTY_TEXT: 'this is empty'}});
      editor9 = new YAHOO.widget.RatingEditor('span-for-empty-rating-editor');
      calendarEditor = new YAHOO.widget.CalendarEditor('calendar-editor'),
      dataSource = new YAHOO.util.LocalDataSource([
          "Alabama",
          "Alaska",
          "Arizona",
          "Arkansas",
          "California",
          "Colorado",
          "Connecticut",
          "Delaware",
          "Florida"
      ]),
      autocompleteEditor = new YAHOO.widget.AutocompleteEditor('autocomplete-editor', {dataSource: dataSource, saveOnSelect: true});

      Suite.add(new Tool.TestCase({
          name: 'YAHOO.widget.InlineEditor input',
          test_render: function() {
            Assert.areEqual(Dom.get('element'), editor1.get('element'), 'Could not fiend Editors container');
            Assert.areEqual(true, editor1.edit(), 'editor not started');
          },
          test_change: function() {
            Assert.areEqual(editor1.get('element').getElementsByTagName('input')[0].value, editor1.get('value'), 'Field and editor value are not equal');
            var input = editor1.get('element').getElementsByTagName('input')[0];
            var newValue = input.value + ' TEST ADDED';
            input.value = newValue;
            Assert.areNotEqual(input.value, editor1.get('value'), 'changed field value is the same as the editor\'s value')
            editor1.save();
            Assert.areEqual(newValue, editor1.get('value'), 'saved value is not what is entered into the field');
          },
          test_button_types: function() {
            Assert.areEqual('BUTTON', editor1.controls.edit.type.toUpperCase(), "edit button's type is not button");
          }
      }));
      Suite.add(new Tool.TestCase({
        name: 'YAHOO.widget.InlineEditor textarea',
        test_render: function() {
            Assert.areEqual(Dom.get('paragraph'), editor2.get('element'), 'Could not fiend Editors container');
            Assert.isTrue(editor2.edit(), 'editor not started');
            Assert.areEqual(1, editor2.get('element').getElementsByTagName('TEXTAREA').length, 'Edit field is not found or it\'s not a textarea');
            Assert.isFalse(/<br\s*\/?>/.test(editor2.get('element').getElementsByTagName('TEXTAREA')[0].value), 'value preprocessing error');
            Assert.isFalse(/<br\s*\/?>/i.test(editor2.get('value')), 'value preprocessing error');
            Assert.isTrue(editor2.save(), 'value preprocessing error');
        }
      }));
      Suite.add(new Tool.TestCase({
        name: 'YAHOO.widget.InlineEditor select',
        test_render: function() {
            Assert.areEqual(Dom.get('span-for-select'), editor3.get('element'), 'Could not fiend Editors container');
            Assert.isTrue(editor3.edit(), 'editor not started');
            var selects = editor3.get('element').getElementsByTagName('select');
            Assert.areEqual(1, selects.length, 'Select field not found');
            var select = selects[0];
            Assert.areEqual(6, select.options.length, 'not all option rendered');
            Assert.areEqual(1, select.selectedIndex, 'not the first item is the selected');
        },
        test_selection: function() {
            var selects = editor3.get('element').getElementsByTagName('select');
            var select = selects[0];
            select.options[2].selected = true;
            Assert.areEqual(2, select.selectedIndex, 'not the third item is the selected');
            editor3.save();
            Assert.areEqual(3, editor3.get('value'), 'bad saved value');
            Assert.areEqual('malibe', editor3.get('htmlValue'), 'bad saved html value');
        }
      }));
      Suite.add(new Tool.TestCase({
        name: 'YAHOO.widget.InlineEditor radio',
        test_render: function() {
            Assert.areEqual(Dom.get('span-for-radio'), editor4.get('element'), 'Could not fiend Editors container');
            Assert.areEqual(4, editor4.get('value'), 'bad editor value');
            Assert.areEqual('tuta', editor4.get('htmlValue'), 'bad saved html value');
            Assert.isTrue(editor4.edit(), 'editor not started');
            var form = editor4.get('element').getElementsByTagName('form')[0];
            var selected = -1;
            var elements = form.field;
            Assert.areEqual(6, elements.length, 'Not all input field generated');
            for (var i = 0; i < elements.length; i++) {
              if(elements[i].checked) {
                selected = elements[i].value;
                break;
              }
            }
            Assert.areEqual(selected, editor4.get('value'), 'The selected input has bad value');
        },
        test_selection: function() {
            var form = editor4.get('element').getElementsByTagName('form')[0];
            var elements = form.field;
            elements[1].checked = true;
            editor4.save();
            Assert.areEqual(2, editor4.get('value'), 'Bad saved value');
            Assert.areEqual('bingyom', editor4.get('htmlValue'), 'Bad saved htmlValue');
        }
      }));
      Suite.add(new Tool.TestCase({
        name: 'YAHOO.widget.InlineEditor checkbox',
        test_render: function() {
            Assert.areEqual(Dom.get('span-for-checkbox'), editor5.get('element'), 'Could not fiend Editors container');
            Assert.areEqual(true, editor5.get('value'), 'bad editor value');
            Assert.areEqual('selected', editor5.get('htmlValue'), 'bad saved html value');
            Assert.isTrue(editor5.edit(), 'editor not started');
            var form = editor5.get('element').getElementsByTagName('form')[0];
            var element = form.field;
            Assert.isTrue(element.checked, 'field is not checked');
        },
        test_selection: function() {
            var form = editor5.get('element').getElementsByTagName('form')[0];
            var element = form.field;
            element.checked = false;
            editor5.save();
            Assert.isFalse(editor5.get('value'), 'bad saved field value');
        }
      }));
      Suite.add(new Tool.TestCase({
        name: 'YAHOO.widget.RatingEditor',
        test_render: function() {
            Assert.areEqual(Dom.get('span-for-rating-editor'), editor6.get('element'), 'Could not fiend Editors container');
            Assert.areEqual(3, editor6.get('value'), 'bad editor value');
            Assert.isTrue(editor6.edit(), 'editor not started');
            var form = editor6.get('element').getElementsByTagName('form')[0];
            var selected = -1;
            var elements = form.field;
            Assert.areEqual(5, elements.length, 'Not all input field generated');
            for (var i = 0; i < elements.length; i++) {
              if(elements[i].checked) {
                selected = elements[i].value;
                break;
              }
            }
            Assert.areEqual(selected, editor6.get('value'), 'The selected input has bad value');
            Assert.isTrue(Dom.hasClass(editor6.get('element').firstChild.firstChild, 'yui-selected-rate' + editor6.get('value')), 'bad class for rating container');
        },
        test_selection: function() {
            var form = editor6.get('element').getElementsByTagName('form')[0];
            var elements = form.field;
            elements[1].checked = true;
            Assert.isTrue(Dom.hasClass(editor6.get('element').firstChild.firstChild, 'yui-selected-rate' + editor6.get('value')), 'bad class for rating container');
            editor6.save();
            Assert.areEqual(2, editor6.get('value'), 'Bad saved value');
            Assert.isTrue(Dom.hasClass(editor6.get('element').firstChild, 'yui-selected-rate' + editor6.get('value')), 'bad class for rating container');
        }
      }));
      Suite.add(new Tool.TestCase({
        name: 'stop editing',
        test_stopping: function() {
          editor7.edit();
          Assert.areEqual(0, editor7.get('element').getElementsByTagName('form').length, 'element value changed');
        },
        test_fire:function() {
          var aContainer = Dom.get('a-container');
          Assert.areEqual(aContainer.innerHTML, 'before edit event fired', 'before edit event not fired');
        }
      }));
      Suite.add(new Tool.TestCase({
        name: 'empty editor',
        test_render: function() {
          Assert.isTrue(/^this is empty/.test(editor8.get('element').innerHTML), 'element value not changed');
        },
        test_value: function() {
          Assert.areEqual(editor8.get('value'), '', 'value is not empty');
        },
        test_value_change: function() {
          editor8.edit();
          var form = editor8.get('element').getElementsByTagName('form')[0];
          var element = form.elements[0];
          element.value = 'FOOBAR';
          editor8.save();
          Assert.areEqual(editor8.get('value'), 'FOOBAR', 'value not changed');
          Assert.isTrue(/^FOOBAR/.test(editor8.get('element').innerHTML), 'element innerhtml not changed');
        }
      }));
      Suite.add(new Tool.TestCase({
        name: 'empty rating editor',
        test_render: function() {
          Assert.isTrue(/^field is empty, click to edit it/.test(editor9.get('element').innerHTML), 'empty field value not changed');
        },
        test_value: function() {
          Assert.areEqual(editor9.get('value'), '', 'field value is not empty')
        },
        test_cancelling: function() {
          editor9.edit();
          editor9.cancel();
          Assert.isTrue(/^field is empty, click to edit it/.test(editor9.get('element').innerHTML), 'empty field value not changed');
        },
        test_set_value: function() {
          editor9.edit();
          var form = editor9.get('element').getElementsByTagName('form')[0];
          var elements = form.field;
          elements[2].checked = true;
          editor9.save();
          Assert.areEqual(3, editor9.get('value'), 'Bad saved value');
          Assert.isTrue(Dom.hasClass(editor9.get('element').firstChild, 'yui-selected-rate' + editor9.get('value')), 'bad class for rating container');
        }
      }));
      Suite.add(new Tool.TestCase({
          name: 'YAHOO.widget.CalendarEditor',
          test_render: function() {
            Assert.areEqual(Dom.get('calendar-editor'), calendarEditor.get('element'), 'Could not fiend Editors container');
            Assert.areEqual(true, calendarEditor.edit(), 'editor not started');
            Assert.isInstanceOf(YAHOO.widget.Calendar, calendarEditor.calendar, 'Could not find Calendar instance');
            // Assert.areEqual(calendarEditor.calendar.getSelectedDates()[0], new Date(calendarEditor.get('value')), 'calendar editor and the calendar\'s  selected value are not equal');
            Assert.areEqual(1, YAHOO.util.Dom.getElementsByClassName('yui-calendar', null, calendarEditor.get('element')).length, 'Could not find calendar table');
          },
          test_select: function() {
            calendarEditor.calendar.selectCell(4);
            Assert.areEqual(calendarEditor.get('value'), calendarEditor.get('element').innerHTML.substring(0, 10), 'Editor value and element text value are not the same');
            Assert.areEqual(calendarEditor.get('htmlValue'), calendarEditor.get('element').innerHTML.substring(0, 10), 'Editor htmlValue and element text value are not the same');
          }
      }));
      Suite.add(new Tool.TestCase({
          name: 'YAHOO.widget.AutocompleteEditor',
          test_render: function() {
            Assert.areEqual(Dom.get('autocomplete-editor'), autocompleteEditor.get('element'), 'Could not fiend Editors container');
            Assert.areEqual(true, autocompleteEditor.edit(), 'editor not started');
          },
          test_select: function() {
            Assert.isInstanceOf(YAHOO.widget.AutoComplete, autocompleteEditor.autocomplete, 'Could not find Autocomplete instance');
            autocompleteEditor.autocomplete.sendQuery('ala');
            autocompleteEditor.autocomplete._selectItem(autocompleteEditor.autocomplete.getListItems()[0])
            Assert.areEqual(autocompleteEditor.get('lastSelected')[2][0], 'Alabama', 'selected item value is wrong');
            Assert.isTrue(/^Alabama/.test(autocompleteEditor.get('element').innerHTML), 'field value is not selected value');
          }
      }));
      Tool.TestRunner.add(Suite);
      if (parent && parent != window) {
          YAHOO.tool.TestManager.load();
      } else {
          YAHOO.tool.TestRunner.run();
      }
    });
})();
