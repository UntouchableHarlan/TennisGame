var canvas;
var canvasContext;
var ballX = 50;
var ballY = 50;
var ballSpeedX = 10;
var ballSpeedY = 4;
var paddleThickness = 10;

var paddle1Y = 250;
var paddle2Y = 250;
const PADDLE_HEIGHT = 100;

var yourScore = 0;
var opponentScore = 0;
const WINNING_SCORE = 3;

var stopGame = false;


function calculateMousePos(evt) {
	var rect = canvas.getBoundingClientRect();
	var root = document.documentElement;
	var mouseX = evt.clientX - rect.left - root.scrollLeft;
	var mouseY = evt.clientY - rect.top - root.scrollTop;
	return {
		x:mouseX,
		y:mouseY
	};
}

function mouseClick(event) {
  if (stopGame) {
    var yourScore = 0;
    var opponentScore = 0;
    stopGame = false;
  }
}

window.onload = function() {
	canvas = document.getElementById('canvas');
	canvasContext = canvas.getContext('2d');

	var framesPerSecond = 30;
	setInterval(function() {
			moveEverything();
			drawEverything();
		}, 1000/framesPerSecond);

  canvas.addEventListener('mousedown', mouseClick);

	canvas.addEventListener('mousemove', function(evt) {
			var mousePos = calculateMousePos(evt);
			paddle1Y = mousePos.y - PADDLE_HEIGHT/ 2;
	});

}

function ballReset() {
  if ((yourScore >= WINNING_SCORE) || (opponentScore >= WINNING_SCORE)) {
    yourScore = 0;
    opponentScore = 0;
    stopGame = true;
  }
  ballSpeedX = -ballSpeedX;
  ballX = canvas.width/2;
  ballY = canvas.height/2;
}

function computerMovement() {
  var paddle2YCenter = paddle2Y + (PADDLE_HEIGHT/2)
  if (paddle2YCenter < ballY-35) {
    paddle2Y += 6
  } else if (paddle2YCenter > ballY+35) {
    paddle2Y -= 6
  }
}

function moveEverything() {
  if (stopGame) {
     return;
  }
  computerMovement();
	ballX = ballX + ballSpeedX;
	ballY = ballY + ballSpeedY;

	if(ballX < 0) {
    if ((ballY > paddle1Y) && (ballY < paddle1Y + PADDLE_HEIGHT)) {
      ballSpeedX = -ballSpeedX;

      var deltaY = ballY - (paddle1Y + PADDLE_HEIGHT/2)
      ballSpeedY = deltaY * 0.35;
    } else {
      opponentScore += 1;
      console.log("o score: " + opponentScore);
      ballReset();
    }
   }
	if(ballX > canvas.width) {
    if ((ballY > paddle2Y) && (ballY < paddle2Y + PADDLE_HEIGHT)) {
      ballSpeedX = -ballSpeedX;

      var deltaY = ballY - (paddle2Y + PADDLE_HEIGHT/2)
      ballSpeedY = deltaY * 0.35;
    } else {
      yourScore += 1;
      console.log("y score: " + yourScore);
      ballReset();
    }
	}
	if(ballY < 0) {
		ballSpeedY = -ballSpeedY;
	}
	if(ballY > canvas.height) {
		ballSpeedY = -ballSpeedY;
	}
}

function drawEverything() {
	// next line blanks out the screen with black
	colorRect(0,0,canvas.width,canvas.height,'black');

  if (stopGame) {
    canvasContext.fillStyle = "red";
    if (yourScore >= WINNING_SCORE) {
      canvasContext.fillText("Player 1 wins!!", 300, 200)
    } else if (opponentScore >= WINNING_SCORE) {
      canvasContext.fillText("Player 2 wins!!", 300, 200)
    }

    canvasContext.fillText("Click to Restart", 300, 500)
    return;
  }

	// this is left player paddle
	 colorRect(0,paddle1Y, paddleThickness, PADDLE_HEIGHT,'blue');

  // this is right player paddle
	colorRect(canvas.width - paddleThickness, paddle2Y, paddleThickness,PADDLE_HEIGHT,'red');

	// next line draws the ball
	colorCircle(ballX, ballY, 10, 'white');

  canvasContext.fillText(yourScore, 100, 100);
  canvasContext.fillText(opponentScore, canvas.width-100, 100);
}

function colorCircle(centerX, centerY, radius, drawColor) {
	canvasContext.fillStyle = drawColor;
	canvasContext.beginPath();
	canvasContext.arc(centerX, centerY, radius, 0,Math.PI*2,true);
	canvasContext.fill();
}

function colorRect(leftX,topY, width,height, drawColor) {
	canvasContext.fillStyle = drawColor;
	canvasContext.fillRect(leftX,topY, width,height);
}
