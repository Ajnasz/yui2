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
  addItems = function(start) {
    if(images[start]) {
      carousel.addItem('<img src="' + images[start] + '">', start);
      images[start] = undefined;
      YAHOO.log('imags[start]: ' + start + ': ' + images[start], 'info', TestName);
    }
    if(images[start+1]) {
      carousel.addItem('<img src="' + images[start+1] + '">', start+1);
      images[start+1] = undefined;
      YAHOO.log('imags[start+1]: ' + (start+1) + ': ' + images[start+1], 'info', TestName);
    }
    if(images[start+2]) {
      carousel.addItem('<img src="' + images[start+2] + '">', start+2);
      images[start+2] = undefined;
      YAHOO.log('imags[start+2]: ' + (start+2) + ': ' + images[start+2], 'info', TestName);
    }
  },
  firstVisible = 3,
  carousel = new YAHOO.widget.Carousel('container', {
    isCircular: false,
    numVisible: 3,
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
