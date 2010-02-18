YAHOO.util.Event.onDOMReady(function(){
  var logger = new YAHOO.tool.TestLogger(),
  TestName = "CarouselTest",
  images = [
    'http://farm1.static.flickr.com/80/259391136_6fa405c7f6_s.jpg',
    'http://farm1.static.flickr.com/112/259393256_db700f455f_s.jpg',
    'http://farm1.static.flickr.com/87/258609416_bf0d44b445_s.jpg',
    'http://farm1.static.flickr.com/119/259395209_66c773a072_s.jpg',
    'http://farm1.static.flickr.com/92/259391837_c51c12afae_s.jpg',
    'http://farm1.static.flickr.com/83/259399727_3d170d0445_s.jpg',
    'http://farm1.static.flickr.com/121/258614620_16eb6867f7_s.jpg',
    'http://farm1.static.flickr.com/108/259397333_3e4a3960bd_s.jpg',
    'http://farm1.static.flickr.com/93/258613376_ff23d40bbf_s.jpg',
    'http://farm1.static.flickr.com/95/259394895_8944fe68bc_s.jpg'
  ],
  numVisible = 3,
  firstVisible = 3,
  addItem = function(index) {
      // make sure, the image index is exists
      // we also use this checking to avoid to add an image to the carousel twice
      if(images[index]) {
        carousel.addItem('<img src="' + images[index] + '">', index);
        YAHOO.log('imags[index]: ' + index + ': ' + images[index], 'info', TestName);
        images[index] = undefined; // set to undefined, so we won't add an image into the carousel twice
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
    animation: {speed: 0},
    numItems: images.length,
    selectOnScroll: false,
    firstVisible: firstVisible
  });
  carousel.render();
  addItems(firstVisible);
  carousel.subscribe('afterScroll', function(o) {
    addItems(o.first);
  })
});
