import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

// Table for fast CRC32 computation
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function createChunk(type, data) {
  const typeBuf = Buffer.from(type);
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);

  const crcBuf = Buffer.alloc(4);
  const typeAndData = Buffer.concat([typeBuf, data]);
  crcBuf.writeUInt32BE(crc32(typeAndData), 0);

  return Buffer.concat([lenBuf, typeAndData, crcBuf]);
}

function encodePNG(width, height, rgbaBuffer) {
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData.writeUInt8(8, 8); // 8 bits per channel
  ihdrData.writeUInt8(6, 9); // RGBA
  ihdrData.writeUInt8(0, 10); // Deflate
  ihdrData.writeUInt8(0, 11); // Filter 0
  ihdrData.writeUInt8(0, 12); // No interlace
  const ihdrChunk = createChunk('IHDR', ihdrData);

  // Scanlines with filter byte 0
  const scanlines = Buffer.alloc(height * (width * 4 + 1));
  let srcOffset = 0;
  let dstOffset = 0;
  for (let y = 0; y < height; y++) {
    scanlines[dstOffset++] = 0; // Filter 0
    rgbaBuffer.copy(scanlines, dstOffset, srcOffset, srcOffset + width * 4);
    dstOffset += width * 4;
    srcOffset += width * 4;
  }

  const compressedData = zlib.deflateSync(scanlines, { level: 9 });
  const idatChunk = createChunk('IDAT', compressedData);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// Function to draw game icon
function renderGameIcon(size) {
  const buf = Buffer.alloc(size * size * 4);

  const setPixel = (x, y, r, g, b, a = 255) => {
    if (x < 0 || x >= size || y < 0 || y >= size) return;
    const idx = (y * size + x) * 4;
    if (a === 255) {
      buf[idx] = r;
      buf[idx + 1] = g;
      buf[idx + 2] = b;
      buf[idx + 3] = 255;
    } else {
      const srcA = a / 255;
      const dstA = buf[idx + 3] / 255;
      const outA = srcA + dstA * (1 - srcA);
      if (outA > 0) {
        buf[idx] = Math.round((r * srcA + buf[idx] * dstA * (1 - srcA)) / outA);
        buf[idx + 1] = Math.round((g * srcA + buf[idx + 1] * dstA * (1 - srcA)) / outA);
        buf[idx + 2] = Math.round((b * srcA + buf[idx + 2] * dstA * (1 - srcA)) / outA);
        buf[idx + 3] = Math.round(outA * 255);
      }
    }
  };

  const cornerRadius = size * 0.24;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      // Rounded rectangle test
      let dx = 0;
      let dy = 0;
      if (x < cornerRadius) dx = cornerRadius - x;
      else if (x > size - 1 - cornerRadius) dx = x - (size - 1 - cornerRadius);

      if (y < cornerRadius) dy = cornerRadius - y;
      else if (y > size - 1 - cornerRadius) dy = y - (size - 1 - cornerRadius);

      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist <= cornerRadius) {
        // Gradient from amber-400 (#fbbf24) to orange-500 (#f59e0b) to amber-600 (#d97706)
        const factor = (x + y) / (size * 2);
        const r = Math.round(251 + factor * (217 - 251));
        const g = Math.round(191 + factor * (119 - 191));
        const b = Math.round(36 + factor * (6 - 36));

        // Anti-aliasing at border
        const alpha = dist > cornerRadius - 1 ? Math.round((cornerRadius - dist) * 255) : 255;
        setPixel(x, y, r, g, b, alpha);
      }
    }
  }

  // Draw Gamepad Base (Oval/Controller shape in White / Light Gray)
  const padCenterX = size * 0.5;
  const padCenterY = size * 0.6;
  const padRadiusX = size * 0.36;
  const padRadiusY = size * 0.2;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const nx = (x - padCenterX) / padRadiusX;
      const ny = (y - padCenterY) / padRadiusY;
      const d = nx * nx + ny * ny;

      // Handle handles of gamepad
      const leftHandleX = padCenterX - padRadiusX * 0.65;
      const rightHandleX = padCenterX + padRadiusX * 0.65;
      const handleY = padCenterY + padRadiusY * 0.35;
      const handleR = size * 0.17;

      const dLeft = Math.hypot(x - leftHandleX, y - handleY) / handleR;
      const dRight = Math.hypot(x - rightHandleX, y - handleY) / handleR;

      if (d <= 1.0 || dLeft <= 1.0 || dRight <= 1.0) {
        // Shadow underneath
        setPixel(x, y + Math.round(size * 0.02), 120, 53, 15, 60);
      }
    }
  }

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const nx = (x - padCenterX) / padRadiusX;
      const ny = (y - padCenterY) / padRadiusY;
      const d = nx * nx + ny * ny;

      const leftHandleX = padCenterX - padRadiusX * 0.65;
      const rightHandleX = padCenterX + padRadiusX * 0.65;
      const handleY = padCenterY + padRadiusY * 0.35;
      const handleR = size * 0.17;

      const dLeft = Math.hypot(x - leftHandleX, y - handleY) / handleR;
      const dRight = Math.hypot(x - rightHandleX, y - handleY) / handleR;

      if (d <= 1.0 || dLeft <= 1.0 || dRight <= 1.0) {
        // Clean white gamepad body
        setPixel(x, y, 255, 255, 255, 255);
      }
    }
  }

  // Draw D-pad on Left (Indigo #6366f1)
  const dpadX = Math.round(padCenterX - padRadiusX * 0.48);
  const dpadY = Math.round(padCenterY);
  const armLen = Math.max(2, Math.round(size * 0.08));
  const armW = Math.max(2, Math.round(size * 0.035));

  for (let y = dpadY - armLen; y <= dpadY + armLen; y++) {
    for (let x = dpadX - armW; x <= dpadX + armW; x++) {
      setPixel(x, y, 99, 102, 241, 255);
    }
  }
  for (let y = dpadY - armW; y <= dpadY + armW; y++) {
    for (let x = dpadX - armLen; x <= dpadX + armLen; x++) {
      setPixel(x, y, 99, 102, 241, 255);
    }
  }

  // Draw 4 colorful Action Buttons on Right
  const btnCenterX = Math.round(padCenterX + padRadiusX * 0.48);
  const btnCenterY = Math.round(padCenterY);
  const btnDist = Math.round(size * 0.055);
  const btnR = Math.max(2, Math.round(size * 0.03));

  const drawCircle = (cx, cy, r, red, green, blue) => {
    for (let y = cy - r; y <= cy + r; y++) {
      for (let x = cx - r; x <= cx + r; x++) {
        if (Math.hypot(x - cx, y - cy) <= r) {
          setPixel(x, y, red, green, blue, 255);
        }
      }
    }
  };

  drawCircle(btnCenterX, btnCenterY - btnDist, btnR, 239, 68, 68); // Red
  drawCircle(btnCenterX - btnDist, btnCenterY, btnR, 59, 130, 246); // Blue
  drawCircle(btnCenterX + btnDist, btnCenterY, btnR, 16, 185, 129); // Green
  drawCircle(btnCenterX, btnCenterY + btnDist, btnR, 245, 158, 11); // Yellow

  // Draw Cute Star at Top Right
  const starX = Math.round(size * 0.72);
  const starY = Math.round(size * 0.22);
  const starR = Math.round(size * 0.1);

  for (let y = starY - starR; y <= starY + starR; y++) {
    for (let x = starX - starR; x <= starX + starR; x++) {
      const dist = Math.hypot(x - starX, y - starY);
      if (dist <= starR * 0.7) {
        setPixel(x, y, 254, 240, 138, 255);
      }
    }
  }

  return buf;
}

