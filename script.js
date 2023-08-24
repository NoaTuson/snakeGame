const height = 30;
const width = 30;

const snake = [6, 5, 4, 3, 2, 1, 0];
let head = snake[0];

let isGameOver = false;
let startingPosition = "left";
let interval;
let blueberryPosition;

let sound1 = new Audio("./pebble.ogg");
let sound2 = new Audio("./Country_Blues.ogg");

const board = document.querySelector(".board");
board.style.gridTemplateColumns = `repeat(${width}, 1fr)`;

const rightBoundaries = [];
const leftBoundaries = [];

for (let i = 0; i <= height; i++) {
	leftBoundaries.push(i * width);
}

for (let i = 0; i < height; i++) {
	rightBoundaries.push(i * width - 1);
}

function createBoard() {
	for (let i = 0; i < width * height; i++) {
		const div = document.createElement("div");
		board.appendChild(div);
		// div.innerHTML = i;
	}

	snakeColor();
	blueberry();
}

function blueberry() {
	blueberryPosition = Math.floor(Math.random() * (width * height));
	if (snake.includes(blueberryPosition)) {
		blueberry();
	} else {
		const boardDivs = board.querySelectorAll("div");
		boardDivs.forEach((Element) => Element.classList.remove("blueberry"));
		boardDivs[blueberryPosition].classList.add("blueberry");
	}
}

function snakeColor() {
	const boardDivs = board.querySelectorAll("div");
	boardDivs.forEach((Element) =>
		Element.classList.remove("snake", "head", "up", "down", "left", "right")
	);
	snake.forEach((num) => boardDivs[num].classList.add("snake"));
	boardDivs[head].classList.add("head", startingPosition);
}

window.addEventListener("keydown", (event) => {
	event.preventDefault();

	switch (event.key) {
		case "ArrowUp":
			snakeMoves("up");
			break;
		case "ArrowDown":
			snakeMoves("down");
			break;
		case "ArrowLeft":
			snakeMoves("left");
			break;
		case "ArrowRight":
			snakeMoves("right");
			break;
	}
});

function snakeMoves(currentDirection) {
	if (isGameOver) {
		return;
	}

	const boardDivs = board.querySelectorAll("div");

	if (currentDirection === "left") {
		if (startingPosition === "right") {
			return;
		}

		head++;

		if (leftBoundaries.includes(head)) {
			gameOver();
			return;
		}
	} else if (currentDirection === "right") {
		if (startingPosition === "left") {
			return;
		}

		head--;

		if (rightBoundaries.includes(head)) {
			gameOver();
			return;
		}
	} else if (currentDirection === "up") {
		if (startingPosition === "down") {
			return;
		}

		head -= width;

		if (boardDivs[head] === undefined) {
			gameOver();
			return;
		}
	} else if (currentDirection === "down") {
		if (startingPosition === "up") {
			return;
		}

		head += width;

		if (boardDivs[head] === undefined) {
			gameOver();
			return;
		}
	}

	if (snake.includes(head)) {
		gameOver();
		return;
	}

	startingPosition = currentDirection;
	snake.unshift(head);

	if (blueberryPosition == head) {
		sound1.play();
		blueberry();
	} else {
		snake.pop();
	}

	snakeColor();
	autoStart();
}

function autoStart() {
	clearInterval(interval);
	interval = setInterval(function () {
		snakeMoves(startingPosition);
	}, 200);
}

function gameOver() {
	isGameOver = true;
	clearInterval(interval);
	sound2.play();

	setTimeout(() => {
		alert("Game Over");
		location.reload();
	}, 200);
}
