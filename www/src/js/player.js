import $ from 'jquery';
import FFT from './fft';
//import MusePlugin from './muse';


export default class Player
{
    constructor( index )
    {	
        this.index   = index;
        this.number  = index + 1;
        this.streams = [];
        this.name    = 'Player 0' + this.number;

        this.element = $( '.player-' + this.number );

        //console.log('player',this.number,this.element);
        //this.startFFT();
    }

    reset()
    {
        //console.log('reset',this.ui.score);

        // Current Meditation Score 
        this.status = this._status = 0;

        // Total point score
        this.score  = this._score = 0;

        //this.startFFT();
        /*
        $.each(this.streams, function(i,stream){
            stream.stop();
            stream.reset();
        });
        */

    }

    startStream()
    {
        this.startFFT();
        //console.log('Player', this.number, 'Start');
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
        console.log("start fft player " + this.number);
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
