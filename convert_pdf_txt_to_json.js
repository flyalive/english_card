const fs = require('fs');

const lines = fs.readFileSync('data_from_pdf.txt', 'utf8').split(/\r?\n/);
const result = [];

let word = null;
let pos = null;
let meaning = null;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  // 단어(영어)만 있는 줄
  if (/^[a-zA-Z\-()]+$/.test(line)) {
    word = line;
    // 다음 줄이 품사+뜻인지 확인
    const next = (lines[i+1] || '').trim();
    const match = next.match(/^〔(.+?)〕\s*(.+)$/);
    if (match) {
      pos = match[1].replace(/\s/g, '');
      meaning = match[2].trim();
      result.push({ word, pos, meaning });
      i++; // 뜻 줄은 건너뜀
    }
  } else if (/^[a-zA-Z\-()]+\s+〔(.+?)〕\s*(.+)$/.test(line)) {
    // 단어와 품사+뜻이 한 줄에 같이 있는 경우
    const match = line.match(/^([a-zA-Z\-()]+)\s+〔(.+?)〕\s*(.+)$/);
    if (match) {
      word = match[1];
      pos = match[2].replace(/\s/g, '');
      meaning = match[3].trim();
      result.push({ word, pos, meaning });
    }
  }
}

fs.writeFileSync('words.json', JSON.stringify(result, null, 2), 'utf8');
console.log('변환 완료: words.json'); 