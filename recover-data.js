const fs = require('fs');
const path = require('path');

// 1. Recover Jobs
const jobTemplates = [
    { title: 'Wachschutzmitarbeiter (m/w/d)', badge: 'Quereinsteiger', badgeClass: '', salaryMin: 2620, salaryMax: 2850, aufgaben: 'Objekt- & Werkschutz; Kontrollrundgänge; Dokumentation; Alarmverfolgung', anforderungen: 'Zuverlässigkeit; Deutsch-Grundkenntnisse; Einwandfreies Führungszeugnis', vorteile: 'Kostenlose Qualifizierung; Unbefristeter Arbeitsvertrag; Job-Garantie', beschreibung: 'Sichern Sie Objekte und Werksgelände ab. Wir bilden Sie kostenlos aus.', seoDescription: 'Job als Wachschutzmitarbeiter in {{LOCATION}}. Jetzt bewerben!' },
    { title: 'Sicherheitsmitarbeiter (m/w/d)', badge: 'Quereinsteiger', badgeClass: '', salaryMin: 2620, salaryMax: 2850, aufgaben: 'Zutrittskontrolle & Empfang; Objekt- & Werkschutz; Kontrollrundgänge & Dokumentation; Alarmverfolgung & Intervention', anforderungen: 'Kein Vorwissen erforderlich; §34a Qualifizierung inklusive; Deutsch mind. B1; Einwandfreies Führungszeugnis', vorteile: 'Kostenlose §34a Qualifizierung; Unbefristeter Arbeitsvertrag; Bildungsgutschein möglich; Vermittlung nach Kursabschluss', beschreibung: 'Starten Sie Ihre Karriere in der Sicherheitsbranche – Quereinsteiger willkommen! Über die ZSBV erhalten Sie eine kostenlose Qualifizierung inkl. §34a Sachkundeprüfung und anschließender Arbeitsplatzvermittlung.', seoDescription: 'Gesucht: Sicherheitsmitarbeiter (m/w/d) in {{LOCATION}}. Starten Sie mit unserer kostenlosen §34a Schulung inkl. direkter Vermittlung. Auch für Quereinsteiger!' },
    { title: 'ÖPNV-Sicherheitskraft (m/w/d)', badge: 'Quereinsteiger', badgeClass: '', salaryMin: 2850, salaryMax: 3200, aufgaben: 'Sreife in Bussen und Bahnen; Deeskalation; Fahrgastbetreuung', anforderungen: 'Sachkunde §34a; Belastbarkeit; Schichtbereitschaft', vorteile: 'Höheres Gehalt; Zuschläge; Sicherer Arbeitsplatz', beschreibung: 'Sorgen Sie für Sicherheit im öffentlichen Nahverkehr.', seoDescription: 'ÖPNV-Sicherheitskraft in {{LOCATION}} gesucht. Jetzt informieren!' },
    { title: 'Geld- & Werttransportfahrer/-in (m/w/d)', badge: 'Quereinsteiger', badgeClass: '', salaryMin: 3200, salaryMax: 3800, aufgaben: 'Sicherer Transport von Werten; Dokumentation; Teamarbeit', anforderungen: 'Waffensachkunde; Führerschein Kl. B; Zuverlässigkeit', vorteile: 'Top Gehalt; Spezialausbildung; Verantwortung', beschreibung: 'Fahren Sie Werttransporte in gepanzerten Fahrzeugen.', seoDescription: 'Job im Geld- und Werttransport in {{LOCATION}}. Werden Sie Teil des Teams!' },
    { title: 'Revierwachmann/-frau (m/w/d)', badge: 'Quereinsteiger', badgeClass: '', salaryMin: 2770, salaryMax: 3030, aufgaben: 'Revierfahrten; Verschlusskontrollen; Alarmverfolgung', anforderungen: 'Führerschein; §34a Sachkunde; Pünktlichkeit', vorteile: 'Dienstwagen; Eigenverantwortung; Abwechslung', beschreibung: 'Fahren Sie Reviere ab und sichern Sie Kundenobjekte.', seoDescription: 'Revierwachmann in {{LOCATION}} werden. Jetzt bewerben!' },
    { title: 'Empfangskraft Sicherheit (m/w/d)', badge: 'Quereinsteiger', badgeClass: '', salaryMin: 2680, salaryMax: 3100, aufgaben: 'Telefondienst; Besuchermanagement; Schlüsselausgabe', anforderungen: 'Gepflegtes Auftreten; Deutsch fließend; Zuverlässigkeit', vorteile: 'Geregelte Arbeitszeiten; Moderner Arbeitsplatz; Langfristigkeit', beschreibung: 'Repräsentieren Sie unsere Kunden am Empfang.', seoDescription: 'Sicherheits-Empfangskraft in {{LOCATION}} gesucht. Attraktive Bedingungen!' },
    { title: 'Veranstaltungsschutz (m/w/d)', badge: 'Quereinsteiger', badgeClass: '', salaryMin: 2500, salaryMax: 2770, aufgaben: 'Einlasskontrolle; Ordnungstätigkeiten; VIP-Betreuung', anforderungen: 'Teamfähigkeit; Belastbarkeit; Freundliches Auftreten', vorteile: 'Flexible Zeiten; Spannende Events; Nettes Team', beschreibung: 'Sichern Sie Konzerte und Messen ab.', seoDescription: 'Arbeiten im Veranstaltungsschutz in {{LOCATION}}. Sei dabei!' },
    { title: 'Objektschutzmitarbeiter (m/w/d)', badge: 'Quereinsteiger', badgeClass: '', salaryMin: 2620, salaryMax: 2850, aufgaben: 'Objektüberwachung; Zutrittskontrolle; Dokumentation', anforderungen: 'Sachkunde §34a; Deutschkenntnisse; Zuverlässigkeit', vorteile: 'Sicherer Job; Nachtzuschläge; Kurze Wege', beschreibung: 'Sichern Sie Gewerbe- und Industrieobjekte.', seoDescription: 'Objektschutz-Jobs in {{LOCATION}}. Quereinstieg möglich!' },
    { title: 'Personenschützer/-in (m/w/d)', badge: 'Quereinsteiger', badgeClass: '', salaryMin: 3200, salaryMax: 3800, aufgaben: 'Begleitschutz; Gefahrenanalyse; Voraufklärung', anforderungen: 'Erweiterte Fachkraft-Ausbildung; Diskretion; Physische Fitness', vorteile: 'Anspruchsvolles Umfeld; Hohe Vergütung; Exklusive Aufgaben', beschreibung: 'Schützen Sie Einzelpersonen in gefährdeten Lagen.', seoDescription: 'Personenschutz in {{LOCATION}}. Höchste Anforderungen, beste Bezahlung.' },
    { title: 'Werkschutzmitarbeiter (m/w/d)', badge: 'Quereinsteiger', badgeClass: '', salaryMin: 2620, salaryMax: 2850, aufgaben: 'Pfortendienst; Werksgelände-Kontrolle; Brandschutz', anforderungen: 'Zuverlässigkeit; Deutsch-Kenntnisse; Teamfähigkeit', vorteile: 'Stabile Schichten; Langfristiger Einsatz; Übernahme-Option', beschreibung: 'Sichern Sie große Werksgelände ab.', seoDescription: 'Werkschutzmitarbeiter in {{LOCATION}} gesucht. Jetzt bewerben!' },
    { title: 'Brandwache (m/w/d)', badge: 'Quereinsteiger', badgeClass: '', salaryMin: 2770, salaryMax: 3030, aufgaben: 'Überwachung von Heißarbeiten; Fluchtwegsicherung; Erstbrandbekämpfung', anforderungen: 'Brandschutzhelfer-Quali (wird geschult); Aufmerksamkeit', vorteile: 'Flexible Einsätze; Gute Bezahlung; Wichtige Aufgabe', beschreibung: 'Verhindern Sie Brände auf Baustellen und Events.', seoDescription: 'Brandwache in {{LOCATION}}. Sicherer Job mit Verantwortung.' },
    { title: 'Einzelhandelsdetektiv/-in (m/w/d)', badge: 'Quereinsteiger', badgeClass: '', salaryMin: 2620, salaryMax: 2850, aufgaben: 'Ladendiebe stellen; Videoüberwachung; Dokumentation', anforderungen: 'Sachkunde §34a; Beobachtungsgabe; Durchsetzungsvermögen', vorteile: 'Zivile Arbeit; Abwechslung; Eigenverantwortung', beschreibung: 'Verhindern Sie Diebstähle im Einzelhandel.', seoDescription: 'Kaufhausdetektiv in {{LOCATION}} werden. Bewirb dich jetzt!' },
    { title: 'Pfortendienst (m/w/d)', badge: 'Quereinsteiger', badgeClass: '', salaryMin: 2620, salaryMax: 2850, aufgaben: 'Besucherkontrolle; Schlüsselausgabe; Telefonvermittlung', anforderungen: 'Freundliches Auftreten; Pünktlichkeit; Deutsch-Kenntnisse', vorteile: 'Ruhiger Arbeitsplatz; Feste Zeiten; Stabiles Umfeld', beschreibung: 'Besetzen Sie die Pforte bei unseren Kunden.', seoDescription: 'Job im Pfortendienst in {{LOCATION}}. Jetzt bewerben!' },
    { title: 'Fachkraft für Flughafensicherheit (m/w/d)', badge: 'Quereinsteiger', badgeClass: '', salaryMin: 3200, salaryMax: 3800, aufgaben: 'Passagierkontrolle; Gepäckscreening; Luftsicherheit', anforderungen: 'Luftsicherheitsassistent (wird geschult); Führungszeugnis', vorteile: 'Tariflohn; Spannendes Umfeld; Sicherer Arbeitsplatz', beschreibung: 'Sichern Sie den Flugbetrieb ab.', seoDescription: 'Flughafensicherheit in {{LOCATION}} suchen neue Mitarbeiter.' },
    { title: 'Mobiler Sicherheitsdienst (m/w/d)', badge: 'Quereinsteiger', badgeClass: '', salaryMin: 2770, salaryMax: 3030, aufgaben: 'Alarmverfolgung; Kontrollfahrten; Schließdienste', anforderungen: 'Führerschein; Sachkunde §34a; Flexibilität', vorteile: 'Dienstfahrzeug; Abwechslung; Nachtzuschläge', beschreibung: 'Seien Sie mobil im Einsatz für unsere Kunden.', seoDescription: 'Mobiler Sicherheitsdienst in {{LOCATION}}. Attraktives Stellenangebot!' },
    { title: 'Bahnsicherheitskraft (m/w/d)', badge: 'Quereinsteiger', badgeClass: '', salaryMin: 2850, salaryMax: 3200, aufgaben: 'Präsenz an Bahnhöfen; Streife im Zug; Hausordnung durchsetzen', anforderungen: 'Belastbarkeit; Deutsch fließend; §34a Sachkunde', vorteile: 'Gute Bezahlung; Job-Ticket; Sicherer Arbeitgeber', beschreibung: 'Sorgen Sie für Sicherheit auf den Schienen.', seoDescription: 'Bahnsicherheit in {{LOCATION}}. Werden Sie Teil des Teams!' }
];

