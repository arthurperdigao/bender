const fs = require('fs');
const path = require('path');
const https = require('https');

/**
 * Script para baixar HQs para o servidor local.
 * Uso: node scripts/download_comics.js
 */

const comicsToDownload = [
  {
    name: 'a-cacadora-de-recompensas',
    urls: [
      'https://comics.mundoavatar.com.br/wp-content/uploads/2024/03/03_01-1.jpg',
      'https://comics.mundoavatar.com.br/wp-content/uploads/2024/03/03_02-1.jpg',
      // Adicione todas as URLs aqui
    ]
  }
];

async function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
}

async function start() {
  for (const comic of comicsToDownload) {
    const dir = path.join(__dirname, '..', 'public', 'comics', comic.name);
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }

    console.log(`Baixando ${comic.name}...`);
    for (let i = 0; i < comic.urls.length; i++) {
        const url = comic.urls[i];
        const ext = path.extname(url);
        const fileName = `${String(i + 1).padStart(3, '0')}${ext}`;
        const dest = path.join(dir, fileName);
        
        await downloadImage(url, dest);
        console.log(`[${i+1}/${comic.urls.length}] ${fileName} OK`);
    }
  }
  console.log('Download concluído!');
}

// start(); // Descomente para rodar
console.log('Script pronto. Para rodar, descomente a linha "start()" no arquivo.');
