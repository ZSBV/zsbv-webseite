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

    // Make telefon optional
    content = content.replace(
        /<label>Telefonnummer \*<\/label>\s*<input type="tel" name="telefon" required placeholder="0170 1234567">/g,
        '<label>Telefonnummer</label>\n                        <input type="tel" name="telefon" placeholder="0170 1234567">'
    );

    // Make arbeitssuchend optional
    content = content.replace(
        /<label>Sind Sie aktuell arbeitssuchend gemeldet\? \*<\/label>/g,
        '<label>Sind Sie aktuell arbeitssuchend gemeldet?</label>'
    );
    
    content = content.replace(
        /<input type="radio" name="arbeitssuchend" value="ja" required/g,
        '<input type="radio" name="arbeitssuchend" value="ja"'
    );

    // Update privacy statement / remove checkbox
    const regexPrivacy = /<label class="checkbox-label">\s*<input type="checkbox" name="datenschutz" required>\s*Ich habe die <a href="\.\.\/datenschutz\.html" target="_blank">Datenschutzerkl&#228;rung<\/a> gelesen\s*und stimme der Verarbeitung meiner Daten im Rahmen des Bewerbungsverfahrens zu\. \*\s*<\/label>/g;

    const newPrivacyText = `<p style="font-size:12px;color:#8a9ab5;line-height:1.5;margin-bottom:10px;">
                        * Die &Uuml;bermittlung Ihrer Daten erfolgt verschl&uuml;sselt. Details zur Verarbeitung Ihrer Bewerberdaten gem. &sect; 26 BDSG finden Sie in unserer <a href="../datenschutz.html" target="_blank" style="color:var(--gold);text-decoration:underline;">Datenschutzerkl&auml;rung</a>.
                    </p>`;

    content = content.replace(regexPrivacy, newPrivacyText);

    fs.writeFileSync(filePath, content, 'utf-8');
    fixedCount++;
}

console.log(`Successfully fixed ${fixedCount} job files.`);
