console.log('English Card loaded!'); 

let words = [];

fetch('words.json')
  .then(res => res.json())
  .then(data => {
    words = data;
    resetStats();
    renderCardArea();
  });

let current = 0;
let flipped = false;

const card = document.querySelector('.card');
const wordSpan = document.querySelector('.card .word');
const posSpan = document.querySelector('.card .pos');
const flipBtn = document.getElementById('flip-btn');
const nextBtn = document.getElementById('next-btn');
const progress = document.querySelector('.progress-bar .progress');
const progressText = document.querySelector('.progress-bar .progress-text');

const modeBtns = document.querySelectorAll('.mode-select button');
const cardArea = document.querySelector('.card-area');
let mode = '학습'; // '학습', '퀴즈', '랜덤'

// 통계 관련 변수
let learnedCount = 0;
let correctCount = 0;
let totalQuiz = 0;
let streak = 0;
let lastCorrect = false;
let learnedSet = new Set();

const learnedSpan = document.getElementById('learned');
const accuracySpan = document.getElementById('accuracy');
const streakSpan = document.getElementById('streak');

function showCard(idx) {
  const { word, pos, meaning } = words[idx];
  if (flipped) {
    wordSpan.textContent = meaning;
    posSpan.textContent = '';
  } else {
    wordSpan.textContent = word;
    posSpan.textContent = pos;
  }
  // 진행바 업데이트
  const percent = ((idx + 1) / words.length) * 100;
  progress.style.width = percent + '%';
  progressText.textContent = `${idx + 1} / ${words.length} 단어`;
}

function setMode(newMode) {
  mode = newMode;
  modeBtns.forEach(btn => {
    btn.classList.toggle('active', btn.textContent === newMode + ' 모드');
  });
  resetStats();
  renderCardArea();
}

function updateStats() {
  learnedSpan.textContent = learnedSet.size;
  accuracySpan.textContent = totalQuiz > 0 ? Math.round((correctCount / totalQuiz) * 100) + '%' : '0%';
  streakSpan.textContent = streak;
}

function markLearned(idx) {
  learnedSet.add(idx);
  updateStats();
}

function resetStats() {
  learnedSet.clear();
  learnedCount = 0;
  correctCount = 0;
  totalQuiz = 0;
  streak = 0;
  lastCorrect = false;
  updateStats();
}

function renderCardArea() {
  cardArea.innerHTML = '';
  const wordObj = words[current];
  if (!wordObj) return;

  if (!flipped) {
    // 앞면: 영어/품사, '카드 뒤집기' + '다음 단어' 버튼
    cardArea.innerHTML = `
      <div class="card">
        <span class="word">${wordObj.word}</span>
        <span class="pos">${wordObj.pos}</span>
      </div>
      <div class="card-buttons">
        <button id="flip-btn">카드 뒤집기</button>
        <button id="next-btn">다음 단어</button>
      </div>
    `;
    document.getElementById('flip-btn').addEventListener('click', () => {
      flipped = true;
      renderCardArea();
    });
    document.getElementById('next-btn').addEventListener('click', () => {
      current = (current + 1) % words.length;
      flipped = false;
      renderCardArea();
    });
  } else {
    // 뒷면: 뜻, '카드 뒤집기' + '다음 단어' 버튼
    let meanings = wordObj.meaning.split(/[ ,·]/).filter(Boolean);
    cardArea.innerHTML = `
      <div class="card">
        <span class="meaning" style="font-size:1.5rem; color:#fff;">${meanings.map(m=>`<span class='meaning-chip'>${m}</span>`).join(' ')}</span>
      </div>
      <div class="card-buttons">
        <button id="flip-btn">카드 뒤집기</button>
        <button id="next-btn">다음 단어</button>
      </div>
    `;
    document.getElementById('flip-btn').addEventListener('click', () => {
      flipped = false;
      renderCardArea();
    });
    document.getElementById('next-btn').addEventListener('click', () => {
      current = (current + 1) % words.length;
      flipped = false;
      renderCardArea();
    });
  }
}

modeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const text = btn.textContent.replace(' 모드', '');
    setMode(text);
  });
});

// 최초 렌더링
resetStats();
renderCardArea(); 