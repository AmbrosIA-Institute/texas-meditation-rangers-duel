import $ from 'jquery';
import FFT from './fft';
import { MuseClient } from 'muse-js';
import SimulateClient from './simulate.js';


export default class Player
{
    constructor( index )
    {	
        this.index   = index;
        this.number  = index + 1;
        this.streams = [];
        this.mellow  = [];
        this.name    = 'Player 0' + this.number;
        this.mode    = 'normal';
        this.element = $('.player-' + this.number );
        this.client  = null;
        this.chill   = Math.floor(Math.random()*5);
    }

    reset()
    {
        //console.log('reset',this.ui.score);

        // Current Meditation Score 
        this.status = this._status = 0;

        // Total point score
        this.score  = this._score = 0;

    }

    setMode(mode)
    {
       this.mode = mode;
    }

    async startStream()
    {
        console.log('Start stream Player '+this.number+' Mode: ' +this.mode);

        this.client = (this.mode == 'simulate') ? new SimulateClient() : new MuseClient();

        await this.client.connect();
        await this.client.start();

        this.startFFT();

        this.client.eegReadings.subscribe(this.onEegReadings.bind(this));

        // this.startFFT();
        //console.log('Player', this.number, 'Start');
    }

    onEegReadings(reading){

      if( this.mode == 'simulate' )
      {
        this.streams[reading.index].channelData[0] = reading.samples;

        const avg = reading.samples.reduce((p,c) => p+c)/reading.samples.length;

        this.mellow[reading.index] = (avg/2) + (Math.random() * 30);
      }

    }

    pause()
    {
      if( this.client ) this.client.pause();
    }


    resume()
    {
      if( this.client ) this.client.resume();
    }

    // Attempt to connect
    connect()
    {
        for( let i=0; i<4; i++ )
        {
            this.streams[i].demoMode = false;
        }

        MusePlugin.connect( this.index, this.onConnectResponse.bind(this), this.onConnectFailure.bind(this) );
    }

    // Disconnect headset
    disconnect()
    {
        for( let i=0; i<4; i++ )
        {
            this.streams[i].demoMode = true;
        }
        MusePlugin.diconnect(this.index);
    }

    // Parse connection response
    onConnectResponse(response)
    {
        console.log(this.number, window.performance.now(), response);

        if( typeof response == 'string' ) {
            console.log(JSON.stringify(response, null, 4));
            return;
        }

        const type = response['type'];

        switch(type)
        {
            case 'MELLOW':

                this.mellow = response['value'] * 100;
                this.status = Math.round(this.mellow);
                // console.log("Player " + this.number + " mellow " + this.mellow);
                break;

            case 'FFT':
                for( let i=0; i<4; i++ )
                {
                    this.streams[i].channelData[0] = response['values'+i];
                }
                break;

            default:
                break;
        }

        //console.log(type, response);

    }

    onConnectFailure(response)
    {
        console.warn('Connection Failure', response);
    }


    startFFT()
    {
       
        this.ffts = this.element.find('.fft');
        this.streams = [];
        $.each(this.ffts, function(j,fft){
            const pfft = new FFT(fft, { channels : 1 } );
            //pfft.demoMode = false;
            pfft.start();
            this.streams.push(pfft);
        }.bind(this));

        //console.log('FFTS',this.ffts);
    }

    updateScore()
    {
        const mellow = parseInt(this.getMellow());

        if (mellow > 90) {
            this.score += 15;
        } else if (mellow > 80) {
            this.score += 3;
        } else if (mellow > 75) {
            this.score += 1;
        }

        console.log('Player '+this.number+' score:'+this.score);
    }


    getMellow()
    {
      const mellow = this.mellow.length == 4 ? this.mellow.reduce((p,c) => p+c)/this.mellow.length : 0;

      if( this.mode == 'simulate' ) return mellow + this.chill;

      return mellow;
    }

    get ui() 
    {
      return {
        detail:    this.element.find('.player-detail'),
        icon:      this.element.find('.player-icon'),
        score:     this.element.find('.player-score-value'),
        actions:   this.element.find('.player-actions'),
        status:    this.element.find('.player-status'),
        track:     this.element.find('.player-status-track'),
        trackFill: this.element.find('.player-status-track-fill'),
        headsets:  this.element.find('.player-feedback')
      }
    }


    set status(n)
    {
        n = parseInt(n);
        if( n < 0 ) n = 0;
        if( n > 100 ) n = 100;

        this._status = n;

        this.ui.trackFill.css('width', this._status + '%');		
    }

    get status()
    {
        return this._status;
    }

    set score(n)
    {	
        this._score = n.toString().padStart(4, '0');

        this.ui.score.text(this._score);
    }

    get score()
    {
        return parseInt(this._score);
    }

    finalscore(n)
    {
        this._score = n.toString().padStart(4, '0');
        this.ui.score.text(this._score + " FINAL");
    }

}
