import jQuery from 'jquery';
import bootstrap from 'bootstrap';
// SVG Graphics
import './images/headset.svg';
import './images/player.svg';
import './images/meter.svg';
import './images/battery.svg';

// Fonts
import './fonts/andalemono/stylesheet.css';
import './fonts/rtdromotrial/stylesheet.css';
// CSS Reset
import './vendor/normalize.css';
// Main stylesheet
import './scss/main.scss';

import Game from './js/game';
import SVGConvert from './js/svg';

jQuery(function($){

  // Replaces SVG images with inline XML
  $('img.svg').each(SVGConvert);

  const config = {};

  // Initialize Game UI
  Game.init( 'game', config );

  // 
  $('.display').on('mousemove', function(e){

    let wh   = $(this).outerWidth() / 2;
    let locx = e.pageX - wh;
    let v    = locx <= 0 ? 0 : ( locx > wh ? 1 : locx/wh );

    const transform = 'rotate(' + Math.round(v*90) + 'deg)';

    $('.meter-svg').css({ 'transform': transform });

  });

  

});