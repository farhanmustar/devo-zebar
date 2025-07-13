import fs from 'fs';
import path from 'path';
import https from 'https';

const baseDir = path.resolve('public', 'nerdfonts');
const cssDir = path.join(baseDir, 'css');
const fontsDir = path.join(baseDir, 'fonts');
const cssFileUrl = 'https://www.nerdfonts.com/assets/css/webfont.css';
const fontFileUrl =
  'https://www.nerdfonts.com/assets/fonts/Symbols-2048-em%20Nerd%20Font%20Complete.woff2';

const downloadFile = (url, filePath) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filePath);
    https
      .get(url, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
        }
        response.pipe(file);
        file.on('finish', () => {
          file.close(resolve);
        });
      })
      .on('error', (err) => {
        fs.unlink(filePath, () => {}); // Delete the file if there's an error
        reject(err);
      });
  });
};

const main = async () => {
  try {
    fs.mkdirSync(cssDir, { recursive: true });
    fs.mkdirSync(fontsDir, { recursive: true });

    console.log(`Created directories: ${cssDir} and ${fontsDir}`);

    // Download CSS file
    const cssFilePath = path.join(cssDir, 'webfont.css');
    await downloadFile(cssFileUrl, cssFilePath);
    console.log(`Downloaded: ${cssFilePath}`);

    // Download font file
    const fontFilePath = path.join(fontsDir, 'Symbols-2048-em Nerd Font Complete.woff2');
    await downloadFile(fontFileUrl, fontFilePath);
    console.log(`Downloaded: ${fontFilePath}`);
  } catch (error) {
    console.error('Error:', error.message);
  }
};

main();
