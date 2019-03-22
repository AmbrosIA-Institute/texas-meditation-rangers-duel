import $ from 'jquery';
import FFT from './fft';


export default class Player
{
	constructor( index )
	{	
		this.index  = index;
		this.number = index + 1;

		this.channels 

		this.element = $( '.player-' + this.number );

		console.log('player',this.number,this.element);
	}

	reset()
	{
		console.log('reset',this.ui.score);

		// Current Meditation Score 
		this.status = this._status = 0;

		// Total point score
		this.score  = this._score = 0;
		
	}

	startStream()
	{
		this.startFFT();

		console.log('Player', this.number, 'Start');
	}


	startFFT()
	{
		  this.ffts = this.element.find('.fft');

			$.each(this.ffts, function(j,fft){
			   const pfft = new FFT(fft, { channels : 1 } );
			   pfft.start();
			});

			console.log('FFTS',this.ffts);
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