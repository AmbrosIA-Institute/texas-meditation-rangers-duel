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
  countdown: 3,

  // Type of countdown
  cdtype: 'modal',

  // Game display ratio
  ratio: 1,

  // Starting width
  width: 1024,
}

const disable = function(element){
  $(element).addClass('disabled').attr('disabled','disabled');
}

const enable = function(element){
  $(element).removeClass('disabled').removeAttr('disabled');
}

const show = function( element )
{
  $(element).addClass('show');
}

const hide = function( element )
{
  $(element).removeClass('show');
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

    // Viewport size
    this.width  = this.element.outerWidth();
    this.height = this.element.outerHeight();

    // Size the game window to the view
    this.resizeFrame();

    $(window).resize(this.resizeFrame.bind(this));

    // Intialize control buttons
    this.initControls();

    // Initialize Settings
    this.initSettings();

    // Setup Players
    for( let i=0; i<this.config.players; i++ )
    {
      players.push(new Player(i));
    }
    for( let i=0; i<this.config.players; i++ )
    {
      setTimeout(function(){ players[i].startStream(); }, 10);
    }


    this.players = players;

    // this.ui.settings.find('.settings-close').click( this.hideSettings );
    this.reset();


    console.log(this.width, this.height);
    console.log('Ready to Battle');
  }

  // Resize the game to fit the game ratio within the device/browser window
  // Attached to $(window).resize()
  resizeFrame()
  {
    const ww = $(window).width();
    const wh = $(window).height();
    const r  = this.width/this.height;
    const scale = (ww/wh) > r ? wh/this.height : ww/this.width;
    const transform = 'translate(-50%,-50%) scale('+scale+')';
    
    $('#viewport').css('transform', transform);    

    // console.log('resize',ww,wh,o,scale);
  }

  // Reset the game to zero state
  reset()
  {
    // Reset game props
    this.playing             = false;
    this.paused              = false;
    
    this.startTime           = null;
    this.battleTime          = 0;
    this.battleTimeRemaining = 0;
    this.currentFrame        = 0;

    // Revert ui elements
    this.controls.time.text('00:00');
    this.hideModal();
    this.hideDial();
    this.element.removeClass('playing paused');
    this.controls.battle.html('BATTLE');
    this.controls.reset.removeClass('confirm');
    this.controls.reset.text('RESET');
    enable(this.controls.settings);
    this.ui.output.find('h2.countdown').empty();

    // Clear any errors
    this.clearErrors();

    // Reset players
    $.each(this.players, function(index,player){
      player.reset();
    });

    console.log('RESET');
  }

  // Init battle, ui & start countdown
  start()
  {
    // Cant do settings while playing
    disable(this.controls.settings);

    // Battle button becomes pause button
    this.controls.battle.html('PAUSE');

    this.playing = true;
    this.paused  = true;

    // Start countdown
    if( this.config.cdtype == 'modal' ) {
      this.startCountdownModal();
    } else {
      this.startCountdown();
    }
    

  }

  // Stop the current battle processes and reset
  stop()
  {
    this.reset();
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

    disable(this.controls.settings);
    disable(this.controls.battle);
    disable(this.controls.reset);

    out.text('0'+count);
    out2.text( words[count-1] );
    this.ui.modal.addClass('show');
    count--;

    const interval = window.setInterval( function()
    {
      if( count < 0 )
      {
        window.clearInterval(interval);

        out.text('00');

        enable(this.controls.battle);
        enable(this.controls.reset);

        this.hideModal();
        this.startBattle();

        console.log('Countdown finished');
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
    this.element.addClass('playing');

    // Unpause game
    this.resume();
    
    // Show the meter dial
    this.showDial();

    // this.startTimer();
    $.each(this.players, function(index,player){
        //player.startStream();
    });

    window.requestAnimationFrame( this.frame.bind(this) );


  }

  // Called when battle reaches time
  // collect player scores here, ending sequences etc.
  endBattle()
  {
    console.log('END OF BATTLE');
    this.stop();
  }

  // Called each frame during battle via requestAnimationFrame
  // passes timestamp DOUBLE with milliseconds
  frame(ts)
  {
    if( ! this.playing ) return;

    if( ! this.startTime ) this.startTime = ts;

    if( this.paused )
    {
      window.requestAnimationFrame( this.frame.bind(this) );
      return;
    }

    this.battleTime = Math.floor(ts - this.startTime);

    const seconds = Math.floor(this.battleTime/1000);

    this.currentFrame++;

      //console.log('FRAME', this.currentFrame, 'TS',ts, 'BT',this.battleTime,'S',seconds,'D', this.config.duration);

    if( seconds >= this.config.duration ) 
    {  
      this.endBattle();
      return;
    }

    const t = this.config.duration - seconds;
    const m = Math.floor( t / 60 );
    const s = Math.floor( t % 60 );
    const c = ( m < 10 ? '0'+m : m ) + ':' + ( s < 10 ? '0'+s : s );
      //console.log(t,m,s,c);

    this.controls.time.text(c);



    if( this.playing ) window.requestAnimationFrame( this.frame.bind(this) );

  }

  pause()
  {
    this.controls.battle.html('RESUME');
    this.paused = true;
    this.element.addClass('paused');
    this.ui.output.find('h2.message').text('PAUSED');
    console.log('PAUSED');
  }

  resume()
  {
    this.controls.battle.html('PAUSE');
    this.paused = false;
    this.element.removeClass('paused');
    this.ui.output.find('h2.message').empty();
    console.log('RESUME');
  }

  hideModal()
  {
    this.ui.modal.removeClass('show');
  }

  showModal()
  {
    this.ui.modal.addClass('show');
  }

  hideDial()
  {
    this.ui.meter.removeClass('show');
  }

  showDial()
  {
    this.ui.meter.addClass('show');
  }

  

  // Add listeners to controls
  initControls()
  {
    // listen for mouse and mobile touch
    this.controls.settings.on('click touchstart', this.onSettingsClick.bind(this) );
    this.controls.close.on('click touchstart', this.onSettingsClose.bind(this) );
    this.controls.battle.on('click touchstart', this.onBattleClick.bind(this) );
    this.controls.reset.on('click touchstart', this.onResetClick.bind(this) );
    this.controls.reset.on('mouseout', this.cancelResetConfirm.bind(this) );

    this.controls.player1.on('click touchstart', this.onPlayer1.bind(this) );
    this.controls.player2.on('click touchstart', this.onPlayer2.bind(this) );
  }

  // Cancel reset confirmation
  cancelResetConfirm(e)
  {
    e.stopPropagation();
    this.controls.reset.removeClass('confirm').text('RESET');
    $(document).off('click touchstart', this.cancelResetConfirm);
  }

  onPlayer1()
  {
      //this.players[0].startStream();
      //this.players[0].disconnect();
    this.players[0].connect();
  }

  onPlayer2()
  {
      //this.players[1].startStream();
      //this.players[0].disconnect();
    this.players[1].connect();
  }

  // Reset button listener
  onResetClick(e)
  {
    if( ! $(e.target).hasClass('confirm') )
    {
      e.stopPropagation();

      $(e.target).addClass('confirm').text('CONFIRM');
    
      $(document).on('click touchstart', this.cancelResetConfirm.bind(this));
      
      return false;
    } 
    else
    {
      if( this.playing ) {
        this.stop();
      } else {
        this.reset();
      }
    }


    
  }

  // Battle button listener
  onBattleClick(e)
  {
    if( ! this.playing ) 
    {
      this.start();
      return;
    }
  
    if( this.paused ) { this.resume() } else { this.pause(); }
  
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
    // UI adjust on battery
    this.settings.battery.find('.player').each(function(i,player){

      const level = parseInt(Math.random() * 100);
      this.setBatteryLevel(player, level);
  
    }.bind(this));

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
    this.settings.battery.find('.player').each(function(i,player){

      const level = parseInt(Math.random() * 100);
      this.setBatteryLevel(player, level);
  
    }.bind(this));

    //console.log('Settings', this.settings);
    this.settings.duration.find('#battle-duration').val( this.config.duration );

     //console.log('Mode', this.settings.mode.find('.mode-list li') );
    this.settings.mode.find('.mode-list li').each(function(){
      let active = $(this).data('mode') == game.config.mode;
      // console.log('Mode', $(this).data('mode'));
      $(this).toggleClass('active', active);
    });

  }

  // Set battery level in settings
  setBatteryLevel( player, level )
  {
    const perc  = ( level < 10 ? '0'+level : level ) + '%';
    const right = 100-level;

    $(player).find('.battery-percent').text(perc);

    // console.log(level, right);
    $(player).find('.battery-f').css('right', right + '%');
  }

  // Show error in the display
  showError( msg )
  {
    this.ui.output.find('h2.error').empty().text(msg).css('opacity', 1);
  }

  // Clear error display
  clearErrors()
  {
    this.errors = [];
    this.ui.output.find('h2.error').empty().css('opacity', 0);
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
      player1  : this.ui.settings.find('.player-1'),
      player2  : this.ui.settings.find('.player-2'),
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
