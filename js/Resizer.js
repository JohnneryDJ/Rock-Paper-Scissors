// Handles resizing of th game canvas
Resizer = function (game)
{
	
	this.game = game;
	this.canvas = this.game.canvas;
	this.stage = this.game.stage;
	this.resizee = [];
		
	this.handleResize();
	window.addEventListener("resize", this.handleResize.bind(this));
};

Resizer.prototype =
{
	add: function(element)
	{
		this.resizee.push(element);
	},
	
	handleResize: function ( soundId, loop )
	{
		var w = window.innerWidth-20; // -2 accounts for the border
		var h = window.innerHeight-20;
		this.canvas.width = w;
		this.canvas.height = h;
		//
		var ratio = 1; // 100 is the width and height of the circle content.
		var windowRatio = w/h;
		var scale = w/90;
		if (windowRatio > ratio) {
			scale = h/90;
		}
		
		this.resizeElements();
		this.stage.update();
	},
	
	resizeElements: function()
	{
		//Resizes the elements of the game 
		if(!this.game){return}
		
		if(this.game.scoreField)
		{
			this.game.scoreField.x = this.canvas.width - 50;
			this.game.scoreField.y = 20;
		}
		for(var i = this.resizee.length-1; i >= 0; i--)
		{
			var element = this.resizee[i];
			if(!element || element._markedForRemoval)
			{
				this.resizee.splice(i,1);
			}
			else
			{
				if(typeof element.updatePosition == "function")
				{
					element.updatePosition();
				}
			}
		}
		
	}
};