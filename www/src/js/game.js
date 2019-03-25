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

  // Battle duration, in seconds
  duration: 180,

  // Game mode
  mode: 'none',

  // How many seconds to countdown
  countdown: 5,

  // Type of countdown
  cdtype: 'modal',
}


const disable = function(element){
  $(element).addClass('disabled').attr('disabled','disabled');
}

const enable = function(element){
  $(element).removeClass('disabled').removeAttr('disabled');
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
    if( window.PIXI == 'undefined' ) { console.log('You must include PIXI to continue'); return false; }

    if( ! id ) { console.log('You must specify an element ID'); return false; }

    // The id to attach to
    this.id = id;
    // Root element
    this.element = $('#'+id);
    // Game config
    this.config  = $.extend( defaults, config );

    // Intialize control buttons
    this.initControls();

    // Initialize Settings
    this.initSettings();

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

    this.clearError();

    $.each(this.players, function(index,player){
      player.reset();
    });
  }

  // Init battle, ui & start countdown
  start()
  {
    // Cant do settings while playing
    disable(this.controls.settings);

    // Battle button becomes pause button
    this.controls.battle.html('PAUSE');

   

    

    this.playing = true;
    this.paused  = false;

    // Start countdown
    if( this.config.cdtype == 'modal' ) {
      this.startCountdownModal();
    } else {
      this.startCountdown();
    }
    

  }

  // Starts the battle countdown
  startCountdown()
  {
    console.log('Start Countdown');

    let count = this.config.countdown;
    let out   = this.ui.output.find('h2.countdown');

    const interval = window.setInterval( function()
    {
      if( count < 0 )
      {
        window.clearInterval(interval);
        out.text('MEDITATE');

        console.log('Countdown finished');
        this.startBattle();
      }
      else
      {
        out.text('0'+count);
        count--;
      }

    }.bind(this), 1000);
  }

  startCountdownModal()
  {
    

    let count = this.config.countdown;
    let out   = this.ui.modal.find('.text');
    let out2  = this.ui.modal.find('.word');

    const words = ['one','two','three','four','five','six','seven','eight','nine','ten'];

    out.text('0'+count);
    out2.text( words[count-1] );
    this.ui.modal.addClass('show');

    const interval = window.setInterval( function()
    {
      if( count < 0 )
      {
        window.clearInterval(interval);
        out.text('00');
        this.ui.modal.removeClass('show');
        console.log('Countdown finished');
        this.startBattle();
      }
      else
      {
        if( count == 0 ) out2.text('MEDITATE!!');

        out.text('0'+count);
        let word = words[count-1];
        out2.text(word);
        count--;
      }

    }.bind(this), 1000);
  }

  // Starts the actual battle sequence
  startBattle()
  {
    // Set playing class
    this.element.addClass('is-playing');
    // Show the meter
    this.ui.meter.addClass('show');

    // this.startTimer();
    $.each(this.players, function(index,player){
      player.startStream();
    });

    this.ui.modal.removeClasS('show');

    window.requestAnimationFrame( this.frame.bind(this) );


  }

  // Called each frame during battle
  frame()
  {

  }

  pause()
  {

  }


 

  // Add listeners to controls
  initControls()
  {
    this.controls.settings.click( this.onSettingsClick.bind(this) );
    this.controls.close.click( this.onSettingsClose.bind(this) );
    this.controls.battle.click( this.onBattleClick.bind(this) );
    this.controls.reset.click( this.onResetClick.bind(this) );
  }

  // Reset button listener
  onResetClick(e)
  {
    if( ! this.playing ) return;
  }

  // Battle button listener
  onBattleClick(e)
  {
    if( ! this.playing ) 
    {
      this.start();
    }
    else
    {
      // Pause the game
    }
  }

  // Open settings panel
  onSettingsClick(e)
  {
    this.ui.settings.addClass('open');
    this.refreshSettings();
  }

  // Close settings panel
  onSettingsClose(e)
  {
    this.ui.settings.removeClass('open');
  }

  // Init settings UI and add listeners
  initSettings()
  {
    // UI adjust on battery
    // 0% = right:2.6rem / 100% = right:0.2rem
    this.settings.battery.find('.player').each(function(){
      const level = parseInt(Math.random() * 100);
      const rem = (2.3 * (level/100)) + 0.3;
      const perc = ( level < 10 ? '0'+level : level ) + '%';

      $(this).find('.battery-percent').text(perc)
      $(this).find('.battery-f').css('right', rem + 'rem');
    });

    this.settings.duration.find('#battle-duration').on('change', function(){
      game.config.duration = parseInt($(this).val());
    });

    this.settings.mode.find('button').on('click',function(){

      const li   = $(this).parent('li');
      const mode = li.data('mode');

      if( mode && mode !== game.config.mode )
      {
        li.addClass('active').siblings('.active').removeClass('active');
        game.config.mode = li.data('mode');
      }
      
    });

  }

  // Refresh settings UI
  refreshSettings()
  {
    // UI adjust on battery
    this.settings.battery.find('.player').each(function(){
      const level = parseInt(Math.random() * 100);
      // 0% = right:2.6rem / 100% = right:0.3rem
      const rem = (2.3 * (level/100)) + 0.3;
      const perc = ( level < 10 ? '0'+level : level ) + '%';

      $(this).find('.battery-percent').text(perc)
      $(this).find('.battery-f').css('right', rem + 'rem');
    });

    //console.log('Settings', this.settings);
    this.settings.duration.find('#battle-duration').val( this.config.duration );

     //console.log('Mode', this.settings.mode.find('.mode-list li') );
    this.settings.mode.find('.mode-list li').each(function(){
      let active = $(this).data('mode') == game.config.mode;
      console.log('Mode', $(this).data('mode'));
      $(this).toggleClass('active', active);
    });

  }

  // Show error in the display
  showError( msg )
  {
    this.ui.output.find('h2.error').empty().text(msg);
  }

  // Clear error display
  clearError()
  {
    this.ui.output.find('h2.error').empty();
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
      output:   this.element.find('#output'),
      modal:    $('#modal'),
    }
  }

  // Control buttons
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

  // Setting elements
  get settings()
  {
    return {
      connect  : this.ui.settings.find('.setting-connect'),
      battery  : this.ui.settings.find('.setting-battery'),
      duration : this.ui.settings.find('.setting-duration'),
      mode     : this.ui.settings.find('.setting-mode'),
    }
  }


}