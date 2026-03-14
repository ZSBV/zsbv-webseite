/**
 * build-jobs.js — Automatischer Job-Seiten-Generator für Sicherheit-Karriere
 * 
 * Generiert automatisch Job-Seiten aus:
 *   16 Job-Typen × 70+ Städte = 1.000+ individuelle Seiten
 * 
 * Jede Seite enthält:
 *   - Google for Jobs Schema (JSON-LD)
 *   - AGG-konforme Formulierungen (m/w/d)
 *   - ZSBV Vermittlungshinweis
 * 
 * Erzeugt außerdem:
 *   - sitemap.xml (für Google)
 *   - indeed-feed.xml (für Indeed)
 * 
 * Run: node build-jobs.js
 */

const fs = require('fs');
const path = require('path');

// ============================================================
// CONFIGURATION
// ============================================================

const SITE_URL = 'https://www.sicherheit-karriere.de';
const COMPANY_NAME = 'ZSBV – Zentralstelle für Sichere Bildungsvermittlung';
const JOBS_DIR = path.join(__dirname, 'jobs');
const TEMPLATE_PATH = path.join(__dirname, 'job-template-premium.html');

// ============================================================
// IMPORT DATA (SEO Optimised & Hyper-Local)
// ============================================================

const JOB_TEMPLATES = require('./data/jobs');
const CITIES = require('./data/cities');

// ============================================================
// VERMITTLUNGSHINWEIS (Legal Disclaimer)
// ============================================================

const VERMITTLUNGSHINWEIS = 'Dieses Stellenangebot wird vermittelt durch die ZSBV – Zentralstelle für Sichere Bildungs-Vermittlung. Die ZSBV ist ein Bildungs- und Karrierevermittler für die Sicherheitsbranche. Wir vermitteln kostenlose Qualifizierungen über Bildungsgutschein (§81 SGB III) inkl. §34a Sachkundeprüfung und garantieren einen Arbeitsplatz bei unseren Partnerunternehmen nach bestandener Prüfung.';

// ============================================================
// HELPERS
// ============================================================

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/\(m\/w\/d\)/g, '')    // Remove (m/w/d) from slug
    .replace(/\/-in/g, '')           // Remove /-in
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .replace(/&/g, 'und')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-')
    .substring(0, 80);
}

