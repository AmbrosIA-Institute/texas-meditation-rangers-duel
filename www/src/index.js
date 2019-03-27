import jQuery from 'jquery';
import bootstrap from 'bootstrap';

// Import PIXI
import './vendor/pixi.min.js';

// SVG Graphics
import './images/headset.svg';
import './images/player.svg';
import './images/meter.svg';
import './images/battery.svg';
import './images/stopwatch.svg';

// Fonts
import './fonts/andalemono/stylesheet.css';
import './fonts/rtdromotrial/stylesheet.css';

// CSS Reset
import './vendor/normalize.css';

// Main stylesheet
import './scss/main.scss';

// Game modules
import Game from './js/game';
import SVGConvert from './js/svg';

// And, we're off
jQuery(function($){

  // Replaces SVG images with inline XML
  $('img.svg').each(SVGConvert);

  const config = {};

  // Initialize Game UI
  Game.init( 'game', config );

  // For testing
  /*
  $('.display').on('mousemove', function(e){

    let wh   = $(this).outerWidth() / 2;
    let locx = e.pageX - wh;
    let v    = locx <= 0 ? 0 : ( locx > wh ? 1 : locx/wh );

    const transform = 'rotate(' + Math.round(v*90) + 'deg)';

    $('.dial-svg').css({ 'transform': transform });

  });
  */


});