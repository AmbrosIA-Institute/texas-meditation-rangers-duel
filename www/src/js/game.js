import $ from 'jquery';
import FFT from './fft';
import Player from './player';

// The game instance
let game = null;

// Default settings
const defaults = {

  // Number of players
  players: 2, 

}

export default class Game
{
  // Initialize UI and game instance in zero state
  static init( id, config )
  {
    if( game !== null ) return;

    // Create instance
    game = new Game(id, config);
    
  }

  static get()
  {
    return game;
  }


  // Instance constructor
  constructor( id, config )
  {
    if( window.PIXI == 'undefined' ) console.log('You must include PIXI to continue');

    this.id = id;
    this.element = $('#'+id);
    this.config  = $.extend( defaults, config );

    // Add listeners
    this.ui.controls.find('.control-settings').click( this.showSettings );
    this.ui.settings.find('.settings-close').click( this.hideSettings );

    console.log('Constructor called');
  }


  // Start Battle mode & Timer
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

  pause()
  {

  }

  onGamePaused()
  {

  }

  onGameEnded()
  {

  }

  showSettings()
  {
    this.ui.settings.addClass('open');
  }

  hideSettings()
  {
    this.ui.settings.removeClass('open');
  }

  // UI elements
  get ui()
  {
    return {
      display:  this.element.find('.display'),
      players:  this.element.find('.players'),
      settings: this.element.find('#settings'),
      controls: this.element.find('#controls'),
      meter:    this.element.find('#meter'),
      dial:     this.element.find('#meter .dial'),
    }
  }


}