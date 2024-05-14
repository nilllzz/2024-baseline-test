/** @param {Date} d */
function getDateStr(d) {
	let text = "";

	const day = d.getDate();
	text += day;

	if (day > 3 && day < 21) {
		text += "th";
	} else {
		switch (day % 10) {
			case 1:
				text += "st";
				break;
			case 2:
				text += "nd";
				break;
			case 3:
				text += "rd";
				break;
			default:
				text += "th";
				break;
		}
	}

	text += " " + d.toLocaleString("en-us", { month: "long" });
	text += " 2024";

	return text;
}

const currentDateEl = document.getElementById("currentDate");
currentDateEl.innerText = getDateStr(new Date());

async function playSound(soundId) {
	const filename = "audio/" + soundId + ".mp3";

	return new Promise(async (resolve) => {
		console.log("set up audio", filename);
		const audio = new Audio(filename);
		audio.addEventListener("ended", () => {
			console.log("playback ended", filename);
			resolve();
		});
		audio.addEventListener("loadeddata", async () => {
			console.log("start playback", filename);
			await audio.play();
		});
	});
}

const stages = [
	{
		audio: "c1",
		answer: ["edge"],
	},
	{
		audio: "c2",
		answer: ["edge"],
	},
	{
		audio: "c3",
		answer: ["edge"],
	},
	{
		audio: "c4",
		answer: ["edge"],
	},
	{
		audio: "c5",
		answer: ["rizz"],
	},
	{
		audio: "c6",
		answer: ["rizz"],
	},
	{
		audio: "c7",
		answer: ["rizz"],
	},
	{
		audio: "c8",
		answer: ["rizz"],
	},
	{
		audio: "c9",
		answer: ["rizz"],
	},
	{
		audio: "c10",
		answer: ["rizz"],
	},
	{
		audio: "c11",
		answer: ["rizz"],
	},
	{
		audio: "c12",
		answer: ["skibidi", "edge", "rizz"],
	},
	{
		audio: "c13",
		answer: [
			"skibidi",
			"edge",
			"rizz",
			"skibidi",
			"edge",
			"rizz",
			"skibidi",
			"edge",
			"rizz",
		],
	},
];
let currentStageIndex = 0;
let currentAnswers = [];
let startedGameOn = 0;

async function beginTest() {
	startedGameOn = Date.now();

	const beginContainerEl = document.getElementById("beginContainer");
	beginContainerEl.style.display = "none";

	await playSound("c1");

	randomizeButtons();
	const controlsEl = document.getElementById("controls");
	controlsEl.style.display = "block";
}

async function answer(answerStr) {
	const controlsEl = document.getElementById("controls");
	controlsEl.style.display = "none";

	const answerSound =
		(currentStageIndex > 10 ? "end-" : "generic-") + answerStr;
	await playSound(answerSound);

	let currentStage = stages[currentStageIndex];
	const currentStageAnswer = currentStage.answer[currentAnswers.length];

	// Wrong answer.
	if (answerStr !== currentStageAnswer) {
		console.log("wrong answer", answerStr, currentStageAnswer);
		controlsEl.style.display = "block";
		return;
	}

	currentAnswers.push(answerStr);
	// All answered.
	if (currentAnswers.length === currentStage.answer.length) {
		currentStageIndex++;
		currentAnswers = [];

		if (currentStageIndex === stages.length) {
			endGame();
			return;
		}

		currentStage = stages[currentStageIndex];
		await playSound(currentStage.audio);
	}

	randomizeButtons();
	controlsEl.style.display = "block";
}

function randomizeButtons() {
	const controlsEl = document.getElementById("controls");
	const buttonEls = controlsEl.getElementsByTagName("button");
	const buttons = [];
	for (const button of buttonEls) {
		buttons.push(button);
	}

	controlsEl.innerHTML = "";
	shuffleArray(buttons);

	for (const button of buttons) {
		controlsEl.appendChild(button);
	}
}

function shuffleArray(array) {
	for (var i = array.length - 1; i > 0; i--) {
		var j = Math.floor(Math.random() * (i + 1));
		var temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}
}

function answerSkibidi() {
	answer("skibidi");
}

function answerEdge() {
	answer("edge");
}

function answerRizz() {
	answer("rizz");
}

async function endGame() {
	const endedGameOn = Date.now();
	const diff = endedGameOn - startedGameOn;

	const endGameOverlayEl = document.getElementById("endGameOverlay");
	endGameOverlayEl.style.display = "flex";

	await playSound("end1");

	const endGameTextEl = document.getElementById("endGameText");
	endGameTextEl.style.display = "inline";

	setTimeout(() => {
		const timerText = new Date(diff).toISOString().slice(11, 19);

		const endGameTimerEl = document.getElementById("endGameTimer");
		endGameTimerEl.innerText = timerText;
	}, 1500);

	await playSound("end2");
}
