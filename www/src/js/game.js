import $ from 'jquery';
import FFT from './fft';
import Player from './player';

// The game instance
let game = null;

// Holds player objects
let players = [];

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

  // Instance constructor
  constructor( id, config )
  {
    if( window.PIXI == 'undefined' ) console.log('You must include PIXI to continue');

    this.id = id;
    this.element = $('#'+id);

    this.config  = $.extend( defaults, config );

    // Add listeners
    this.controls.settings.click( this.showSettings.bind(this) );
    this.controls.close.click( this.hideSettings.bind(this) );
    this.controls.battle.click( this.startBattle.bind(this) );

    // Setup Players
    for( let i=0; i<this.config.players; i++ )
    {
      players.push(new Player(i));
    }

    this.players = players;

    // this.ui.settings.find('.settings-close').click( this.hideSettings );
    this.reset();

    console.log('Constructor called');
  }

  reset()
  {
    this.controls.time.text('00:00');

    $.each(this.players, function(index,player){
      player.reset();
    });
  }

  // Start Battle mode & Timer
  start()
  {
    // this.startTimer();
    $.each(this.players, function(index,player){
      player.startStream();
    });

    this.is_playing = true;
    this.is_paused  = false;
  }

  pause()
  {

  }

  onGamePaused()
  {

  }

  startBattle()
  {
    this.start();
  }

  showSettings()
  {
    this.ui.settings.addClass('open');
    this.refreshSettings();
  }

  hideSettings()
  {
    this.ui.settings.removeClass('open');
  }


  refreshSettings()
  {
    let connect = this.ui.settings.find('.setting-connect');
    let conn_players = connect.find('.setting-connect-players');

    let battery = this.ui.settings.find('.setting-battery');
    let batt_players = battery.find('.setting-battery-players');

    $.each(this.players, function(i,p){

    });
  }

  // UI elements
  get ui()
  {
    return {
      display:  this.element.find('.display'),
      players:  this.element.find('.players'),
      settings: $(this.element).find('#settings'),
      controls: this.element.find('#controls'),
      meter:    this.element.find('#meter'),
      dial:     this.element.find('#meter .dial'),
    }
  }

  get controls()
  {
    return {
      settings : this.ui.controls.find('.control-settings'),
      battle   : this.ui.controls.find('.control-battle'),
      reset    : this.ui.controls.find('.control-reset'),
      time     : this.ui.controls.find('.control-time'),
      close    : this.ui.settings.find('.settings-close'),
    }
  }


}