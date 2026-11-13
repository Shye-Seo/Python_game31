// Navigation switching
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.game-section').forEach(s => s.classList.remove('active'));
    btn.classList.add('active');
    const targetGame = btn.dataset.game;
    document.getElementById(`game-${targetGame}`).classList.add('active');
  });
});

/* ========================================================
   GAME 1: 배스킨라빈스 31
======================================================== */
let br31Num = 0;
let br31GameOver = false;

function playBR31(count) {
  if (br31GameOver) return;
  const logEl = document.getElementById('br31-log');
  const numEl = document.getElementById('br31-current-num');

  // Player turn
  const playerNums = [];
  for (let i = 0; i < count; i++) {
    br31Num++;
    playerNums.push(br31Num);
    if (br31Num >= 31) break;
  }
  numEl.textContent = br31Num;

  if (br31Num >= 31) {
    logEl.innerHTML = `💥 <strong>패배!</strong> 승혜 님이 마지막 31을 불렀습니다! AI 승리!`;
    br31GameOver = true;
    return;
  }

  logEl.innerHTML = `👤 승혜 님: [ ${playerNums.join(', ')} ] 호출`;

  // AI turn with slight delay
  setTimeout(() => {
    if (br31GameOver) return;
    // Smart AI strategy: target 2, 6, 10, 14, 18, 22, 26, 30 (formula: 4n + 2)
    const target = Math.floor((br31Num - 2) / 4) * 4 + 6;
    let aiCount = target - br31Num;
    if (aiCount < 1 || aiCount > 3) {
      aiCount = Math.floor(Math.random() * 3) + 1;
    }
    // Don't commit suicide if avoidable
    if (br31Num + aiCount >= 31 && br31Num < 30) {
      aiCount = 30 - br31Num;
    }

    const aiNums = [];
    for (let i = 0; i < aiCount; i++) {
      br31Num++;
      aiNums.push(br31Num);
      if (br31Num >= 31) break;
    }
    numEl.textContent = br31Num;

    if (br31Num >= 31) {
      logEl.innerHTML = `🎉 <strong>승리!</strong> AI가 31을 불렀습니다! 승혜 님의 완벽한 승리!`;
      br31GameOver = true;
    } else {
      logEl.innerHTML += `<br>🤖 AI: [ ${aiNums.join(', ')} ] 호출 (다음 차례!)`;
    }
  }, 500);
}

function resetBR31() {
  br31Num = 0;
  br31GameOver = false;
  document.getElementById('br31-current-num').textContent = 0;
  document.getElementById('br31-log').textContent = '새 게임 시작! 숫자를 선택하세요.';
}

/* ========================================================
   GAME 2: 숫자 야구
======================================================== */
let baseballAnswer = [];
let baseballAttempts = 0;
let baseballGameOver = false;

function generateBaseballAnswer() {
  const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const result = [];
  for (let i = 0; i < 3; i++) {
    const idx = Math.floor(Math.random() * digits.length);
    result.push(digits[idx]);
    digits.splice(idx, 1);
  }
  return result;
}

function resetBaseball() {
  baseballAnswer = generateBaseballAnswer();
  baseballAttempts = 0;
  baseballGameOver = false;
  document.getElementById('baseball-input').value = '';
  document.getElementById('baseball-history').innerHTML = `
    <div class="history-item header">
      <span>시도</span>
      <span>입력 숫자</span>
      <span>결과</span>
    </div>
  `;
}
baseballAnswer = generateBaseballAnswer();

function guessBaseball() {
  if (baseballGameOver) return;
  const inputEl = document.getElementById('baseball-input');
  const val = inputEl.value.trim();

  if (val.length !== 3 || isNaN(val)) {
    alert('3자리 숫자를 정확히 입력해 주세요!');
    return;
  }
  const guess = val.split('').map(Number);
  if (new Set(guess).size !== 3) {
    alert('중복되지 않는 3자리 숫자를 입력해 주세요!');
    return;
  }

  baseballAttempts++;
  let strikes = 0;
  let balls = 0;

  for (let i = 0; i < 3; i++) {
    if (guess[i] === baseballAnswer[i]) {
      strikes++;
    } else if (baseballAnswer.includes(guess[i])) {
      balls++;
    }
  }

  let resultHtml = '';
  if (strikes === 3) {
    resultHtml = `<strong class="strike">HOMERUN! 🎉 (${baseballAttempts}회 정답)</strong>`;
    baseballGameOver = true;
  } else if (strikes === 0 && balls === 0) {
    resultHtml = `<span class="out">OUT</span>`;
  } else {
    resultHtml = `${strikes > 0 ? `<span class="strike">${strikes}S </span>` : ''}${balls > 0 ? `<span class="ball">${balls}B</span>` : ''}`;
  }

  const historyEl = document.getElementById('baseball-history');
  const row = document.createElement('div');
  row.className = 'history-item';
  row.innerHTML = `
    <span>#${baseballAttempts}</span>
    <span><strong>${val}</strong></span>
    <span>${resultHtml}</span>
  `;
  historyEl.appendChild(row);
  historyEl.scrollTop = historyEl.scrollHeight;
  inputEl.value = '';
  inputEl.focus();
}

