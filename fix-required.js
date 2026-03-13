const fs = require('fs');
const path = require('path');

const jobsDir = path.join(__dirname, 'jobs');

if (!fs.existsSync(jobsDir)) {
    console.error('Jobs directory not found');
    process.exit(1);
}

const files = fs.readdirSync(jobsDir).filter(f => f.endsWith('.html'));
let fixedCount = 0;

for (const file of files) {
    const filePath = path.join(jobsDir, file);
    let content = fs.readFileSync(filePath, 'utf-8');

    // Make arbeitssuchend required again
    content = content.replace(
        /<label>Sind Sie aktuell arbeitssuchend gemeldet\?<\/label>/g,
        '<label>Sind Sie aktuell arbeitssuchend gemeldet? *</label>'
    );

    // Replace the specific radio buttons to add 'required'
    content = content.replace(
        /<input type="radio" name="arbeitssuchend" value="ja"\s*onchange="toggleAgentur\(true\)"> Ja/g,
        '<input type="radio" name="arbeitssuchend" value="ja" required\n                                onchange="toggleAgentur(true)"> Ja'
    );

    content = content.replace(
        /<input type="radio" name="arbeitssuchend" value="nein" onchange="toggleAgentur\(false\)"> Nein/g,
        '<input type="radio" name="arbeitssuchend" value="nein" required onchange="toggleAgentur(false)"> Nein'
    );

    fs.writeFileSync(filePath, content, 'utf-8');
    fixedCount++;
}

console.log(`Successfully made 'arbeitssuchend' required in ${fixedCount} job files.`);