function esc(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Shuffles array in place.
 */
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function getFeedHtmlDescription(job) {
  return `
    <p><strong>${esc(job.randomIntro)}</strong></p>
    <p>${esc(job.randomLocalContext)}</p>
    <p>Stellenangebot: ${esc(job.title)} in ${esc(job.location)}</p>
    
    <p>${esc(job.description.replace(job.randomIntro, '').replace(job.randomLocalContext, '').replace(job.randomOutro, '').trim())}</p>

    <h3>Ihre Aufgaben:</h3>
    <ul>${job.taskList.map(t => `<li>${esc(t)}</li>`).join('')}</ul>

    <h3>Anforderungen:</h3>
    <ul>${job.reqList.map(r => `<li>${esc(r)}</li>`).join('')}</ul>

    <h3>Ihre Vorteile:</h3>
    <ul>${job.benefitList.map(b => `<li>${esc(b)}</li>`).join('')}</ul>

    <p>${esc(job.randomOutro)}</p>

    <p><em>${esc(VERMITTLUNGSHINWEIS)}</em></p>
  `.trim();
}

const TITLE_SYNONYMS = {
  'Sicherheitsmitarbeiter (m/w/d)': ['Sicherheitskraft (m/w/d)', 'Security Guard (m/w/d)', 'Mitarbeiter im Sicherheitsdienst (m/w/d)', 'Security Mitarbeiter (m/w/d)', 'Fachkraft für Objektschutz (m/w/d)'],
  'Wachschutzmitarbeiter (m/w/d)': ['Mitarbeiter im Wachschutz (m/w/d)', 'Wachmann / Wachfrau (m/w/d)', 'Security für Wachdienst (m/w/d)', 'Wachschutz Kraft (m/w/d)'],
  'ÖPNV-Sicherheitskraft (m/w/d)': ['Sicherheitskraft im Nahverkehr (m/w/d)', 'Mitarbeiter Bahnschutz (m/w/d)', 'Security für Bus & Bahn (m/w/d)'],
  'Geld- & Werttransportfahrer/-in (m/w/d)': ['Fahrer für Werttransporte (m/w/d)', 'Sicherheitsfahrer (m/w/d)', 'Mitarbeiter Logistik & Sicherheit (m/w/d)'],
  'Revierwachmann/-frau (m/w/d)': ['Revierfahrer Sicherheit (m/w/d)', 'Mobiler Wachdienst (m/w/d)', 'Streifenfahrer (m/w/d)'],
  'Empfangskraft Sicherheit (m/w/d)': ['Sicherheitskraft Empfang (m/w/d)', 'Pförtner / Security (m/w/d)', 'Mitarbeiter Objektempfang (m/w/d)'],
  'Veranstaltungsschutz (m/w/d)': ['Event Security (m/w/d)', 'Ordner / Sicherheitsdienst (m/w/d)', 'Mitarbeiter Crowd Management (m/w/d)'],
  'Objektschutzmitarbeiter (m/w/d)': ['Mitarbeiter Objektschutz (m/w/d)', 'Sicherheitskraft Objektsicherung (m/w/d)', 'Security für Industrie (m/w/d)'],
  'Werkschutzmitarbeiter (m/w/d)': ['Sicherheitskraft Werkschutz (m/w/d)', 'Mitarbeiter Werksicherheit (m/w/d)', 'Industriesicherheit (m/w/d)'],
  'Einzelhandelsdetektiv/-in (m/w/d)': ['Laden- / Kaufhausdetektiv (m/w/d)', 'Sicherheitsmitarbeiter Einzelhandel (m/w/d)', 'Doorman / Detektiv (m/w/d)'],
  'Bahnsicherheitskraft (m/w/d)': ['Sicherheitsmitarbeiter Bahn (m/w/d)', 'Security DB / Bahnschutz (m/w/d)', 'Sicherheitsdienst Schienenverkehr (m/w/d)']
};

// ============================================================
// GENERATE ALL JOB PAGES
// ============================================================

function generateAllJobs(template) {
  const today = new Date().toISOString().split('T')[0];
  const validDate = new Date();
  validDate.setDate(validDate.getDate() + 60);
  const validThrough = validDate.toISOString().split('T')[0];

  const jobs = [];

  for (const tmpl of JOB_TEMPLATES) {
    for (const city of CITIES) {
      // 1. Title Variety
      const synonyms = TITLE_SYNONYMS[tmpl.title] || [];
      const allTitles = [tmpl.title, ...synonyms];
      const randomTitle = allTitles[Math.floor(Math.random() * allTitles.length)];

      const slug = slugify(`${tmpl.title}-${city.name}`);
      const jobUrl = `${SITE_URL}/jobs/${slug}.html`;

      // 2. Unique Reference Number
      const refNumber = `ZSBV-${city.plz}-${Math.floor(1000 + Math.random() * 9000)}-${tmpl.title.substring(0,3).toUpperCase()}`;

      // Randomize order of lists for uniqueness
      const taskList = shuffle(tmpl.aufgaben.split(';').map(t => t.trim()).filter(Boolean));
      const reqList = shuffle(tmpl.anforderungen.split(';').map(t => t.trim()).filter(Boolean));
      const benefitList = shuffle(tmpl.vorteile.split(';').map(t => t.trim()).filter(Boolean));

      const salary = `${tmpl.salaryMin.toLocaleString('de-DE')} – ${tmpl.salaryMax.toLocaleString('de-DE')}`;

      // Pick a random local context
      const ctxArr = tmpl.localContexts || ["In ${city} übernehmen Sie verantwortungsvolle Sicherheitsaufgaben in einem dynamischen, wachsenden Umfeld."];
      const randomLocalContext = ctxArr[Math.floor(Math.random() * ctxArr.length)].replace(/\$\{city\}/g, city.name);
      
      const localContextHtml = `<strong>Besonderheiten für ${city.name}:</strong> ${randomLocalContext}`;

      // Variations for the intro to avoid duplicate detection (Mega-Pool 2.0)
      const introVariations = [
        `Werden Sie Teil unseres Sicherheits-Teams in ${city.name}!`,
        `Hier ist Ihre Chance: Neuer Job als ${tmpl.title} in ${city.name}.`,
        `Spannende Herausforderung in ${city.name} gesucht? Werden Sie ${tmpl.title}!`,
        `Direktstart in ${city.name}: Wir suchen ab sofort ${tmpl.title}.`,
        `Sicherer Arbeitsplatz in ${city.name}: Bewerben Sie sich als ${tmpl.title}.`,
        `Karriere-Check in ${city.name}: Wir suchen Verstärkung als ${tmpl.title}.`,
        `Lust auf Sicherheit? Starten Sie als ${tmpl.title} in ${city.name}.`,
        `Ihre Zukunft in ${city.name}: Bewerben Sie sich als ${tmpl.title}.`,
        `Neu orientieren in ${city.name}: Wir suchen ${tmpl.title} ab sofort.`,
        `ZSBV Job-Offensive: ${tmpl.title} für ${city.name} gesucht.`,
        `Sicherheit geht vor: Werden Sie unser neuer ${tmpl.title} in ${city.name}.`,
        `Mitarbeiter für Sicherheit (${tmpl.title}) in ${city.name} gesucht.`,
        `Top Job-Chance: Werden Sie JETZT ${tmpl.title} in ${city.name}.`,
        `Bereit für was Neues? Wir suchen ${tmpl.title} in ${city.name}.`,
        `Verstärken Sie uns in ${city.name} als ${tmpl.title}.`,
        `Sicherheitskarriere in ${city.name} starten: Wir suchen Sie als ${tmpl.title}.`,
        `Arbeiten bei ZSBV in ${city.name}: Werden Sie ${tmpl.title}.`,
        `Jetzt bewerben in ${city.name}: Ihre Chance als ${tmpl.title}.`,
        `Sicherheitsprofi in ${city.name} werden: Wir stellen ${tmpl.title} ein.`,
        `Ihr neuer Weg in ${city.name}: Starten Sie als ${tmpl.title}.`,
        `Gemeinsam für Sicherheit in ${city.name}: Wir suchen ${tmpl.title}.`,
        `Chance nutzen in ${city.name}: Werden Sie Teil von uns als ${tmpl.title}.`
      ];
      const randomIntro = introVariations[Math.floor(Math.random() * introVariations.length)];

      const outroVariations = [
        `Wir freuen uns auf Ihre Bewerbung für den Standort ${city.name}!`,
        `Nutzen Sie Ihre Chance in ${city.name} und bewerben Sie sich noch heute.`,
        `Ihr neuer Job in ${city.name} ist nur einen Klick entfernt.`,
        `Starten Sie jetzt Ihre Karriere bei uns in ${city.name}.`,
        `Werden Sie Teil der Erfolgsgeschichte in ${city.name}.`,
        `Bewerben Sie sich jetzt und sichern Sie sich Ihren Platz in ${city.name}.`,
        `Wir erwarten Sie in ${city.name} – jetzt Kontakt aufnehmen!`,
        `Gemeinsam für Sicherheit in ${city.name} sorgen.`,
        `Ihre Bewerbung für ${city.name} ist bei uns willkommen.`,
        `Kommen Sie in unser Team in ${city.name}!`,
        `ZSBV: Ihr Partner für Jobsicherheit in ${city.name}.`,
        `Wir freuen uns darauf, Sie in ${city.name} kennenzulernen.`,
        `Starten Sie Ihre Zukunft noch heute in ${city.name}.`,
        `Ihr Weg zum Erfolg in ${city.name} beginnt hier.`,
        `Werden Sie Teil der ZSBV-Familie in ${city.name}.`,
        `Machen Sie den nächsten Schritt in ${city.name}.`,
        `Bewerben Sie sich ganz unkompliziert für ${city.name}.`,
        `Wir blicken gespannt auf Ihre Bewerbung in ${city.name}.`
      ];
      const randomOutro = outroVariations[Math.floor(Math.random() * outroVariations.length)];

      // Section Shuffling (Tasks, Requirements, Benefits)
      const sections = [
        { title: 'Ihre Aufgaben', content: `<ul>${taskList.map(t => `<li>${esc(t)}</li>`).join('')}</ul>` },
        { title: 'Das bringen Sie mit', content: `<ul>${reqList.map(r => `<li>${esc(r)}</li>`).join('')}</ul>` },
        { title: 'Ihre Vorteile bei uns', content: `<ul>${benefitList.map(b => `<li>${esc(b)}</li>`).join('')}</ul>` }
      ];
      const shuffledSections = shuffle([...sections]);

      // Construct a unique overall description for HTML
      const fullCustomDescription = `
        ${randomIntro} 
        
        ${randomLocalContext} 
        
        ${tmpl.beschreibung}

        ${randomOutro}
      `.trim();

      // Google for Jobs JSON-LD (Rich formatting for Google)
      const jsonLdDescription = `<p><strong>${esc(randomIntro)}</strong></p>` +
        `<p>${esc(randomLocalContext)}</p>` +
        `<p>${esc(tmpl.beschreibung)}</p>` +
        shuffledSections.map(s => `<h3>${esc(s.title)}</h3>${s.content}`).join('') +
        `<p>${esc(randomOutro)}</p>` +
        `<p><em>${esc(VERMITTLUNGSHINWEIS)}</em></p>`;

      const jsonLd = {
        "@context": "https://schema.org",
        "@type": "JobPosting",
        "title": tmpl.title,
        "description": jsonLdDescription,
        "identifier": {
          "@type": "PropertyValue",
          "name": COMPANY_NAME,
          "value": `job-sicherheit-${slug}`
        },
        "datePosted": today,
        "validThrough": validThrough + 'T23:59:59+01:00',
        "employmentType": "FULL_TIME",
        "hiringOrganization": {
          "@type": "Organization",
          "name": COMPANY_NAME,
          "sameAs": SITE_URL,
          "logo": `${SITE_URL}/images/logo-zsbv.png`
        },
        "jobLocation": {
          "@type": "Place",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": city.name.replace(/-.*/, ''),
            "postalCode": city.plz,
            "addressRegion": city.region,
            "addressCountry": "DE"
          }
        },
        "baseSalary": {
          "@type": "MonetaryAmount",
          "currency": "EUR",
          "value": {
            "@type": "QuantitativeValue",
            "minValue": tmpl.salaryMin,
            "maxValue": tmpl.salaryMax,
            "unitText": "MONTH"
          }
        },
        "applicantLocationRequirements": { "@type": "Country", "name": "Deutschland" },
        "jobBenefits": "Kostenlose Qualifizierung, §34a Sachkundeprüfung inklusive, Aktive Arbeitsplatzvermittlung, Bildungsgutschein möglich",
        "directApply": true
      };

      // Fill template for the HTML page
      // --------------------------------------------------------
      // INTERNAL LINKING (Link-Juice)
      // --------------------------------------------------------
      const otherJobsInCity = JOB_TEMPLATES.filter(otherTmpl => otherTmpl.title !== tmpl.title);
      const shuffled = otherJobsInCity.sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 3);

      const internalLinksHtml = `
            <div class="job-detail-card" style="margin-top: 48px; border-color: rgba(200,168,78,0.3); background: rgba(200,168,78,0.02);">
                <h2>&#128270; Weitere Jobs in ${esc(city.name)}</h2>
                <style>
                    .job-detail-card ul.internal-links-list li::before { content: '→' !important; }
                    .internal-links-list a:hover { color: #fff !important; text-decoration: underline !important; }
                </style>
                <ul class="internal-links-list">
                    ${selected.map(otherTmpl => {
        const otherSlug = slugify(`${otherTmpl.title}-${city.name}`);
        const variations = [
          `Weitere Jobs als ${esc(otherTmpl.title)} in ${esc(city.name)}`,
          `${esc(otherTmpl.title)} (m/w/d) in ${esc(city.name)} gesucht`,
          `Jetzt als ${esc(otherTmpl.title)} in ${esc(city.name)} bewerben`,
          `Stellenangebot: ${esc(otherTmpl.title)} in ${esc(city.name)}`
        ];
        const anchorText = variations[Math.floor(Math.random() * variations.length)];
        return `<li><a href="${otherSlug}.html" style="color: var(--gold); text-decoration: none; transition: color 0.3s;">${anchorText}</a></li>`;
      }).join('\n                    ')}
                </ul>
            </div>`;

      let html = template
        .replace(/{{TITLE}}/g, esc(randomTitle))
        .replace(/{{LOCATION}}/g, esc(city.name))
        .replace(/{{DATE_POSTED}}/g, esc(today))
        .replace(/{{EMPLOYMENT}}/g, esc('Vollzeit'))
        .replace(/{{SALARY}}/g, esc(salary))
        .replace(/{{SALARY_MIN}}/g, esc(tmpl.salaryMin.toLocaleString('de-DE')))
        .replace(/{{SALARY_MAX}}/g, esc(tmpl.salaryMax.toLocaleString('de-DE')))
        .replace(/{{DESCRIPTION}}/g, esc(fullCustomDescription))
        .replace(/{{LOCAL_CONTEXT}}/g, localContextHtml)
        .replace(/{{TASKS_LIST}}/g, taskList.map(t => `<li>${esc(t)}</li>`).join(''))
        .replace(/{{REQUIREMENTS_LIST}}/g, reqList.map(r => `<li>${esc(r)}</li>`).join(''))
        .replace(/{{BENEFITS_LIST}}/g, benefitList.map(b => `<li>${esc(b)}</li>`).join(''))
        .replace(/{{BADGE}}/g, esc(tmpl.badge))
        .replace(/{{BADGE_CLASS}}/g, esc(tmpl.badgeClass))
        .replace(/{{JSON_LD}}/g, JSON.stringify(jsonLd))
        .replace(/{{IMAGE_PATH}}/g, esc(tmpl.image || 'images/jobs/01-objektschutz.png'))
        .replace(/{{META_DESCRIPTION}}/g, esc(tmpl.seoDescription.replace(/\{\{LOCATION\}\}/g, city.name)))
        .replace(/{{INTERNAL_LINKS}}/g, internalLinksHtml)
        .replace(/{{JOB_URL}}/g, jobUrl);

      jobs.push({ 
        slug, 
        html, 
        title: randomTitle, 
        location: city.name, 
        region: city.region, 
        salary, 
        jobUrl, 
        datePosted: today, 
        validThrough, 
        description: fullCustomDescription, 
        taskList,
        reqList,
        benefitList,
        randomIntro,
        randomLocalContext,
        randomOutro,
        refNumber
      });
    }
  }

  return jobs;
}

