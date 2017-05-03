// Encapsulates the functionality of a text
Text = function (params)
{
	
	this.params = params;
	this.game = params.game;
	this.canvas = this.game.canvas;
	this.stage = this.game.stage;
	
	this.xPercentage = params.xPercentage ? params.xPercentage : 0.5;
	this.yPercentage = params.yPercentage ? params.yPercentage : 0.5;
	this.color = params.color ? params.color : "#000";
	this.alignment = params.alignment ? params.alignment : "center";
	this.resizer = params.resizer ? params.resizer : null;
	this.text = params.text ? params.text : "text";
	this.textSize = params.textSize ? params.textSize : "36px";
	
	//Creates the tex
	this.textObj = this.stage.addChild(new createjs.Text(this.text, "bold " + this.textSize + " Arial", this.color));
	this.textObj.textAlign = this.alignment;
	
	if(this.resizer)
	{
		this.resizer.add(this);
	}
		
	//Adds the mouse event
	this.updatePosition();
};

Text.prototype =
{
	updatePosition: function()
	{
		//Resizes the button on the screen
		this.textObj.x = this.canvas.width * this.xPercentage;
		this.textObj.y = this.canvas.height * this.yPercentage;
		this.textObj.scaleX = this.textObj.scaleY = Math.min(this.canvas.width/500, this.canvas.height/500);
		
		//update the stage to show the button
	    this.stage.update(); 	
	
	},
	
	markForRemoval: function()
	{
		this.stage.removeChild(this.textObj);
		this._markedForRemoval = true;
		this.stage.update();
	},
};