// Build public/favicon.ico by wrapping the existing PNG.
//
//   node tools/make-favicon-ico.mjs
//
// WHY THIS EXISTS. A browser asks for /favicon.ico whenever a page carries no
// <link rel="icon">, and three pages here deliberately carry none - the office
// made the layout faithful to sources that never had one. So every visit to
// /thanks/ fired a 404 in the console. Measured on the live site 23.8: 13
// same-origin requests, one failure, this one. It is pre-existing - the file
// has never been in this repo's history and the old hand-written /thanks/ had
// no icon link either - but it is one file to close.
//
// An .ico may CONTAIN a PNG rather than a BMP; every browser since Vista reads
// that, and it means no image library and no resampling - the 180x180 PNG the
// site already ships goes in whole.
//
// Format: a 6-byte ICONDIR, then one 16-byte ICONDIRENTRY, then the PNG.
// Width and height are written as 0 because the field is one byte and cannot
// hold 180 - zero is the documented "256 or larger, read it from the image".

import fs from 'node:fs';

const png = fs.readFileSync('public/apple-touch-icon.png');
if (png.readUInt32BE(0) !== 0x89504e47) {
  console.error('public/apple-touch-icon.png is not a PNG');
  process.exit(1);
}
const w = png.readUInt32BE(16);
const h = png.readUInt32BE(20);

const dir = Buffer.alloc(6);
dir.writeUInt16LE(0, 0);   // reserved
dir.writeUInt16LE(1, 2);   // 1 = icon
dir.writeUInt16LE(1, 4);   // one image in this file

const entry = Buffer.alloc(16);
entry.writeUInt8(w >= 256 ? 0 : w, 0);
entry.writeUInt8(h >= 256 ? 0 : h, 1);
entry.writeUInt8(0, 2);            // palette size, 0 for truecolour
entry.writeUInt8(0, 3);            // reserved
entry.writeUInt16LE(1, 4);         // colour planes
entry.writeUInt16LE(32, 6);        // bits per pixel
entry.writeUInt32LE(png.length, 8);
entry.writeUInt32LE(6 + 16, 12);   // the PNG starts right after the header

fs.writeFileSync('public/favicon.ico', Buffer.concat([dir, entry, png]));
console.log(`public/favicon.ico written - ${w}x${h} PNG inside an ICO, ${Buffer.concat([dir, entry, png]).length} bytes`);