const jobsCode = "module.exports = " + JSON.stringify(jobTemplates, null, 2) + ";\n";
fs.writeFileSync(path.join(__dirname, 'data', 'jobs.js'), jobsCode);

// 2. Recover Cities
const PLZ_NEARBY = {
    '10': ['Berlin-Mitte', 'Berlin-Kreuzberg', 'Charlottenburg', 'Schöneberg', 'Prenzlauer Berg', 'Friedrichshain', 'Neukölln', 'Potsdam'],
    '12': ['Berlin-Tempelhof', 'Berlin-Steglitz', 'Berlin-Neukölln', 'Berlin-Treptow', 'Berlin-Mariendorf', 'Schönefeld', 'Königs Wusterhausen'],
    '13': ['Berlin-Reinickendorf', 'Berlin-Wedding', 'Berlin-Pankow', 'Berlin-Tegel', 'Hennigsdorf', 'Oranienburg', 'Bernau'],
    '14': ['Potsdam', 'Berlin-Spandau', 'Falkensee', 'Werder', 'Brandenburg', 'Teltow', 'Stahnsdorf'],
    '20': ['Hamburg-Mitte', 'Hamburg-Altona', 'HafenCity', 'St. Pauli', 'Hamburg-Nord', 'Eimsbüttel', 'Wandsbek'],
    '21': ['Hamburg-Harburg', 'Hamburg-Bergedorf', 'Buxtehude', 'Stade', 'Winsen', 'Lüneburg', 'Buchholz'],
    '22': ['Hamburg-Wandsbek', 'Hamburg-Barmbek', 'Ahrensburg', 'Norderstedt', 'Pinneberg', 'Elmshorn', 'Bad Oldesloe'],
    '30': ['Hannover-Mitte', 'Hannover-Linden', 'Langenhagen', 'Laatzen', 'Garbsen', 'Isernhagen', 'Burgdorf'],
    '31': ['Hildesheim', 'Sarstedt', 'Alfeld', 'Hameln', 'Peine', 'Nordstemmen', 'Elze'],
    '33': ['Bielefeld', 'Gütersloh', 'Herford', 'Detmold', 'Paderborn', 'Minden', 'Bad Salzuflen'],
    '34': ['Kassel', 'Baunatal', 'Vellmar', 'Niestetal', 'Lohfelden', 'Hofgeismar', 'Wolfhagen'],
    '35': ['Gießen', 'Wetzlar', 'Marburg', 'Linden', 'Pohlheim', 'Heuchelheim', 'Buseck'],
    '38': ['Braunschweig', 'Wolfsburg', 'Salzgitter', 'Gifhorn', 'Peine', 'Helmstedt', 'Wolfenbüttel'],
    '40': ['Düsseldorf-Mitte', 'Düsseldorf-Bilk', 'Neuss', 'Ratingen', 'Meerbusch', 'Erkrath', 'Hilden'],
    '41': ['Mönchengladbach', 'Viersen', 'Korschenbroich', 'Grevenbroich', 'Erkelenz', 'Jüchen', 'Wegberg'],
    '42': ['Wuppertal', 'Solingen', 'Remscheid', 'Velbert', 'Haan', 'Schwelm', 'Mettmann'],
    '44': ['Dortmund', 'Unna', 'Lünen', 'Schwerte', 'Holzwickede', 'Kamen', 'Bergkamen', 'Castrop-Rauxel'],
    '45': ['Essen', 'Mülheim a.d.R.', 'Gelsenkirchen', 'Oberhausen', 'Bottrop', 'Bochum', 'Gladbeck', 'Herne'],
    '47': ['Duisburg', 'Moers', 'Krefeld', 'Rheinhausen', 'Homberg', 'Kleve', 'Xanten'],
    '48': ['Münster', 'Greven', 'Emsdetten', 'Steinfurt', 'Warendorf', 'Telgte', 'Lengerich'],
    '50': ['Köln-Innenstadt', 'Hürth', 'Brühl', 'Frechen', 'Pulheim', 'Bergisch Gladbach'],
    '51': ['Köln-Deutz', 'Leverkusen', 'Bergisch Gladbach', 'Overath', 'Rösrath', 'Odenthal', 'Burscheid'],
    '53': ['Bonn', 'Bad Godesberg', 'Siegburg', 'Troisdorf', 'Sankt Augustin', 'Königswinter', 'Hennef', 'Meckenheim'],
    '60': ['Frankfurt-Mitte', 'Offenbach', 'Neu-Isenburg', 'Eschborn', 'Bad Vilbel'],
    '61': ['Bad Homburg', 'Friedberg', 'Oberursel', 'Friedrichsdorf', 'Karben'],
    '63': ['Offenbach', 'Hanau', 'Mühlheim', 'Obertshausen', 'Rodgau', 'Dietzenbach', 'Dreieich', 'Langen'],
    '64': ['Darmstadt', 'Weiterstadt', 'Griesheim', 'Pfungstadt', 'Bensheim', 'Dieburg', 'Groß-Gerau'],
    '65': ['Wiesbaden', 'Mainz', 'Taunusstein', 'Idstein', 'Rüdesheim', 'Eltville'],
    '68': ['Mannheim', 'Ludwigshafen', 'Heidelberg', 'Weinheim', 'Viernheim'],
    '69': ['Heidelberg', 'Wiesloch', 'Leimen', 'Eppelheim', 'Sandhausen', 'Dossenheim', 'Neckargemünd'],
    '70': ['Stuttgart-Mitte', 'Esslingen', 'Fellbach', 'Gerlingen', 'Leonberg'],
    '71': ['Böblingen', 'Sindelfingen', 'Herrenberg', 'Leonberg', 'Renningen', 'Holzgerlingen'],
    '73': ['Esslingen', 'Göppingen', 'Kirchheim', 'Plochingen', 'Ostfildern'],
    '74': ['Heilbronn', 'Neckarsulm', 'Weinsberg', 'Öhringen', 'Mosbach', 'Sinsheim'],
    '76': ['Karlsruhe', 'Ettlingen', 'Bruchsal', 'Rastatt', 'Bretten'],
    '80': ['München-Mitte', 'München-Schwabing', 'Dachau', 'Ismaning', 'Garching'],
    '81': ['München-Bogenhausen', 'Unterhaching', 'Ottobrunn', 'Haar'],
    '82': ['Starnberg', 'Geretsried', 'Wolfratshausen', 'Gauting', 'Gilching'],
    '86': ['Augsburg', 'Friedberg', 'Königsbrunn', 'Gersthofen', 'Neusäß'],
    '90': ['Nürnberg-Mitte', 'Fürth', 'Schwabach', 'Stein', 'Erlangen'],
    '91': ['Erlangen', 'Herzogenaurach', 'Forchheim', 'Baiersdorf', 'Eckental'],
    '93': ['Regensburg', 'Neutraubling', 'Lappersdorf', 'Pentling', 'Sinzing'],
    '99': ['Erfurt', 'Weimar', 'Gotha', 'Arnstadt', 'Sömmerda'],
    '01': ['Dresden-Altstadt', 'Dresden-Neustadt', 'Radebeul', 'Pirna', 'Coswig'],
    '04': ['Leipzig-Mitte', 'Markkleeberg', 'Taucha', 'Schkeuditz', 'Borna'],
    '18': ['Rostock-Warnemünde', 'Rostock-Mitte', 'Bentwisch', 'Broderstorf', 'Sanitz'],
    '24': ['Kiel', 'Kronshagen', 'Altenholz', 'Rendsburg', 'Neumünster'],
    '28': ['Bremen-Mitte', 'Delmenhorst', 'Stuhr', 'Weyhe', 'Achim', 'Lilienthal']
};

