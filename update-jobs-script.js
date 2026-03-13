const fs = require('fs');
const path = require('path');

const jobsFilePath = path.join(__dirname, 'data', 'jobs.js');
let jobsContent = fs.readFileSync(jobsFilePath, 'utf-8');

// I will parse the JS by executing it, enriching it, and then writing it back.
const jobs = require('./data/jobs.js');

const jobContexts = {
    'Sicherheitsmitarbeiter (m/w/d)': [
        "In ${city} übernehmen Sie vielseitige Schutzaufgaben, von der Zutrittskontrolle bis zu regelmäßigen Kontrollrundgängen bei lokalen Unternehmen.",
        "Als Sicherheitsmitarbeiter in ${city} sind Sie der erste Ansprechpartner am Empfang und gewährleisten die Sicherheit von Mitarbeitern und Besuchern vor Ort.",
        "Das Einsatzgebiet in ${city} bietet abwechslungsreiche Schichten im Objekt- und Werkschutz mit einer idealen Anbindung an den örtlichen Nahverkehr.",
        "Ihre Aufgabenbereiche in ${city} umfassen unter anderem die Alarmverfolgung und professionelle Intervention in modernen Wirtschaftsparks."
    ],
    'Wachschutzmitarbeiter (m/w/d)': [
        "Als Wachschutzmitarbeiter in ${city} patrouillieren Sie primär bei Tag und Nacht durch lokale Industrie- und Gewerbegebiete, um maximale Prävention zu gewährleisten.",
        "Die Objektbewachung in ${city} erfordert ein wachsames Auge beim Schließdienst sowie bei der lückenlosen Dokumentation der Kontrollgänge.",
        "Schützen Sie Unternehmenswerte in ${city}: Sie sind verantwortlich für präventive Rundgänge und die schnelle Alarmverfolgung bei Vorfällen.",
        "Ihr Fokus in ${city} liegt auf der stationären und mobilen Bewachung von Anlagen, die zentral an die städtische Verkehrsinfrastruktur angebunden sind."
    ],
    'Revierwachmann/-frau (m/w/d)': [
        "Mit dem Dienstfahrzeug fahren Sie in ${city} festgelegte Reviere ab und prüfen lokale Firmengelände sowie sensible Außenbereiche auf Unversehrtheit.",
        "Die Revierfahrten in ${city} zeichnen sich durch schnelle Eingreifzeiten aus – Sie reagieren flexibel auf Alarme und stellen die Ordnung vor Ort wieder her.",
        "In ${city} sind Sie mobil im Einsatz: Von der Tor- und Pfortenkontrolle im Gewerbegebiet bis zur umfassenden Alarmverfolgung im gesamten Stadtgebiet.",
        "Ihre mobilen Streifenfahrten vernetzen verschiedene Kundenobjekte in ${city} und sorgen für eine flächendeckende, präventive Sicherheit."
    ],
    'ÖPNV-Sicherheitskraft (m/w/d)': [
        "In den Bussen, Bahnen und an den Bahnhöfen von ${city} sorgen Sie als präsente Sicherheitskraft für das Wohlgefühl und den Schutz aller Fahrgäste.",
        "Der Nahverkehr in ${city} erfordert diplomatisches Geschick bei der Fahrgastbetreuung und eine deeskalierende Haltung in Konfliktsituationen.",
        "Als ÖPNV-Sicherheitskraft in ${city} arbeiten Sie eng mit lokalen Ordnungsbehörden zusammen und führen regelmäßige Streifengänge durch.",
        "Ihre Präsenz an den Verkehrsknotenpunkten in ${city} reduziert Vandalismus und steigert das subjektive Sicherheitsgefühl der Pendler enorm."
    ],
    'Objektschutzmitarbeiter (m/w/d)': [
        "Der Fokus in ${city} liegt auf der lückenlosen Videoüberwachung und dem professionellen Besuchermanagement an Zugangspunkten großer Industrieanlagen.",
        "Als Teil des Objektschutzes in ${city} führen Sie Schließ- und Kontrollrundgänge durch, die exakt auf die lokalen Gegebenheiten der Kunden zugeschnitten sind.",
        "Die Absicherung kritischer Unternehmenszentralen in ${city} erfordert höchste Zuverlässigkeit bei der Zutrittskontrolle von Lieferanten und Mitarbeitern.",
        "In ${city} gewährleisten Sie die Sicherheit von Objekten im Schichtdienst, wobei die Standorte logistisch gut an das Hauptstraßennetz angeschlossen sind."
    ],
    'Empfangskraft Sicherheit (m/w/d)': [
        "Sie repräsentieren moderne Bürokomplexe in ${city}: Ihre primären Aufgaben sind der professionelle Empfang, die Ausweiskontrolle und das Besuchermanagement.",
        "Als Sicherheits-Empfangskraft in ${city} besetzen Sie die Telefonzentrale, koordinieren den Zutritt und sind das absolute Aushängeschild des Gebäudes.",
        "In den Premium-Objekten in ${city} verbinden Sie exzellenten Service mit strikter Zugangskontrolle bei geregelten Tagesarbeitszeiten.",
        "Ihr Arbeitsplatz in ${city} befindet sich in repräsentativen Firmenzentralen, wo Fremdsprachen und ein gepflegtes Auftreten im täglichen Kundenkontakt glänzen."
    ],
    'Veranstaltungsschutz (m/w/d)': [
        "Sichern Sie die spannendsten Konzerte und Messen in ${city} ab: Ihre Aufgaben reichen von Einlasskontrollen bis zum koordinierten Ordnungsdienst.",
        "Als Teil des Event-Security-Teams in ${city} kümmern Sie sich um VIP-Betreuung, Backstage-Sicherheit und die professionelle Wegeführung der Fanströme.",
        "Das Veranstaltungsgebiet in ${city} bietet flexible Einsatzzeiten bei vielfältigen Kulturevents, Sportveranstaltungen und exklusiven Firmenabenden.",
        "Sie gewährleisten in ${city} durch präventive Absperrungen und Deeskalation die Sicherheit tausender Besucher auf lokalen Großveranstaltungen."
    ],
    'Werkschutzmitarbeiter (m/w/d)': [
        "In den Industrieanlagen von ${city} verantworten Sie die strenge Zutrittskontrolle, das Parkplatzmanagement sowie konsequente Fahrzeugkontrollen der Lieferanten.",
        "Der Werkschutz in ${city} verlangt Ihre Aufmerksamkeit bei Brandschutzüberwachungen und detaillierten Kontrollrundgängen auf weitläufigen Arealen.",
        "Profitieren Sie von langfristigen Perspektiven in ${city}: Im 3-Schicht-System sichern Sie kritische Produktionsstätten und dokumentieren Vorfälle bei der Schichtübergabe.",
        "Als Teil des Werkschutzes in ${city} arbeiten Sie an hochtechnisierten Pforten und steuern den gesamten logistischen Zufluss direkt an der Werksgrenze."
    ],
    'Geld- & Werttransportfahrer/-in (m/w/d)': [
        "Fahren Sie hochgesicherte Spezialfahrzeuge in und um ${city}, um Werttransporte nach strikten Sicherheitsprotokollen durchzuführen.",
        "Die Werttransportbegleitung in ${city} erfordert höchste Wachsamkeit beim Abholen und Überbringen von Werten, kombiniert mit stetigem GPS-Tracking.",
        "In ${city} übernehmen Sie die Verantwortung für lückenlose Übergabeprotokolle und agieren stets in eng abgestimmten, bewaffneten Teams.",
        "Die anspruchsvolle Routenplanung in ${city} kombiniert mit modernster Ausrüstung macht diesen Premium-Job absolut einzigartig in der Branche."
    ],
    'Doorman / Einzelhandelsdetektiv (m/w/d)': [
        "Als Doorman im Herzen von ${city} prägen Sie das Einkaufserlebnis durch präventive Präsenz und freundliche Begrüßung der Kunden.",
        "Ihr Einsatz in den Einkaufsstraßen von ${city} reduziert Inventurdifferenzen effektiv durch wachsame Beobachtung und Deeskalation bei Diebstählen.",
        "Sie arbeiten direkt in den belebtesten Boutiquen und Stores in ${city}, wo Sie bei Vorkommnissen eng mit der lokalen Polizei kooperieren.",
        "Als Detektiv in ${city} agieren Sie unauffällig im Hintergrund, während Sie als Doorman sichtbare Sicherheitstrainings und Zugangskontrollen umsetzen."
    ],
    'Citystreife / Kommunaler Ordnungsdienst (m/w/d)': [
        "In ${city} patrouillieren Sie durch Parks und Fußgängerzonen, um als uniformierte Citystreife Vandalismus vorzubeugen und das allgemeine Sicherheitsgefühl zu stärken.",
        "Ihre Präsenz auf den Straßen von ${city} unterbindet Ruhestörungen, während Sie eng mit dem lokalen Ordnungsamt und der Polizei zusammenarbeiten.",
        "Die Streifengänge in den Wohn- und Geschäftsvierteln von ${city} erfordern souveränes Auftreten bei der Durchsetzung lokaler Satzungen und Platzverweise.",
        "Als kommunale Sicherheitskraft in ${city} sind Sie der erste Ansprechpartner für Bürger und sorgen für Ordnung im stark frequentierten städtischen Raum."
    ],
    'Brandschutzhelfer / Brandsicherheitswache (m/w/d)': [
        "Die Brandsicherheitswache in ${city} wird bei Events oder feuergefährlichen Arbeiten eingesetzt, um Fluchtwege freizuhalten und Entstehungsbrände sofort zu löschen.",
        "Als Brandschutzhelfer patrouillieren Sie auf den Geländen in ${city}, kontrollieren Löscheinrichtungen und evakuieren Personen im Ernstfall fachgerecht.",
        "In den Eventlocations und Industrieanlagen von ${city} sind Sie für die Überwachung von Heißarbeiten und die strikte Einhaltung aller Brandschutzvorgaben verantwortlich.",
        "Ihre Expertise rettet in ${city} Leben: Sie übernehmen Brandwachen in brandgefährdeten Objekten und stellen sicher, dass alle Alarmierungsketten funktionieren."
    ],
    'Kaufhausdetektiv (m/w/d)': [
        "Verdeckt und unauffällig bewegen Sie sich durch die Kaufhäuser in ${city}, um Ladendiebstähle frühzeitig zu erkennen und rechtssicher zu dokumentieren.",
        "Die Überwachungsmonitore in ${city} sind Ihr Werkzeug, um Täterprofile zu analysieren, Verdächtige zu observieren und die Täterübergabe an die Polizei abzuwickeln.",
        "Als Kaufhausdetektiv in ${city} senken Sie die Inventurverluste des Einzelhandels drastisch und erstatten detailliert Strafanzeige bei Diebstahldelikten.",
        "Ihre zivile Observationstechnik kommt den größten Shopping-Malls in ${city} zugute, wo Sie Zeuge, Ermittler und Sicherheitsgarant in einer Person sind."
    ],
    'Geprüfte Schutz- und Sicherheitskraft (GSSK) (m/w/d)': [
        "Mit Ihrer GSSK-Qualifikation übernehmen Sie in ${city} Leitungsfunktionen, steuern Sicherheitsprozesse komplexer Industrieanlagen und werten Gefährdungsanalysen aus.",
        "Als geprüfte Fachkraft in ${city} sind Sie für den professionellen Werkschutz zuständig, planen Schichtbesetzungen und trainieren jüngere Sicherheitsmitarbeiter.",
        "Ihre Einsätze in ${city} umfassen das Management anspruchsvoller Leitstellen, die Überwachung sicherheitstechnischer Anlagen und die Optimierung der Alarmpläne.",
        "In ${city} leiten Sie Interventionsteams und setzen Sicherheitskonzepte für Premium-Kunden um, wobei lückenlose Einsatzdokumentation im Vordergrund steht."
    ],
    'Fachkraft für Schutz und Sicherheit (m/w/d)': [
        "In der Region ${city} erstellen Sie als ausgebildete Fachkraft umfangreiche Sicherheitsanalysen, entwickeln Konzepte und beraten Kunden in komplexen Schutzfragen.",
        "Ihre Rolle in ${city} vereint operative Sicherheitstätigkeit mit kaufmännischen und planerischen Komponenten bei der Steuerung von großen Einsatzteams.",
        "Als Fachkraft für Schutz und Sicherheit koordinieren Sie in ${city} die Zusammenarbeit mit den BOS (Behörden und Organisationen mit Sicherheitsaufgaben).",
        "Ihr Aufgabenbereich in ${city} umfasst die Kalkulation von Sicherheitsdienstleistungen und die operative Übernahme von Objekt- und Veranstaltungsleitungen."
    ],
    'Einsatzleiter / Schichtleiter Security (m/w/d)': [
        "Als Einsatzleiter in ${city} steuern Sie das Personal zentral, erstellen Dienstpläne für Großobjekte und verantworten die korrekte Abrechnung der Schichten.",
        "Sie sind in ${city} der Hauptansprechpartner für Großkunden: Sie führen Qualitätskontrollen durch, beurteilen Sicherheitsmitarbeiter und optimieren die Performance.",
        "Die Schichtleitung in ${city} erfordert schnelle Problemlösungskompetenz bei kurzfristigen Ausfällen, Alarmierungen und Eskalationen direkt vor Ort.",
        "Führen Sie in ${city} Teams von bis zu 30 Mitarbeitern, motivieren Sie Ihr Personal und stellen Sie die strikte Einhaltung der SLA-Vorgaben für den Kunden sicher."
    ]
};

// Map over existing jobs.js array
const updatedJobsArray = jobs.map(function (job) {
    // assign the contexts
    if (jobContexts[job.title]) {
        job.localContexts = jobContexts[job.title];
    } else {
        // fallback generic contexts if title mismatches completely
        job.localContexts = [
            "In ${city} übernehmen Sie verantwortungsvolle Sicherheitsaufgaben in einem dynamischen, wachsenden Umfeld.",
            "Das Einsatzgebiet in ${city} erfordert höchste Zuverlässigkeit und bietet sehr gute infrastrukturelle Anbindungen.",
            "Als Teil unseres Teams in ${city} gewährleisten Sie die Sicherheit von Objekten und Personen direkt vor Ort."
        ];
    }
    return job;
});

// Now stringify and format back
const util = require('util');
const code = "module.exports = " + util.inspect(updatedJobsArray, { depth: null, maxArrayLength: null }) + ";\n";

fs.writeFileSync(jobsFilePath, code, 'utf-8');
console.log("data/jobs.js correctly updated with specific localContexts!");