/* ========================================================
   GAME 3: 반응속도 테스트
======================================================== */
let reactionState = 'ready'; // ready -> waiting -> go
let reactionTimer = null;
let reactionStartTime = 0;

function handleReactionClick() {
  const box = document.getElementById('reaction-box');
  const text = box.querySelector('.reaction-text');

  if (reactionState === 'ready') {
    reactionState = 'waiting';
    box.className = 'reaction-screen wait';
    text.textContent = '초록색이 되면 즉시 클릭하세요!';

    const randomDelay = Math.floor(Math.random() * 2500) + 1500;
    reactionTimer = setTimeout(() => {
      reactionState = 'go';
      box.className = 'reaction-screen go';
      text.textContent = '지금 클릭하세요!!!';
      reactionStartTime = Date.now();
    }, randomDelay);

  } else if (reactionState === 'waiting') {
    clearTimeout(reactionTimer);
    reactionState = 'ready';
    box.className = 'reaction-screen ready';
    text.textContent = '너무 빨랐어요! (부정 출발) 다시 클릭하세요.';
  } else if (reactionState === 'go') {
    const elapsed = Date.now() - reactionStartTime;
    reactionState = 'ready';
    box.className = 'reaction-screen ready';
    text.textContent = `${elapsed} ms! 다시 도전하려면 클릭`;

    document.getElementById('reaction-time').textContent = `${elapsed} ms`;
    let tier = '⚡ 신의 반응속도 (상위 1%)';
    if (elapsed > 350) tier = '🐢 거북이 등급 (여유 만끽)';
    else if (elapsed > 280) tier = '🚶 보통 사람 (평균)';
    else if (elapsed > 220) tier = '🏃 상위 20% (빠른 반응)';
    else if (elapsed > 180) tier = '🐆 프로게이머급 (상위 5%)';
    document.getElementById('reaction-tier').textContent = tier;
  }
}

/* ========================================================
   GAME 4: 카드 뒤집기 기억력 게임
======================================================== */
const emojis = ['🍉', '🍕', '🍣', '🍦', '🍩', '🍔', '🍓', '🥑'];
let memoryCards = [];
let flippedCards = [];
let matchedCount = 0;
let movesCount = 0;
let memoryLock = false;

function initMemory() {
  const grid = document.getElementById('memory-grid');
  grid.innerHTML = '';
  memoryCards = [...emojis, ...emojis].sort(() => Math.random() - 0.5);
  flippedCards = [];
  matchedCount = 0;
  movesCount = 0;
  memoryLock = false;

  document.getElementById('memory-remaining').textContent = emojis.length;
  document.getElementById('memory-moves').textContent = 0;

  memoryCards.forEach((emoji, index) => {
    const card = document.createElement('div');
    card.className = 'memory-card';
    card.dataset.emoji = emoji;
    card.dataset.index = index;
    card.textContent = '❓';
    card.addEventListener('click', () => flipCard(card));
    grid.appendChild(card);
  });
}

function flipCard(card) {
  if (memoryLock || card.classList.contains('flipped') || card.classList.contains('matched')) return;

  card.classList.add('flipped');
  card.textContent = card.dataset.emoji;
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    movesCount++;
    document.getElementById('memory-moves').textContent = movesCount;
    memoryLock = true;

    const [c1, c2] = flippedCards;
    if (c1.dataset.emoji === c2.dataset.emoji) {
      c1.classList.add('matched');
      c2.classList.add('matched');
      matchedCount++;
      document.getElementById('memory-remaining').textContent = emojis.length - matchedCount;
      flippedCards = [];
      memoryLock = false;

      if (matchedCount === emojis.length) {
        setTimeout(() => alert(`🎉 축하합니다! ${movesCount}번 만에 모든 카드를 맞췄습니다!`), 300);
      }
    } else {
      setTimeout(() => {
        c1.classList.remove('flipped');
        c2.classList.remove('flipped');
        c1.textContent = '❓';
        c2.textContent = '❓';
        flippedCards = [];
        memoryLock = false;
      }, 700);
    }
  }
}

function resetMemory() {
  initMemory();
}

// Start memory on load
initMemory();
