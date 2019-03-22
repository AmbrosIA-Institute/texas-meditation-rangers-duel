import $ from 'jquery';


export default class Player
{
	constructor( index )
	{	
		this.index  = index;
		this.number = index + 1;
		this.element = $( '.player-' + this.number );

		console.log('player',this.number,this.element);
	}

	reset()
	{
		console.log('reset',this.ui.score);
		this.score = 0;
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

	set score(n)
	{	
		let s = n.toString().padStart(4, '0');
		this.ui.score.text(s);
	}

}