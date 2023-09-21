const readline = require('readline');

let score = 0;
let solutions = [];
let answer = null;
let isGameOver = false;

const characters = [1, 2, 3, 4];

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

const ask = (question) => {
  let response;

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.setPrompt(question);
  rl.prompt();

  return new Promise((resolve, reject) => {
    rl.on('line', (answer) => {
      response = answer;
      rl.close();
    });
    rl.on('close', () => {
      resolve(response);
    });
  });
}

// Updates the progress
const update = () => {
  const latest = solutions[solutions.length - 1] || "";
  const next = characters[Math.floor(Math.random() * characters.length)];
  solutions.push(`${latest}${next}`);
};

const clearLastLines = (count) => {
  process.stdout.moveCursor(0, -count)
  process.stdout.clearScreenDown()
}

// Draws the game
let timer = 0;
const draw = async () => {
  clearTimeout(timer);

  const nextAnswer = solutions[solutions.length - 1];

  process.stdout.write(`Simon says: ${nextAnswer}\n`);

  await sleep(2000);
  clearLastLines(1)

  const answer = await ask("Simon said: ");
  if (answer !== nextAnswer) {
    isGameOver = true;
  } else {
    score += 1;
  }

  clearLastLines(1)
}

// Setup everything
const loop = async () => {
  if (isGameOver) {
    process.stdout.write('You died\n');
    process.stdout.write(`Your score was: ${score}\n`);
    return false;
  }
  update();
  await draw();
  loop();
}

loop();