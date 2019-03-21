import $ from 'jquery';


export default class Player
{
	constructor( index )
	{	
		this.index  = index;
		this.nubmer = index + 1;
		this.element = $( 'player-' + this.number );
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

	}

}