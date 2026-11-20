import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const dir = 'C:/Users/sanat/fenix-web/WhatsApp Unknown 2026-11-18 at 9.14.38 AM';
const outDir = 'public/platos';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

async function createFoodImage(srcPath, extractRegion, targetName, options = {}) {
  const extractedBuf = await sharp(srcPath).extract(extractRegion).toBuffer();
  
  // Resize to 800x600 with clean dark background or fill
  const info = await sharp(extractedBuf)
    .resize(800, 600, {
      fit: options.fit || 'cover',
      position: options.position || 'center',
      background: { r: 12, g: 12, b: 14, alpha: 1 }
    })
    .webp({ quality: 92 })
    .toFile(path.join(outDir, targetName));

  console.log(`Saved: ${targetName} (${info.width}x${info.height}, ${(info.size/1024).toFixed(1)} KB)`);
}

async function extractAll() {
  const fBurgers = `${dir}/1.jpeg`;
  const fParr = `${dir}/WhatsApp Image 2026-11-18 at 8.59.37 AM.jpeg`;
  const fAlm = `${dir}/WhatsApp Image 2026-11-18 at 8.59.38 AM.jpeg`;

  // 1. Hero Burger (Triple Mixta / Búfalo King)
  await createFoodImage(fBurgers, { left: 35, top: 375, width: 320, height: 240 }, 'hamburguesa-hero.webp', { fit: 'cover' });

  // 2. Hamburguesa 2 (Pollo Crispy / Suprema / Churrasco)
  await createFoodImage(fBurgers, { left: 28, top: 675, width: 145, height: 160 }, 'hamburguesa-2.webp', { fit: 'contain' });

  // 3. Hamburguesa 3 (Croqueta de Carne / Lomo / Mixta)
  await createFoodImage(fBurgers, { left: 162, top: 742, width: 180, height: 155 }, 'hamburguesa-3.webp', { fit: 'contain' });

  // 4. Hamburguesa 4 (Keto / Combo Express)
  await createFoodImage(fBurgers, { left: 50, top: 915, width: 265, height: 195 }, 'hamburguesa-4.webp', { fit: 'cover' });

  // 5. Parrilla Personal
  await createFoodImage(fParr, { left: 0, top: 410, width: 260, height: 180 }, 'parrilla-personal.webp', { fit: 'cover' });

  // 6. Parrilla Dúo
  await createFoodImage(fParr, { left: 0, top: 585, width: 260, height: 165 }, 'parrilla-duo.webp', { fit: 'cover' });

  // 7. Parrilla Familiar
  await createFoodImage(fParr, { left: 0, top: 765, width: 260, height: 180 }, 'parrilla-familiar.webp', { fit: 'cover' });

  // 8. Almuerzo a la Parrilla
  await createFoodImage(fAlm, { left: 275, top: 410, width: 315, height: 255 }, 'almuerzo-parrilla.webp', { fit: 'cover' });

  console.log('Extraction complete!');
}

extractAll().catch(console.error);