// ============================================================
// SITEMAP & INDEED FEED
// ============================================================

function generateSitemap(jobs) {
  const today = new Date().toISOString().split('T')[0];
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${SITE_URL}/</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url>
  <url><loc>${SITE_URL}/unternehmen.html</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>${SITE_URL}/impressum.html</loc><lastmod>${today}</lastmod><changefreq>yearly</changefreq><priority>0.3</priority></url>
  <url><loc>${SITE_URL}/datenschutz.html</loc><lastmod>${today}</lastmod><changefreq>yearly</changefreq><priority>0.3</priority></url>`;
  for (const job of jobs) {
    xml += `\n  <url><loc>${job.jobUrl}</loc><lastmod>${job.datePosted}</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>`;
  }
  xml += '\n</urlset>\n';
  return xml;
}

function generateHtmlSitemap(jobs) {
  // Group jobs by city
  const jobsByCity = {};
  for (const job of jobs) {
    if (!jobsByCity[job.location]) jobsByCity[job.location] = [];
    jobsByCity[job.location].push(job);
  }

  // Sort cities alphabetically
  const sortedCities = Object.keys(jobsByCity).sort();

  let listsHtml = '';
  for (const city of sortedCities) {
    // Sort jobs alphabetically within city
    jobsByCity[city].sort((a, b) => a.title.localeCompare(b.title));

    listsHtml += `
      <div class="sitemap-city-group">
        <h3>${esc(city)}</h3>
        <ul>
          ${jobsByCity[city].map(j => `<li><a href="${j.jobUrl.replace(SITE_URL + '/', '')}">${esc(j.title)}</a></li>`).join('\n          ')}
        </ul>
      </div>
    `;
  }

  const html = `<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Alle Jobs von A-Z | Sicherheit-Karriere</title>
    <meta name="description" content="Übersicht aller verfügbaren Jobs in der Sicherheitsbranche. Finden Sie Ihren passenden Job in Ihrer Region.">
    <link rel="stylesheet" href="styles.css">
    <style>
        .sitemap-header {
            padding: 160px 0 80px;
            background: linear-gradient(180deg, var(--navy-dark) 0%, var(--navy) 100%);
            text-align: center;
        }
        .sitemap-header h1 {
            font-family: var(--font-heading);
            font-size: clamp(32px, 5vw, 48px);
            color: var(--white);
            margin-bottom: 20px;
            text-shadow: 0 4px 12px rgba(0,0,0,0.5);
        }
        .sitemap-header p {
            color: var(--silver);
            font-size: 18px;
            max-width: 600px;
            margin: 0 auto;
        }
        .sitemap-content {
            padding: 80px 0;
            background: var(--navy);
            min-height: 50vh;
        }
        .sitemap-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            gap: 48px;
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 5%;
        }
        .sitemap-city-group {
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid rgba(200, 168, 78, 0.1);
            border-radius: 16px;
            padding: 32px;
            transition: transform 0.3s, border-color 0.3s;
        }
        .sitemap-city-group:hover {
            border-color: rgba(200, 168, 78, 0.3);
            transform: translateY(-4px);
        }
        .sitemap-city-group h3 {
            font-family: var(--font-heading);
            color: var(--gold);
            font-size: 24px;
            margin-bottom: 24px;
            border-bottom: 2px solid rgba(200, 168, 78, 0.2);
            padding-bottom: 12px;
        }
        .sitemap-city-group ul {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .sitemap-city-group li {
            margin-bottom: 12px;
            padding-bottom: 12px;
            border-bottom: 1px dashed rgba(255,255,255,0.05);
        }
        .sitemap-city-group li:last-child {
            border-bottom: none;
            margin-bottom: 0;
            padding-bottom: 0;
        }
        .sitemap-city-group a {
            color: var(--silver);
            text-decoration: none;
            transition: all 0.3s;
            font-size: 15px;
            display: flex;
            align-items: center;
            line-height: 1.4;
        }
        .sitemap-city-group a::before {
            content: "•";
            color: var(--gold);
            margin-right: 12px;
            font-size: 20px;
        }
        .sitemap-city-group a:hover {
            color: var(--white);
            transform: translateX(4px);
        }
    </style>
</head>
<body>
    <!-- NAVIGATION -->
    <nav class="navbar scrolled" id="navbar">
        <a href="index.html" class="nav-logo">
            <img src="images/logo-zsbv.png" alt="ZSBV Logo"
                style="width: 48px; height: 48px; object-fit: contain; filter: drop-shadow(0 2px 8px rgba(200, 168, 78, 0.3));">
            <div class="nav-logo-group">
                <div class="nav-logo-text">Sicherheit<span>-Karriere</span></div>
                <div class="nav-logo-sub">Zentralstelle f&#252;r Sichere Bildungsvermittlung</div>
            </div>
        </a>
        <ul class="nav-links">
            <li><a href="index.html#jobs">Stellen</a></li>
            <li><a href="index.html#about">&#220;ber uns</a></li>
            <li><a href="index.html#services">Ausbildung</a></li>
            <li><a href="index.html#contact">Kontakt</a></li>
            <li><a href="unternehmen.html">F&#252;r Unternehmen</a></li>
        </ul>
        <div class="nav-contact">
            <a href="mailto:info@sicherheit-karriere.de" class="nav-phone">info@sicherheit-karriere.de</a>
        </div>
        <button class="nav-menu-btn" aria-label="Men&#252; &#246;ffnen">
            <span></span><span></span><span></span>
        </button>
    </nav>

    <header class="sitemap-header">
        <div class="container">
            <h1>Alle Jobs von A-Z</h1>
            <p>Übersicht aller verf&uuml;gbaren Positionen nach Regionen sortiert.</p>
        </div>
    </header>

    <section class="sitemap-content">
        <div class="sitemap-grid">
            ${listsHtml}
        </div>
    </section>

    <!-- FOOTER -->
    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-logo">Sicherheit<span>-Karriere</span></div>
                <div class="footer-links">
                    <a href="index.html#jobs">Stellen</a>
                    <a href="index.html#about">&#220;ber uns</a>
                    <a href="index.html#services">Ausbildung</a>
                    <a href="index.html#contact">Kontakt</a>
                    <a href="unternehmen.html">F&#252;r Unternehmen</a>
                    <a href="datenschutz.html">Datenschutz</a>
                    <a href="impressum.html">Impressum</a>
                    <a href="alle-jobs.html">Alle Jobs von A-Z</a>
                </div>
            </div>
            <div class="footer-bottom">
                <p><strong>sicherheit-karriere.de &#8211; Ein Projekt der ZSBV (Zentralstelle f&#252;r sichere Bildungsvermittlung)</strong><br>
                &#169; 2026 ZSBV. Alle Rechte vorbehalten.
                </p>
            </div>
        </div>
    </footer>
    <script>
        const btn = document.querySelector('.nav-menu-btn');
        const links = document.querySelector('.nav-links');
        if (btn && links) {
            btn.addEventListener('click', () => {
                links.classList.toggle('mobile-open');
                btn.classList.toggle('active');
            });
        }
    </script>
</body>
</html>`;
  return html;
}

function generateIndeedFeed(jobs) {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<source>
  <publisher>${esc(COMPANY_NAME)}</publisher>
  <publisherurl>${SITE_URL}</publisherurl>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>\n`;
  for (const job of jobs) {
    xml += `  <job>
    <title><![CDATA[${job.title}]]></title>
    <date><![CDATA[${new Date(job.datePosted).toUTCString()}]]></date>
    <referencenumber><![CDATA[${job.refNumber}]]></referencenumber>
    <url><![CDATA[${job.jobUrl}]]></url>
    <company><![CDATA[${COMPANY_NAME}]]></company>
    <city><![CDATA[${job.location.replace(/-.*/, '')}]]></city>
    <state><![CDATA[${job.region}]]></state>
    <country><![CDATA[DE]]></country>
    <description><![CDATA[${getFeedHtmlDescription(job)}]]></description>
    <salary><![CDATA[${job.salary} € Brutto/Monat]]></salary>
    <jobtype><![CDATA[vollzeit]]></jobtype>
    <expirationdate><![CDATA[${job.validThrough}]]></expirationdate>
  </job>\n`;
  }
  xml += '</source>\n';
  return xml;
}

