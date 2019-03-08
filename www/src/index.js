import jQuery from 'jquery';
import bootstrap from 'bootstrap';
// SVG Graphics
import './images/headset.svg';
import './images/player.svg';
import './images/meter.svg';
// Fonts
import './fonts/andalemono/stylesheet.css';
import './fonts/rtdromotrial/stylesheet.css';
// CSS Reset
import './vendor/normalize.css';
// Main stylesheet
import './scss/main.scss';

import Game from './js/game';

jQuery(function($){

  

  // Replaces img.src SVG elements with inline version
  $('img.svg').each(function(){
    var $img = $(this);
    var imgID = $img.attr('id');
    var imgClass = $img.attr('class');
    var imgURL = $img.attr('src');

    $.get(imgURL, function(data) {
        // Get the SVG tag, ignore the rest
        var $svg = $(data).find('svg');
        // Add replaced image's ID to the new SVG
        if(typeof imgID !== 'undefined') $svg = $svg.attr('id', imgID);
        // Add replaced image's classes to the new SVG
        if(typeof imgClass !== 'undefined') $svg = $svg.attr('class', imgClass+' replaced-svg');
        // Remove any invalid XML tags as per http://validator.w3.org
        $svg = $svg.removeAttr('xmlns:a');
        // Check if the viewport is set, if the viewport is not set the SVG wont't scale.
        if(!$svg.attr('viewBox') && $svg.attr('height') && $svg.attr('width')) {
            $svg.attr('viewBox', '0 0 ' + $svg.attr('height') + ' ' + $svg.attr('width'))
        }
        // Replace image with new SVG
        $img.replaceWith($svg);
    },'xml');

  });

  $('.display').on('mousemove', function(e){
    let w = $(this).outerWidth();
    let wh = w/2;
    let locx = e.pageX - $(this).outerWidth()/2;
    let v = 0;

    if( locx == 0 ) {
      v = 0;
    } else if( locx > wh ) {
      v = 1;
    } else {
      v = locx/wh;
    }

    const d = Math.round(v*90);
    const meter = $('.meter-svg');

    /*const tr = meter.css('transform');
    const match = tr.match(/-?[\d\.]+/g);
    const sx = parseFloat(match[0]);
    const sy = parseFloat(match[3]);*/

    const transform = 'rotate(' + d + 'deg) scale(1.2,1.2)';

    meter.css({
      '-webkit-transform' : transform,
      '-moz-transform'    : transform,
      '-ms-transform'     : transform,
      '-o-transform'      : transform,
      'transform'         : transform
    });

  });

  const game = new Game();
  
  $('.btn-battle').click(function(e){
    game.start();
  });

});