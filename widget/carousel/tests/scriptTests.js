(function () {
     var ArrayAssert  = YAHOO.util.ArrayAssert,
         Assert       = YAHOO.util.Assert,
         carousel,
         carouselEl,
         Dom          = YAHOO.util.Dom,
         initFromScriptTest,
         ObjectAssert = YAHOO.util.ObjectAssert;

    YAHOO.namespace("CarouselTests");

    initFromScriptTest = new YAHOO.tool.TestCase({
            name: "Initialize from script test",

            testCreation: function () {
                return Assert.areEqual(true,
                        Dom.hasClass(carouselEl, "yui-carousel-element"));
            },

            testNumItems: function () {
                return Assert.areEqual(4, carousel.get("numItems"));
            },

            testNumItemsInTable: function () {
                return Assert.areEqual(4, carousel._itemsTable.numItems);
            },

            testitemsInTable: function () {
                return Assert.areEqual(4, carousel._itemsTable.items.length);
            },

            testgetElementForItem: function () {
                var actual = [], expected = [], i, items;

                items = Dom.getChildrenBy(carouselEl, function (node) {
                    return node.nodeName.toUpperCase() == "LI";
                });
                if (!items || items.length != 4) {
                    Assert.fail();
                }

                for (i = 0; i < items.length; i++) {
                    actual.push(carousel.getElementForItem(i));
                    expected.push(items[i]);
                }

                return ArrayAssert.itemsAreEqual(expected, actual);
            },

            testgetElementForItems: function () {
                var expected = [], i, items;

                items = Dom.getChildrenBy(carouselEl, function (node) {
                    return node.nodeName.toUpperCase() == "LI";
                });
                if (!items || items.length != 4) {
                    Assert.fail();
                }

                for (i in items) {
                    if (items.hasOwnProperty(i)) {
                        expected.push(items[i]);
                    }
                }

                return ArrayAssert.itemsAreEqual(expected,
                        carousel.getElementForItems());
            },

            testClearItems: function () {
                carousel.clearItems();
                return Assert.areEqual(0, carousel.get("numItems")) &&
                       Assert.areEqual(0, carousel._itemsTable.numItems) &&
                       ArrayAssert.itemsAreEqual([],
                               carousel._itemsTable.items);
            },

            testAddItem: function () {
                carousel.addItem("Six");
                carousel.addItem("Seven", 0);
                return Assert.areEqual("Six", carousel.getItem(1).item) &&
                       Assert.areEqual("Seven", carousel.getItem(0).item);
            },

            testAddItems: function () {
                carousel.addItems([["Eight",0],["Nine",0]]);
                return Assert.areEqual("Six", carousel.getItem(3).item) &&
                       Assert.areEqual("Seven", carousel.getItem(2).item) &&
                       Assert.areEqual("Eight", carousel.getItem(1).item) &&
                       Assert.areEqual("Nine", carousel.getItem(0).item);
            },

            testgetItem: function () {
                var children = Dom.getChildrenBy(carouselEl,
                        function (node) {
                            return node.nodeName.toUpperCase() == "LI";
                        }),
                    els = [], i;

                for (i in children) {
                    els.push(children[i]);
                }

                return ObjectAssert.propertiesAreEqual({ className: "",
                                                         id: els[2].id,
                                                         item: "Seven" },
                                                       carousel.getItem(2));
            },

            testgetItems: function () {
                var children = Dom.getChildrenBy(carouselEl,
                        function (node) {
                            return node.nodeName.toUpperCase() == "LI";
                        }),
                    expected = [], i;

                function compareItems(a, b) {
                    return a.className === b.className &&
                           a.id === b.id && a.item === b.item;
                }

                for (i in children) {
                    expected.push({ className: "", id: children[i].id,
                                    item: children[i].innerHTML });
                }

                return ArrayAssert.itemsAreEquivalent(expected,
                                                      carousel.getItems(),
                                                      compareItems);
            },

            testgetItemPositionById: function () {
                var children = Dom.getChildrenBy(carouselEl,
                        function (node) {
                            return node.nodeName.toUpperCase() == "LI";
                        });

                return Assert.areEqual(2,
                        carousel.getItemPositionById(children[2].id));
            },

            testremoveItem: function () {
                var children = Dom.getChildrenBy(carouselEl,
                        function (node) {
                            return node.nodeName.toUpperCase() == "LI";
                        }),
                    item;

                item = children[2];
                carousel.removeItem(2);
                return Assert.areEqual(null, Dom.get(item.id)) &&
                       Assert.areEqual(3, carousel.get("numItems")) &&
                       Assert.areEqual(3, carousel._itemsTable.numItems);
            },

            testScrollForward: function () {
                carousel.addItems([["Ten",0],["Eleven",0],["Twelve",0]]);
                carousel.scrollForward();
                Assert.areEqual("-100px", carouselEl.style.left);
            },

            testScrollPageForward: function () {
                Dom.setStyle(carouselEl, "left", "");
                carousel.scrollPageForward();
                Assert.areEqual("-300px", carouselEl.style.left);
            },

            testScrollBackward: function () {
                Dom.setStyle(carouselEl, "left", "-200px");
                carousel.scrollBackward();
                Assert.areEqual("-100px", carouselEl.style.left);
            },

            testScrollPageBackward: function () {
                Dom.setStyle(carouselEl, "left", "");
                carousel.scrollPageBackward();
                Assert.areEqual("300px", carouselEl.style.left);
            },

            testScrollTo: function () {
                Dom.setStyle(carouselEl, "left", "");
                carousel.scrollTo(3);
                Assert.areEqual("-300px", carouselEl.style.left);
            }
    });

    YAHOO.CarouselTests.scriptTests = new YAHOO.tool.TestSuite({
            name: "Carousel (from Script) Tests",

            setUp: function () {
                var items;

                carousel = new YAHOO.widget.Carousel("container2");
                carousel.addItems([["One"], ["Two"], ["Three"], ["Four"]]);
                carousel.render();
                items    = Dom.getElementsByClassName("yui-carousel-element",
                        "OL", carousel.get("element"));
                if (YAHOO.lang.isArray(items) && items.length == 1) {
                    carouselEl = items[0];
                }
            },

            tearDown : function () {
                delete carousel;
            }
    });

    YAHOO.CarouselTests.scriptTests.add(initFromScriptTest);
})();