function generateJoobleFeed(jobs) {
  const today = new Date();
  const formatJoobleDate = (d) => {
    const date = new Date(d);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const pubDate = formatJoobleDate(today);
  const expireDate = formatJoobleDate(new Date(today.getTime() + (45 * 24 * 60 * 60 * 1000)));

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<jobs>\n`;

  for (const job of jobs) {
    xml += `  <job id="${job.refNumber}">
    <link><![CDATA[${job.jobUrl}]]></link>
    <name><![CDATA[${job.title}]]></name>
    <region><![CDATA[${job.location}]]></region>
    <description><![CDATA[${getFeedHtmlDescription(job)}]]></description>
    <pubdate>${pubDate}</pubdate>
    <updated>${pubDate}</updated>
    <salary><![CDATA[${job.salary}]]></salary>
    <company><![CDATA[${COMPANY_NAME}]]></company>
    <expire>${expireDate}</expire>
    <jobtype><![CDATA[full-time]]></jobtype>
  </job>\n`;
  }
  xml += '</jobs>\n';
  return xml;
}

function generateTalentFeed(jobs) {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<source>
  <publisher><![CDATA[${COMPANY_NAME}]]></publisher>
  <publisherurl><![CDATA[${SITE_URL}]]></publisherurl>
  <lastbuilddate>${new Date().toISOString()}</lastbuilddate>\n`;

  for (const job of jobs) {
    const tmpl = JOB_TEMPLATES.find(t => t.title === job.title);
    
    xml += `  <job>
    <title><![CDATA[${job.title}]]></title>
    <company><![CDATA[${COMPANY_NAME}]]></company>
    <city><![CDATA[${job.location.replace(/-.*/, '')}]]></city>
    <state><![CDATA[${job.region}]]></state>
    <country><![CDATA[DE]]></country>
    <dateposted><![CDATA[${job.datePosted}]]></dateposted>
    <expirationdate><![CDATA[${job.validThrough}]]></expirationdate>
    <referencenumber><![CDATA[${job.refNumber}]]></referencenumber>
    <url><![CDATA[${job.jobUrl}]]></url>
    <description><![CDATA[${getFeedHtmlDescription(job)}]]></description>
    <salary>
      <salary_min><![CDATA[${tmpl ? tmpl.salaryMin : ''}]]></salary_min>
      <salary_max><![CDATA[${tmpl ? tmpl.salaryMax : ''}]]></salary_max>
      <salary_currency><![CDATA[EUR]]></salary_currency>
      <period><![CDATA[month]]></period>
      <type><![CDATA[BASE_SALARY]]></type>
    </salary>
    <jobtype><![CDATA[full-time]]></jobtype>
  </job>\n`;
  }
  xml += '</source>\n';
  return xml;
}

// ============================================================
// MAIN
// ============================================================

function build() {
  console.log('🔨 Sicherheit-Karriere Job Builder v2.0 (Auto-Generator)');
  console.log('=========================================================\n');

  if (!fs.existsSync(TEMPLATE_PATH)) {
    console.error('❌ Template nicht gefunden:', TEMPLATE_PATH);
    process.exit(1);
  }
  const template = fs.readFileSync(TEMPLATE_PATH, 'utf-8');
  console.log('✅ Template geladen');

  console.log(`📋 ${JOB_TEMPLATES.length} Job-Typen × ${CITIES.length} Städte = ${JOB_TEMPLATES.length * CITIES.length} Seiten\n`);

  // Create jobs directory
  if (!fs.existsSync(JOBS_DIR)) fs.mkdirSync(JOBS_DIR, { recursive: true });
  // Clean old files
  fs.readdirSync(JOBS_DIR).filter(f => f.endsWith('.html')).forEach(f => fs.unlinkSync(path.join(JOBS_DIR, f)));

  // Generate
  const jobs = generateAllJobs(template);

  // Write files
  for (const job of jobs) {
    fs.writeFileSync(path.join(JOBS_DIR, `${job.slug}.html`), job.html, 'utf-8');
  }
  console.log(`✅ ${jobs.length} Job-Seiten generiert`);

  // Sitemap
  fs.writeFileSync(path.join(__dirname, 'sitemap.xml'), generateSitemap(jobs), 'utf-8');
  console.log('✅ sitemap.xml aktualisiert');

  // HTML Sitemap (Alle Jobs)
  fs.writeFileSync(path.join(__dirname, 'alle-jobs.html'), generateHtmlSitemap(jobs), 'utf-8');
  console.log('✅ alle-jobs.html generiert (HTML Sitemap)');

  // Indeed Feed
  fs.writeFileSync(path.join(__dirname, 'indeed-feed.xml'), generateIndeedFeed(jobs), 'utf-8');
  console.log('✅ indeed-feed.xml generiert (für Indeed)');

  // Talent.com Feed
  fs.writeFileSync(path.join(__dirname, 'talent-feed.xml'), generateTalentFeed(jobs), 'utf-8');
  console.log('✅ talent-feed.xml generiert (für Talent.com)');

  // Jooble Feed
  fs.writeFileSync(path.join(__dirname, 'jooble-feed.xml'), generateJoobleFeed(jobs), 'utf-8');
  console.log('✅ jooble-feed.xml generiert (für Jooble)');

  console.log(`\n=========================================================`);
  console.log(`🎉 Build abgeschlossen!`);
  console.log(`   ${jobs.length} Job-Seiten unter /jobs/`);
  console.log(`   ${JOB_TEMPLATES.length} Job-Typen × ${CITIES.length} Städte`);
  console.log(`   Alle Titel AGG-konform (m/w/d)`);
  console.log(`   ZSBV-Vermittlungshinweis auf jeder Seite`);
  console.log(`=========================================================\n`);
}

build();
