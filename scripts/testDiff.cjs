const XLSX = require('xlsx');
const fs = require('fs');

const normalize = (s) => {
  let str = s
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9 ]/gi, '')
    .toLowerCase();
  // cleanup common encoding corruption
  str = str.replace(/[\u00c2\u00e2\u00c3\u00e3\u00c7\u00e7\u00d1\u00f1]+/g, '');
  str = str.replace(/\s+/g, ' ').trim();
  return str;
};

const lev = (a, b) => {
  const dp = [];
  for (let i = 0; i <= a.length; i++) {
    dp[i] = [i];
  }
  for (let j = 0; j <= b.length; j++) {
    dp[0][j] = j;
  }
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
  }
  return dp[a.length][b.length];
};

const findCol = (headers, keywords) => {
  for (const h of headers) {
    const nh = normalize(h);
    if (
      keywords.some((k) => {
        const nk = normalize(k);
        return nk.split(' ').every((w) => nh.includes(w));
      })
    ) {
      return h;
    }
  }
  for (const h of headers) {
    const nh = normalize(h).replace(/\s+/g, '');
    for (const k of keywords) {
      const nk = normalize(k).replace(/\s+/g, '');
      if (lev(nh, nk) <= 1) {
        return h;
      }
    }
  }
  return undefined;
};

const parseValor = (v) => {
  if (v === "" || v === null || v === undefined || v === "-") return null;
  const original = String(v).replace(/[R$\s]/g, '');
  const s = original.replace(',', '.');
  let n = parseFloat(s);
  if (isNaN(n)) return null;
  // if original string has no decimal separator and is a positive integer
  if (!original.includes('.') && !original.includes(',') && Number.isInteger(n) && n > 0) {
    // 3-digit values: divide by 10 (décimos de real)
    if (original.length === 3) {
      n = n / 10;
    } else if (original.length >= 4) {
      // 4+ digit values: divide by 100 (centavos)
      n = n / 100;
    }
  }
  return n;
};

const parseFile = (f) => {
  const buf = fs.readFileSync(f);
  // Try to read as Latin-1 first, then fall back to buffer
  const str = buf.toString('latin1');
  const ws = XLSX.read(str, { type: 'string' });
  return XLSX.utils.sheet_to_json(ws.Sheets[ws.SheetNames[0]], { defval: '' });
};

const said = parseFile('c:/Users/Marci/Downloads/saída.csv');
const cup = parseFile('c:/Users/Marci/Downloads/Cupons.csv');
console.log('rows', said.length, cup.length);
const sH = Object.keys(said[0] || {});
const cH = Object.keys(cup[0] || {});
console.log('headers', sH, cH);
const sNumCol = findCol(sH, [
  'numero',
  'num',
  'cupom',
]);
const cNumCol = findCol(cH, ['cupom', 'numero', 'num']);
console.log('detected num cols', sNumCol, cNumCol);
const sValCol = findCol(sH, ['valor', 'valor venda', 'total', 'vlr', 'value']);
const cValCol = findCol(cH, ['valor', 'valor venda', 'total', 'vlr', 'value']);
console.log('value cols', sValCol, cValCol);

const saidasMap = new Map();
for (const r of said) {
  const key = String(r[sNumCol]).trim();
  if (key) saidasMap.set(key, r);
}
const cuponsMap = new Map();
for (const r of cup) {
  const key = String(r[cNumCol]).trim();
  if (key) cuponsMap.set(key, r);
}

const diffs = [];
for (const [num, cr] of cuponsMap) {
  const sr = saidasMap.get(num);
  const cVal = cValCol ? cr[cValCol] : undefined;
  const cValNum = parseValor(cVal);
  if (!sr) {
    diffs.push({ num, typ: 'cupom_sem_saida', cVal });
  } else {
    const sVal = sValCol ? sr[sValCol] : undefined;
    const sValNum = parseValor(sVal);
    if (cValNum === null && sValNum !== null) {
      diffs.push({ num, typ: 'cupom_sem_valor' });
    } else if (sValNum === null && cValNum !== null) {
      diffs.push({ num, typ: 'saida_sem_valor' });
    } else if (cValNum !== null && sValNum !== null && Math.abs(cValNum - sValNum) > 0.01) {
      diffs.push({ num, typ: 'valor_diferente', cVal, sVal });
    }
  }
}
for (const [num, sr] of saidasMap) {
  if (!cuponsMap.has(num)) {
    diffs.push({ num, typ: 'saida_sem_cupom' });
  }
}
console.log('differences count', diffs.length);
console.log(diffs.slice(0, 10));
