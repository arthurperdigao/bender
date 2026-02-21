/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const https = require('https');
const path = require('path');

const images = [
    { url: 'https://media.tenor.com/h2M4vS5DhhgAAAAC/avatar-the-last-airbender-water-tribe.gif', filename: 'water.gif' },
    { url: 'https://media.tenor.com/b5U0UjE1p2UAAAAC/avatar-earth.gif', filename: 'earth.gif' },
    { url: 'https://media.tenor.com/fU7yU284u9kAAAAC/avatar-the-last-airbender-fire.gif', filename: 'fire.gif' },
    { url: 'https://media.tenor.com/g9P-rGk09iYAAAAd/avatar-the-last-airbender-aang.gif', filename: 'air.gif' },
    { url: 'https://media3.giphy.com/media/GbUrFXadBrymY/giphy.gif', filename: 'hero.gif' },
    { url: 'https://media.tenor.com/A6jA9gR3_KMAAAAC/avatar-state-aang.gif', filename: 'quiz.gif' },
    { url: 'https://media.tenor.com/z0H5TIsC0CMAAAAd/avatar-the-last-airbender-iroh.gif', filename: 'pai-sho.gif' },
    { url: 'https://media.tenor.com/HnUj_L8vQxEAAAAd/avatar-the-last-airbender-ang.gif', filename: 'bending.gif' },
    { url: 'https://media.tenor.com/5lR5N5rP2sQAAAAC/wan-shi-tong-library.gif', filename: 'trivia.gif' }
];

const download = (url, dest) => {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (response) => {
            // Handle redirects
            if (response.statusCode === 301 || response.statusCode === 302) {
                download(response.headers.location, dest).then(resolve).catch(reject);
                return;
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close(resolve);
            });
        }).on('error', (err) => {
            fs.unlink(dest, () => { });
            reject(err.message);
        });
    });
};

const dir = path.join(__dirname, 'public', 'assets');
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

async function run() {
    for (const img of images) {
        console.log(`Downloading ${img.filename}...`);
        try {
            await download(img.url, path.join(dir, img.filename));
            console.log(`Success: ${img.filename}`);
        } catch (e) {
            console.log(`Failed: ${img.filename} - ${e}`);
        }
    }
}
run();
