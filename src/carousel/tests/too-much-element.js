YAHOO.util.Event.onDOMReady(function(){
try {
  var logger = new YAHOO.tool.TestLogger(),
  TestName = "CarouselTest",
  numVisible = 3,
  firstVisible = 4000,
  itemNum     = 5000,
  added       = {},
  addItem = function(index) {
    if(!added[index]) {
      carousel.addItem('<p>item at index ' + index + '</p>', index);
      added[index] = true;
    }
  },
  addItems = function(start) {
    for (var i = 0; i < numVisible; i++) {
      addItem([start+i]);
    }
  },
  carousel = new YAHOO.widget.Carousel('container', {
    isCircular: false,
    numVisible: numVisible,
    scrollIncrement: 3,
    animation: {speed: 0.5},
    numItems: itemNum,
    selectOnScroll: false,
    firstVisible: firstVisible
  });
  carousel.render();
  addItems(firstVisible);
  carousel.subscribe('afterScroll', function(o) {
    addItems(o.first);
  });
  CC = carousel;
} catch(e) {
  console.error(e);
}
});
