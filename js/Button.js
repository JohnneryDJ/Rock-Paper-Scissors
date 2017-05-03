// Encapsulates the functionality of a button
Button = function (params)
{
	
	this.params = params;
	this.game = params.game;
	this.canvas = this.game.canvas;
	this.stage = this.game.stage;
	
	this.width = params.width ? params.width : 200;
	this.height = params.width ? params.height : 100;
	this.xPercentage = params.xPercentage ? params.xPercentage : 0.5;
	this.yPercentage = params.yPercentage ? params.yPercentage : 0.5;
	this.resizer = params.resizer ? params.resizer : null;
	this.textSize = params.textSize ? params.textSize : "36px";
	this.backgroundColor = params.backgroundColor ? params.backgroundColor : "#ffffff";
	
	this.container = this.stage.addChild(new createjs.Container());
	this.container.y = 100;
	 
	// Create white background
	var graphics = new createjs.Graphics().beginFill(this.backgroundColor).drawRect(0, 0, this.width, this.height);
	this.background = this.container.addChild(new createjs.Shape(graphics));
		
	//Creates the text for the button
	this.textObj = this.container.addChild(new createjs.Text(params.text, "bold " + this.textSize + " Arial", "#000"));
	this.textObj.textAlign = "center";
	this.textObj.x = this.width * 0.5;
	this.textObj.y = this.height * 0.35 - 10;
	
	if(this.resizer)
	{
		this.resizer.add(this);
	}
		
	//Adds the mouse event
	this.background.on("mousedown", this.handleMouse.bind(this));
	this.updatePosition();
};

Button.prototype =
{
	handleMouse: function ( event )
	{
		if(typeof this.params.pressFunction == "function")
		{
			this.params.pressFunction();
		}
	},
	
	updatePosition: function()
	{
		//Resizes the button on the screen
		this.container.scaleX = this.container.scaleY = Math.min(this.canvas.width/500, this.canvas.height/500);
		this.container.x = this.canvas.width * this.xPercentage - (this.width * 0.5 * this.container.scaleX);
		this.container.y = this.canvas.height * this.yPercentage - (this.height * 0.5 * this.container.scaleX);
		
		//update the stage to show the button
	    this.stage.update(); 	
	
	},
	
	markForRemoval: function()
	{
		this.stage.removeChild(this.container);
		this._markedForRemoval = true;
		this.stage.update();
	},
};