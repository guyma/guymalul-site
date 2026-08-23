// Compare one meta value between a source page and its built output, raw.
// Used to explain a difference the proof harness reports rather than wave it through.
import fs from 'node:fs';

const [fileA, fileB, key] = process.argv.slice(2);

const get = (f, k) => {
  const s = fs.readFileSync(f, 'utf8');
  const re = new RegExp('<meta name="' + k + '" content=(["\'])([^]*?)\\1', 'i');
  const m = s.match(re);
  return m ? m[2] : null;
};

const a = get(fileA, key);
const b = get(fileB, key);
console.log('  ' + fileA);
console.log('    ' + JSON.stringify(a));
console.log('  ' + fileB);
console.log('    ' + JSON.stringify(b));
console.log('  identical raw: ' + (a === b));