// Generate files
const outDir = path.resolve('public');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// 512x512
const buf512 = renderGameIcon(512);
const png512 = encodePNG(512, 512, buf512);
fs.writeFileSync(path.join(outDir, 'icon-512.png'), png512);
console.log('Created icon-512.png');

// 192x192
const buf192 = renderGameIcon(192);
const png192 = encodePNG(192, 192, buf192);
fs.writeFileSync(path.join(outDir, 'icon-192.png'), png192);
console.log('Created icon-192.png');

// 48x48 for favicon.ico
const buf48 = renderGameIcon(48);
const png48 = encodePNG(48, 48, buf48);

// Create ICO containing the 48x48 PNG
const icoHeader = Buffer.from([0, 0, 1, 0, 1, 0]); // 1 image
const icoDir = Buffer.alloc(16);
icoDir.writeUInt8(48, 0); // width
icoDir.writeUInt8(48, 1); // height
icoDir.writeUInt8(0, 2); // colors
icoDir.writeUInt8(0, 3); // reserved
icoDir.writeUInt16LE(1, 4); // color planes
icoDir.writeUInt16LE(32, 6); // bpp
icoDir.writeUInt32LE(png48.length, 8); // image size
icoDir.writeUInt32LE(22, 12); // image offset (6 + 16 = 22)

const icoBuf = Buffer.concat([icoHeader, icoDir, png48]);
fs.writeFileSync(path.join(outDir, 'favicon.ico'), icoBuf);
console.log('Created favicon.ico');
