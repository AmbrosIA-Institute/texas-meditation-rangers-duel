import $ from 'jquery';
import FFT from './fft';
import Muse from './muse';


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
	}

	reset()
	{
		//console.log('reset',this.ui.score);

		// Current Meditation Score 
		this.status = this._status = 0;

		// Total point score
		this.score  = this._score = 0;

		$.each(this.streams, function(i,stream){
			stream.stop();
			stream.reset();
		});
		
	}

	startStream()
	{
		this.startFFT();
		//console.log('Player', this.number, 'Start');
	}

	// Attempt to connect
	connect()
	{
		Muse.connect( this.index, this.onConnectResponse.bind(this), this.onConnectFailure.bind(this) );
	}

	// Disconnect headset
	disconnect()
	{
		Muse.diconnect(this.index);
	}

	// Parse connection response
	onConnectResponse(response)
	{
		if( typeof response == 'string' ) {
			console.log(JSON.stringify(response, null, 4));
			return;
		}

		const type = response['type'];

		switch(type)
		{
			case 'MELLOW':
				this.mellow = response['value'];
				break;

			case 'FFT':
				for( let i=0; i<4; i++ )
				{
					this.fft[i] = response['values'+i];
				}
				break;

			default:
				break;
		}

		console.log(type, response);

	}

	onConnectFailure(response)
	{
		console.warn('Connection Failure', response);
	}


	startFFT()
	{
		  this.ffts = this.element.find('.fft');

			$.each(this.ffts, function(j,fft){
			   const pfft = new FFT(fft, { channels : 1 } );
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
		return this._score;
	}

}