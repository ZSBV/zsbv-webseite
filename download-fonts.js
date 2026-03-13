const fs = require('fs');
const https = require('https');
const path = require('path');

const cssUrl = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Outfit:wght@400;500;600;700;800;900&display=swap';

// we need to mimic a modern browser so Google returns woff2 format
const options = {
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
};

https.get(cssUrl, options, (res) => {
    let css = '';
    res.on('data', d => css += d);
    res.on('end', () => {
        const urlRegex = /url\((https:\/\/[^)]+)\)/g;
        let match;
        const fontDir = path.join(__dirname, 'fonts');
        if (!fs.existsSync(fontDir)) fs.mkdirSync(fontDir);

        let localCss = css;
        const downloads = [];
        let i = 0;

        while ((match = urlRegex.exec(css)) !== null) {
            const fontUrl = match[1];
            // to ensure unique filenames for different font weights, append index
            const origFileName = path.basename(new URL(fontUrl).pathname);
            const fileName = `font-${i++}-${origFileName}`;

            localCss = localCss.replace(fontUrl, `./fonts/${fileName}`);

            downloads.push(new Promise((resolve) => {
                https.get(fontUrl, (fontRes) => {
                    const file = fs.createWriteStream(path.join(fontDir, fileName));
                    fontRes.pipe(file);
                    file.on('finish', () => resolve());
                });
            }));
        }

        Promise.all(downloads).then(() => {
            fs.writeFileSync(path.join(__dirname, 'local-fonts.css'), localCss);
            console.log('Fonts downloaded successfully and local-fonts.css generated!');
        });
    });
});