function getRegion(plz) {
    const p2 = plz.substring(0, 2);
    const map = {
        '01': 'SN', '04': 'SN', '10': 'BE', '12': 'BE', '13': 'BE', '14': 'BB', '18': 'MV', '20': 'HH', '21': 'HH', '22': 'HH', '24': 'SH', '28': 'HB',
        '30': 'NI', '31': 'NI', '33': 'NW', '34': 'HE', '35': 'HE', '38': 'NI', '40': 'NW', '41': 'NW', '42': 'NW', '44': 'NW', '45': 'NW', '47': 'NW', '48': 'NW',
        '50': 'NW', '51': 'NW', '53': 'NW', '60': 'HE', '61': 'HE', '63': 'HE', '64': 'HE', '65': 'HE', '68': 'BW', '69': 'BW', '70': 'BW', '71': 'BW',
        '73': 'BW', '74': 'BW', '76': 'BW', '80': 'BY', '81': 'BY', '82': 'BY', '86': 'BY', '90': 'BY', '91': 'BY', '93': 'BY', '99': 'TH'
    };
    return map[p2] || 'DE';
}

const citiesArray = [];
for (const prefix in PLZ_NEARBY) {
    for (const name of PLZ_NEARBY[prefix]) {
        citiesArray.push({
            name: name,
            plz: prefix + '115', // dummy PLZ
            region: getRegion(prefix)
        });
    }
}

const citiesCode = "module.exports = " + JSON.stringify(citiesArray, null, 2) + ";\n";
fs.writeFileSync(path.join(__dirname, 'data', 'cities.js'), citiesCode);

console.log("Recovery complete: data/jobs.js and data/cities.js created.");
