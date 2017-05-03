GameConstructor = function ()
{
		
	this.canvas = document.getElementById("game_canvas");
	this.stage = new createjs.Stage(this.canvas);
	
	this.resizer = new Resizer(this);
		
	this.addTouch();
	this.addUpdate();
	this.addGameBackground();
	this.addTitle();
	this.addStartButton();
};

GameConstructor.prototype =
{
	addTouch: function ( soundId, loop )
	{	
		// enable touch interactions if supported on the current device:
		createjs.Touch.enable(this.stage);
		
		// enabled mouse over / out events
		this.stage.enableMouseOver(10);
		this.stage.mouseMoveOutside = true; // keep tracking the mouse even when it leaves the canvas
		
		//Add keyboard events
		document.onkeydown = this.handleKeyDown.bind(this);
	},
	
	addUpdate: function()
	{
		createjs.Ticker.addEventListener("tick", this.onUpdate.bind(this));
	},
	
	addGameBackground: function()
	{
		this.gBackground = this.stage.addChild(new createjs.Shape());
		
		// Adds the dimensions and color of the game background and adds it to the resizer
		this.gBackground.updatePosition = function(){
			this.gBackground.graphics.beginFill("#5555ff").drawRect(0, 10, this.canvas.width, this.canvas.height);
		}.bind(this);
		this.gBackground.updatePosition();
		this.resizer.add(this.gBackground);
	},
	
	addTitle: function()
	{
		this.title = new Text({ game:this, text:"Rock Paper Scissor Game", xPercentage: 0.5, yPercentage: 0.2, resizer:this.resizer});
	},
	
	addScoreText: function()
	{
		this.scoreField = new Text({ game:this, text:"Score: 0", xPercentage: 0.95, yPercentage: 0.025, resizer:this.resizer, alignment: "right"});
	},
	
	addStartButton: function()
	{
		this.startButton = new Button({ game:this, text:"Start", xPercentage: 0.5, yPercentage: 0.5, resizer: this.resizer, pressFunction: this.selectRounds.bind(this)});
	},
	
	selectRounds: function()
	{
		this.startButton.markForRemoval();
		this.title.textObj.text = "Select number of rounds";
		
		//Displays to the user what the total rounds to be played
		this.roundsText = new Button({ game:this, text:"Rounds: 1", xPercentage: 0.35, yPercentage: 0.5, resizer: this.resizer, textSize: "24px", width:150, height: 50	});

		// Buttons to increase or decrease number or rounds
		this.addOne = new Button({ game:this, text:"+1", xPercentage: 0.6, yPercentage: 0.45, resizer: this.resizer, width:50, height: 50, pressFunction: this.changeRounds.bind(this,1)});
		this.subtractOne = new Button({ game:this, text:"-1", xPercentage: 0.6, yPercentage: 0.55, resizer: this.resizer, width:50, height: 50, pressFunction: this.changeRounds.bind(this,-1)});
		
		//Button to begin playing game
		this.startButton = new Button({ game:this, text:"Start", xPercentage: 0.7, yPercentage: 0.75, resizer: this.resizer,  width:150, height: 75, backgroundColor: "#ff0000", pressFunction: this.startGame.bind(this)});
		
		//Initializing number of roundss
		this.numRounds = 1;
		this.stage.update();
	},
	
	changeRounds: function(offset)
	{
		this.numRounds += offset;
		//Always keep the number of rounds between 1 and 12
		this.numRounds = Math.max(this.numRounds,1);
		this.numRounds = Math.min(this.numRounds,12);
		//Update the displayed text
		this.roundsText.textObj.text = "Rounds: " + this.numRounds;
		this.stage.update();
	},
	
	startGame: function(offset)
	{
		//Remove previous assets
		this.addOne.markForRemoval();
		this.subtractOne.markForRemoval();
		this.startButton.markForRemoval();
		this.roundsText.markForRemoval();
		
		this.playerText = new Text({ game:this, text:"Player:", xPercentage: 0.45, yPercentage: 0.7, alignment:"right", textSize: "24px",  resizer:this.resizer});
		this.computerText = new Text({ game:this, text:"Computer:", xPercentage: 0.55, yPercentage: 0.7, alignment:"left", textSize: "24px",  resizer:this.resizer});
		this.playerScoreText = new Text({ game:this, text:"0", xPercentage: 0.35, yPercentage: 0.75, alignment:"center", textSize: "24px",  resizer:this.resizer});
		this.computerScoreText = new Text({ game:this, text:"0", xPercentage: 0.65, yPercentage: 0.75, alignment:"center", textSize: "24px",  resizer:this.resizer});
		
		this.playerScore = 0;
		this.computerScore = 0;
		
		// Set number of rounds
		this.currentRound = 1;
		
		this.enterRound();
	},
	
	
	// =====  Game Functionality ======
	enterRound: function()
	{
		this.title.textObj.text = "Round: " + this.currentRound;
		if(this.currentRound > this.numRounds)
		{
			this.title.textObj.text = "Tiebreaker Round!";
		}

		
		//Add a timeout (updated in onUpdate)
		this.playerTimeout = new Text({ game:this, text:"Timer: 10", xPercentage: 0.9, yPercentage: 0.1, alignment:"right", textSize: "24px", resizer:this.resizer});
		this.playerTimeout.goalTime = this.globalTime + 9999;
		
		this.createInput();
		
		this.stage.update();
	},
	
	createInput: function()
	{
		//Button to begin playing game
		this.rock = new Button({ game:this, text:"(R)ock", xPercentage: 0.35, yPercentage: 0.45, resizer: this.resizer,  width:125, height:50,  textSize: "24px", backgroundColor: "#ff0000", pressFunction: this.selectOption.bind(this,1)});
		this.paper = new Button({ game:this, text:"(P)aper", xPercentage: 0.65, yPercentage: 0.45, resizer: this.resizer,  width:125, height: 50,  textSize: "24px", backgroundColor: "#ff0000", pressFunction: this.selectOption.bind(this,2)});
		this.scissors = new Button({ game:this, text:"(S)cissors", xPercentage: 0.5, yPercentage: 0.55, resizer: this.resizer,  width:150, height: 50,  textSize: "24px", backgroundColor: "#ff0000", pressFunction: this.selectOption.bind(this,3)});
		this.keyboardEnabled = true;
	},

	handleKeyDown: function(e)
	{
		if(!this.keyboardEnabled){return}
		//cross browser issues exist
		if (!e) {
			var e = window.event;
		}
		switch (e.keyCode) {
			case 82: // R pressed for rock
				this.selectOption(1);
				break;
			case 80: // P pressed for paper
				this.selectOption(2);
				break;
			case 83: // S presssed for scissors
				this.selectOption(3);
				break;
		}
	},
	
	selectOption: function(opt)
	{
		// Pick the computer's option and results
		if(this.waiting){return;}
		this.keyboardEnabled = false;
		var computerOpt = Math.floor(Math.random()*3)+1;	
		var playerWon = (opt == 1 && computerOpt == 3) || (opt == 2 && computerOpt == 1) || (opt == 3 && computerOpt == 2);
		this.showResult(opt == computerOpt, playerWon, computerOpt)
	},
	
	showResult: function(tie,playerWon,computerOpt)
	{
		// If player timed out
		if(!computerOpt)
		{
			this.title.textObj.text = "You didnt pick!\n Computer wins by default";		
			this.computerScore++;
		}
		else if(tie) // If tie
		{
			this.title.textObj.text = "Tie! Computer also \npicked " + this.toType(computerOpt);
		}
		else //Player won or lost
		{
			this.title.textObj.text = "You " + (playerWon ? "won" : "lost") + "!\n Computer picked " + this.toType(computerOpt);
			playerWon ? this.playerScore++ : this.computerScore++;
		}
		this.waiting = true;
		this.waitTime = 2;
		this.playerScoreText.textObj.text = "" + this.playerScore;		
		this.computerScoreText.textObj.text = "" + this.computerScore;		
		
		//Remove buttons
		this.rock.markForRemoval();
		this.paper.markForRemoval();
		this.scissors.markForRemoval();
		this.playerTimeout.markForRemoval();
		this.playerTimeout = null;
		
		this.currentRound++;
		this.stage.update();
	},
	
	toType: function(id)
	{
		return (id == 1 ? "Rock" : (id == 2 ? "Paper" : "Scissors"));
	},
	
	onUpdate: function(event)
	{
		this.globalTime = event.time;
		if(this.playerTimeout)
		{
			if(this.globalTime > this.playerTimeout.goalTime)
			{
				this.showResult();
				return;
			}
			else
			{
				this.playerTimeout.textObj.text = "Timer: " + (Math.floor((this.playerTimeout.goalTime - this.globalTime)/1000)+1);
				this.stage.update();
			}
		}
		if(this.waitTime > 0)
		{
			this.waitTime -= event.delta/1000;
		}
		else
		{
			if(this.waiting)
			{
				if(this.currentRound <= this.numRounds || this.playerScore == this.computerScore)
				{
					this.enterRound();
				}
				else
				{
					this.showGameover();
				}
			}
			this.waiting = false;
		}
	},
	
	showGameover: function()
	{
		this.title.textObj.text = "Congratulations!\n You won!";	
		
		// Remove scores
		this.playerText.markForRemoval();
		this.computerText.markForRemoval();
		this.playerScoreText.markForRemoval();
		this.computerScoreText.markForRemoval();
		
		if(this.playerScore < this.computerScore)
		{
			 this.title.textObj.text = "Computer won!\n Try again next time!";	
		}
		
		this.gameOverExit = new Button({ game:this, text:"Exit", xPercentage: 0.75, yPercentage: 0.8, resizer: this.resizer,  width:150, height: 50,  textSize: "24px", backgroundColor: "#ff0000", pressFunction: this.exitGameover.bind(this,3)});
		
	},
	
	exitGameover: function()
	{
		this.title.textObj.text = "Rock Paper Scissor Game";	
		this.gameOverExit.markForRemoval();
		this.addStartButton();
	},
	
};
