import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sizes = [192, 512];
const publicDir = path.join(__dirname, '../public');

// Ensure public directory exists
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generate PWA icons
async function generateIcons() {
  try {
    // Create a simple icon with text (you can replace this with your actual icon)
    const svg = `
      <svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
        <rect width="512" height="512" fill="#ffffff"/>
        <text x="256" y="256" font-family="Arial" font-size="120" text-anchor="middle" dominant-baseline="middle" fill="#000000">🏋️</text>
      </svg>
    `;

    // Generate icons for each size
    for (const size of sizes) {
      await sharp(Buffer.from(svg))
        .resize(size, size)
        .png()
        .toFile(path.join(publicDir, `pwa-${size}x${size}.png`));
      console.log(`Generated pwa-${size}x${size}.png`);
    }

    // Generate apple touch icon
    await sharp(Buffer.from(svg))
      .resize(180, 180)
      .png()
      .toFile(path.join(publicDir, 'apple-touch-icon.png'));
    console.log('Generated apple-touch-icon.png');

    // Generate favicon
    await sharp(Buffer.from(svg))
      .resize(32, 32)
      .png()
      .toFile(path.join(publicDir, 'favicon.ico'));
    console.log('Generated favicon.ico');

    console.log('All icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
    process.exit(1);
  }
}

generateIcons(); 