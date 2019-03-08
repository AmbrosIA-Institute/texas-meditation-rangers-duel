import $ from 'jquery';
import FFT from './fft';


export default class Game
{
  constrctor()
  {
    if( window.PIXI == 'undefined' ) console.log('You must include PIXI to continue');
  }

  start()
  {
    $.each(['.player-1','.player-2'], function(i,p){
      
      let player = $(p);
      let ffts = $(player).find('.fft');
      let config = { channels : 1 };


      $.each(ffts, function(j,fft){
         const pfft = new FFT(fft, config);
         pfft.start();
      });
    });
  }


}