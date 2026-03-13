/**
 * Sicherheit-Karriere – Scroll Animations & Interactivity
 * Inspired by jeskojets.com with ZSBV branding
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initRevealAnimations();
  initParallax();
  initCounterAnimations();
  initSmoothScroll();
  initMobileMenu();
});

function initNavbar() {
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.pageYOffset > 80);
  }, { passive: true });
}

function initRevealAnimations() {
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('active');
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
  reveals.forEach(el => observer.observe(el));
}

function initParallax() {
  const parallaxElements = document.querySelectorAll('[data-parallax]');
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        parallaxElements.forEach(el => {
          const speed = parseFloat(el.dataset.parallax) || 0.3;
          const offset = (el.getBoundingClientRect().top - window.innerHeight) * speed;
          el.style.transform = `translateY(${offset}px)`;
        });
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

function initCounterAnimations() {
  const counters = document.querySelectorAll('[data-counter]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(el => observer.observe(el));
}

function animateCounter(el) {
  const target = parseInt(el.dataset.counter, 10);
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';
  const duration = 2000;
  const startTime = performance.now();
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = prefix + Math.floor(eased * target).toLocaleString('de-DE') + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}


function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        window.scrollTo({ top: target.getBoundingClientRect().top + window.pageYOffset - 80, behavior: 'smooth' });
        // Close mobile overlay if open
        const overlay = document.getElementById('zsbv-mobile-overlay');
        const menuBtn = document.querySelector('.nav-menu-btn');
        if (overlay) overlay.classList.remove('open');
        if (menuBtn) menuBtn.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });
}

function initMobileMenu() {
  const btn = document.querySelector('.nav-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  if (!btn || !navLinks) return;

  // Create a body-level overlay (escapes navbar's stacking context)
  const overlay = document.createElement('div');
  overlay.id = 'zsbv-mobile-overlay';

  // Clone nav links into overlay
  const linksUl = document.createElement('ul');
  navLinks.querySelectorAll('li').forEach(li => {
    const clone = li.cloneNode(true);
    linksUl.appendChild(clone);
  });
  overlay.appendChild(linksUl);

  // Inject overlay styles
  const style = document.createElement('style');
  style.textContent = `
    #zsbv-mobile-overlay {
      display: none;
      position: fixed;
      top: 0; left: 0;
      width: 100%; height: 100%;
      background: #060E1A;
      z-index: 10000;
      justify-content: center;
      align-items: center;
      padding: 0 40px;
    }
    #zsbv-mobile-overlay.open {
      display: flex;
      animation: zsbvOverlayIn 0.3s ease-out;
    }
    @keyframes zsbvOverlayIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    #zsbv-mobile-overlay ul {
      list-style: none;
      padding: 0; margin: 0;
      width: 100%;
      text-align: center;
    }
    #zsbv-mobile-overlay li a {
      display: block;
      font-size: 20px;
      letter-spacing: 3px;
      text-transform: uppercase;
      padding: 22px 0;
      color: #B0B8C8;
      text-decoration: none;
      transition: color 0.3s;
      font-family: 'Montserrat', sans-serif;
      font-weight: 600;
      border-bottom: 1px solid rgba(200, 168, 78, 0.08);
    }
    #zsbv-mobile-overlay li:last-child a {
      border-bottom: none;
    }
    #zsbv-mobile-overlay li a:hover {
      color: #C8A84E;
    }
    @media (min-width: 769px) {
      #zsbv-mobile-overlay { display: none !important; }
    }
  `;
  document.head.appendChild(style);
  document.body.appendChild(overlay);

  // Close overlay links on click
  overlay.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      overlay.classList.remove('open');
      btn.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  btn.addEventListener('click', () => {
    const isOpen = overlay.classList.toggle('open');
    btn.classList.toggle('active');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
}

/* ===== APPLICATION MODAL ===== */
function openModal(btn) {
  const card = btn.closest('.job-card');
  const jobTitle = card ? card.querySelector('.job-title').textContent.replace(/\u00AD/g, '') : '';
  const jobIcon = card ? (card.querySelector('.job-icon')?.textContent || '') : '';
  const jobSalary = card ? (card.querySelector('.salary-amount')?.textContent || '') : '';
  const jobLocation = card ? (card.querySelector('.job-location')?.textContent || '') : '';
  const jobBadge = card ? (card.querySelector('.job-badge')?.textContent || '') : '';
  const jobDetails = card ? [...card.querySelectorAll('.job-details li')].map(li => li.textContent).join(' | ') : '';

  // Render job info as single line
  const modalCard = document.getElementById('modalJobCard');
  modalCard.textContent = `${jobTitle} – ${jobSalary} Brutto/Monat – ${jobLocation}`;

  // Set hidden fields for email
  document.getElementById('hiddenJobTitle').value = jobTitle;
  document.getElementById('hiddenSubject').value = 'Neue Bewerbung: ' + jobTitle;
  document.getElementById('hiddenLocation').value = jobLocation;
  document.getElementById('hiddenSalary').value = jobSalary;

  document.getElementById('applyModal').classList.add('active');
  document.body.style.overflow = 'hidden';

  // Reset form
  document.getElementById('applyForm').style.display = '';
  document.getElementById('modalSuccess').style.display = 'none';
  document.getElementById('applyForm').reset();
  // Re-set hidden fields after reset
  document.getElementById('hiddenJobTitle').value = jobTitle;
  document.getElementById('hiddenSubject').value = 'Neue Bewerbung: ' + jobTitle;
  document.getElementById('hiddenLocation').value = jobLocation;
  document.getElementById('hiddenSalary').value = jobSalary;
  document.getElementById('agenturGroup').style.display = 'none';
  const fl = document.getElementById('fileLabel');
  if (fl) { fl.innerHTML = '<span>📎</span> Datei auswählen oder hierher ziehen'; fl.classList.remove('has-file'); }
}

function openJobModal(jobTitle, jobLocation, jobSalary) {
  // Render job info as single line
  const modalCard = document.getElementById('modalJobCard');
  if (modalCard) {
    modalCard.textContent = `${jobTitle} – ${jobSalary} Brutto/Monat – ${jobLocation}`;
  }

  // Set hidden fields
  document.getElementById('hiddenJobTitle').value = jobTitle;
  document.getElementById('hiddenSubject').value = 'Neue Bewerbung: ' + jobTitle;
  document.getElementById('hiddenLocation').value = jobLocation;
  document.getElementById('hiddenSalary').value = jobSalary;

  document.getElementById('applyModal').classList.add('active');
  document.body.style.overflow = 'hidden';

  // Reset form
  document.getElementById('applyForm').style.display = '';
  document.getElementById('modalSuccess').style.display = 'none';
  document.getElementById('applyForm').reset();

  // Re-set fields after reset
  document.getElementById('hiddenJobTitle').value = jobTitle;
  document.getElementById('hiddenSubject').value = 'Neue Bewerbung: ' + jobTitle;
  document.getElementById('hiddenLocation').value = jobLocation;
  document.getElementById('hiddenSalary').value = jobSalary;
  document.getElementById('agenturGroup').style.display = 'none';
  const fl = document.getElementById('fileLabel');
  if (fl) { fl.innerHTML = '<span>📎</span> Datei auswählen oder hierher ziehen'; fl.classList.remove('has-file'); }
}

function closeModal() {
  document.getElementById('applyModal').classList.remove('active');
  document.body.style.overflow = '';
}

function toggleAgentur(show) {
  const g = document.getElementById('agenturGroup');
  g.style.display = show ? '' : 'none';
  const radios = g.querySelectorAll('input[type="radio"]');
  radios.forEach(r => r.required = show);
}

function showFileName(input) {
  const label = document.getElementById('fileLabel');
  const maxMB = 10;
  if (input.files.length > 0) {
    const file = input.files[0];
    const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
    if (file.size > maxMB * 1024 * 1024) {
      label.innerHTML = '<span style="color:#e74c3c;">❌ Datei zu groß (' + sizeMB + ' MB). Max. ' + maxMB + ' MB erlaubt.</span>';
      label.classList.remove('has-file');
      input.value = '';
      return;
    }
    label.textContent = '✅ ' + file.name + ' (' + sizeMB + ' MB)';
    label.classList.add('has-file');
  }
}

function submitForm(e) {
  e.preventDefault();
  const form = document.getElementById('applyForm');
  const submitBtn = form.querySelector('.form-submit');
  submitBtn.textContent = 'Wird gesendet...';
  submitBtn.disabled = true;

  // Check file size (Netlify limit: 10 MB)
  const fileInput = document.getElementById('cvFile');
  if (fileInput.files.length > 0 && fileInput.files[0].size > 10485760) {
    alert('Die Datei ist zu groß. Maximale Größe: 10 MB.');
    submitBtn.textContent = 'Bewerbung absenden →';
    submitBtn.disabled = false;
    return;
  }

  const formData = new FormData(form);

  fetch('/', {
    method: 'POST',
    body: formData,
  })
    .then(response => {
      if (response.ok) {
        form.style.display = 'none';
        document.getElementById('modalSuccess').innerHTML = `
          <div class="success-icon">✓</div>
          <h3>Bewerbung gesendet!</h3>
          <p>Vielen Dank! Ihre Bewerbung inkl. Lebenslauf wurde erfolgreich übermittelt. Wir melden uns innerhalb von 24 Stunden bei Ihnen.</p>
          <button class="form-submit" onclick="closeModal()" style="margin-top:24px;">Schließen</button>
        `;
        document.getElementById('modalSuccess').style.display = '';
      } else {
        alert('Fehler beim Senden. Bitte versuchen Sie es erneut.');
      }
    })
    .catch(error => {
      console.error('Form error:', error);
      alert('Verbindungsfehler. Bitte stellen Sie sicher, dass Sie online sind.');
    })
    .finally(() => {
      submitBtn.textContent = 'Bewerbung absenden →';
      submitBtn.disabled = false;
    });
}

// Close modal on Escape or overlay click
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
document.addEventListener('click', (e) => { if (e.target.id === 'applyModal') closeModal(); });

/* ===== PLZ SEARCH & DYNAMIC JOB GENERATION ===== */
const JOB_TEMPLATES = [
  { title: 'Wachschutz\u00ADmitarbeiter (m/w/d)', badge: 'Quereinsteiger', badgeClass: '', salaryMin: 2620, salaryMax: 2850, details: ['Kein Vorwissen erforderlich', '§34a Qualifizierung inklusive', 'Sofortiger Einstieg möglich', 'Unbefristeter Arbeitsvertrag'] },
  { title: 'Sicherheits\u00ADmitarbeiter (m/w/d)', badge: 'Quereinsteiger', badgeClass: '', salaryMin: 2620, salaryMax: 2850, details: ['Quereinsteiger willkommen', 'Objekt- & Werkschutz', 'Schichtzulagen inklusive', 'Job-Garantie vor Kursstart'] },
  { title: 'ÖPNV-Sicherheits\u00ADkraft (m/w/d)', badge: 'Quereinsteiger', badgeClass: '', salaryMin: 2850, salaryMax: 3200, details: ['Kein Vorwissen erforderlich', 'ÖPNV-Sicherheitsdienst', 'Firmenticket inklusive', 'Erhöhtes Risiko – Zulagen inkl.'] },
  { title: 'Geld- & Werttransport (m/w/d)', badge: 'Quereinsteiger', badgeClass: '', salaryMin: 3200, salaryMax: 3800, details: ['Waffensachkunde wird geschult', 'Überdurchschnittl. Vergütung', 'Sicherheitsüberprüfung nötig', 'Verantwortungsvolle Aufgabe'] },
  { title: 'Revierwachmann/-frau (m/w/d)', badge: 'Quereinsteiger', badgeClass: '', salaryMin: 2770, salaryMax: 3030, details: ['Kontrollgänge & Streifendienst', '§34a Qualifizierung inklusive', 'Führerschein erforderlich', 'Dienstfahrzeug wird gestellt'] },
  { title: 'Empfangskraft Sicherheit (m/w/d)', badge: 'Quereinsteiger', badgeClass: '', salaryMin: 2680, salaryMax: 3100, details: ['Empfang & Zugangskontrolle', 'Repräsentative Objekte', 'Geregelte Tagesarbeitszeiten', 'Höher bei Fremdsprachenkenntnissen'] },
  { title: 'Veranstaltungs\u00ADschutz (m/w/d)', badge: 'Quereinsteiger', badgeClass: '', salaryMin: 2500, salaryMax: 2770, details: ['Konzerte, Messen & Events', 'Flexible Einsatzzeiten', 'Teamarbeit', 'Geringere Einstiegshürden'] },
  { title: 'Objektschutz\u00ADmitarbeiter (m/w/d)', badge: 'Quereinsteiger', badgeClass: '', salaryMin: 2620, salaryMax: 2850, details: ['Industrieobjekte & Baustellen', '24/7 Schichtbetrieb', 'Zuschläge bei Nachtschicht', 'Übernahme durch Kunden möglich'] },
  { title: 'Personenschutz (m/w/d)', badge: 'Quereinsteiger', badgeClass: '', salaryMin: 3200, salaryMax: 3800, details: ['VIP-Begleitung', 'Erweiterte Sicherheitsausbildung', 'Diskretes Auftreten', 'Überdurchschnittl. Vergütung'] },
  { title: 'Werkschutz\u00ADmitarbeiter (m/w/d)', badge: 'Quereinsteiger', badgeClass: '', salaryMin: 2620, salaryMax: 2850, details: ['Industriegelände sichern', 'Zutrittskontrolle', 'Schichtsystem (3-Schicht)', 'Betriebliche Altersvorsorge'] },
  { title: 'Brandwache (m/w/d)', badge: 'Quereinsteiger', badgeClass: '', salaryMin: 2770, salaryMax: 3030, details: ['Brandschutz auf Baustellen', 'Kurze Einsatzdauer', 'Streifendienst-Vergütung', 'Flexible Buchung'] },
  { title: 'Einzelhandels\u00ADdetektiv/-in (m/w/d)', badge: 'Quereinsteiger', badgeClass: '', salaryMin: 2620, salaryMax: 2850, details: ['Ladendiebstahl verhindern', 'Zivile Einsatzkleidung', 'Einkaufszentren & Kaufhäuser', 'Objektschutz-Tarif'] },
  { title: 'Pfortendienst (m/w/d)', badge: 'Quereinsteiger', badgeClass: '', salaryMin: 2620, salaryMax: 2850, details: ['Ein- & Ausgangskontrolle', 'Schlüsselverwaltung', 'Feste Standorte', 'Ruhiger Arbeitsplatz'] },
  { title: 'Flughafen\u00ADsicherheit (m/w/d)', badge: 'Quereinsteiger', badgeClass: '', salaryMin: 3200, salaryMax: 3800, details: ['Passagier- & Gepäckkontrolle', 'Luftsicherheitsassistent/-in', 'Zuverlässigkeitsüberprüfung', 'Tarifvertrag Luftsicherheit'] },
  { title: 'Mobiler Sicherheits\u00ADdienst (m/w/d)', badge: 'Quereinsteiger', badgeClass: '', salaryMin: 2770, salaryMax: 3030, details: ['Alarmverfolgungsfahrten', 'Fahrzeug wird gestellt', 'Führerschein erforderlich', 'Eigenverantwortliches Arbeiten'] },
  { title: 'Bahnsicherheit (m/w/d)', badge: 'Quereinsteiger', badgeClass: '', salaryMin: 2850, salaryMax: 3200, details: ['Sicherheit im Nahverkehr', 'DB-Sicherheit Partner', 'Firmenticket inklusive', 'Erhöhtes Risiko – Zulagen inkl.'] },
];

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
  '36': ['Fulda', 'Bad Hersfeld', 'Hünfeld', 'Eichenzell', 'Petersberg', 'Künzell', 'Neuhof'],
  '38': ['Braunschweig', 'Wolfsburg', 'Salzgitter', 'Gifhorn', 'Peine', 'Helmstedt', 'Wolfenbüttel'],
  '39': ['Magdeburg', 'Schönebeck', 'Haldensleben', 'Wolmirstedt', 'Burg', 'Stendal', 'Oschersleben'],
  '40': ['Düsseldorf-Mitte', 'Düsseldorf-Bilk', 'Düsseldorf-Oberkassel', 'Neuss', 'Ratingen', 'Meerbusch', 'Erkrath', 'Hilden'],
  '41': ['Mönchengladbach', 'Viersen', 'Korschenbroich', 'Grevenbroich', 'Erkelenz', 'Jüchen', 'Wegberg'],
  '42': ['Wuppertal', 'Solingen', 'Remscheid', 'Velbert', 'Haan', 'Schwelm', 'Mettmann'],
  '44': ['Dortmund', 'Unna', 'Lünen', 'Schwerte', 'Holzwickede', 'Kamen', 'Bergkamen', 'Castrop-Rauxel'],
  '45': ['Essen', 'Mülheim a.d.R.', 'Gelsenkirchen', 'Oberhausen', 'Bottrop', 'Bochum', 'Gladbeck', 'Herne'],
  '46': ['Oberhausen', 'Dinslaken', 'Wesel', 'Voerde', 'Bottrop', 'Moers', 'Kamp-Lintfort'],
  '47': ['Duisburg', 'Moers', 'Krefeld', 'Rheinhausen', 'Homberg', 'Kleve', 'Xanten'],
  '48': ['Münster', 'Greven', 'Emsdetten', 'Steinfurt', 'Warendorf', 'Telgte', 'Lengerich'],
  '50': ['Köln-Innenstadt', 'Köln-Ehrenfeld', 'Köln-Nippes', 'Hürth', 'Brühl', 'Frechen', 'Pulheim', 'Bergisch Gladbach'],
  '51': ['Köln-Deutz', 'Leverkusen', 'Bergisch Gladbach', 'Overath', 'Rösrath', 'Odenthal', 'Burscheid'],
  '53': ['Bonn', 'Bad Godesberg', 'Siegburg', 'Troisdorf', 'Sankt Augustin', 'Königswinter', 'Hennef', 'Meckenheim'],
  '54': ['Trier', 'Konz', 'Schweich', 'Wittlich', 'Hermeskeil', 'Bitburg', 'Saarburg'],
  '55': ['Mainz', 'Wiesbaden', 'Ingelheim', 'Bingen', 'Bad Kreuznach', 'Alzey', 'Nieder-Olm'],
  '56': ['Koblenz', 'Neuwied', 'Andernach', 'Bendorf', 'Lahnstein', 'Mayen', 'Vallendar'],
  '57': ['Siegen', 'Kreuztal', 'Netphen', 'Freudenberg', 'Olpe', 'Attendorn', 'Lennestadt'],
  '58': ['Hagen', 'Iserlohn', 'Lüdenscheid', 'Altena', 'Wetter', 'Herdecke', 'Schwerte'],
  '59': ['Hamm', 'Ahlen', 'Beckum', 'Werne', 'Lippstadt', 'Soest', 'Bönen'],
  '60': ['Frankfurt-Mitte', 'Frankfurt-Sachsenhausen', 'Frankfurt-Bornheim', 'Offenbach', 'Neu-Isenburg', 'Eschborn', 'Bad Vilbel'],
  '61': ['Bad Homburg', 'Friedberg', 'Oberursel', 'Friedrichsdorf', 'Usingen', 'Rosbach', 'Karben'],
  '63': ['Offenbach', 'Hanau', 'Mühlheim', 'Obertshausen', 'Rodgau', 'Dietzenbach', 'Dreieich', 'Langen'],
  '64': ['Darmstadt', 'Weiterstadt', 'Griesheim', 'Pfungstadt', 'Bensheim', 'Dieburg', 'Groß-Gerau'],
  '65': ['Wiesbaden', 'Mainz-Kastel', 'Taunusstein', 'Bad Schwalbach', 'Idstein', 'Rüdesheim', 'Eltville'],
  '66': ['Saarbrücken', 'Völklingen', 'Püttlingen', 'Sulzbach', 'Friedrichsthal', 'Dudweiler', 'St. Ingbert', 'Homburg'],
  '68': ['Mannheim', 'Ludwigshafen', 'Heidelberg', 'Weinheim', 'Schwetzingen', 'Viernheim', 'Ladenburg'],
  '69': ['Heidelberg', 'Wiesloch', 'Leimen', 'Eppelheim', 'Sandhausen', 'Dossenheim', 'Neckargemünd'],
  '70': ['Stuttgart-Mitte', 'Stuttgart-West', 'Stuttgart-Süd', 'Esslingen', 'Fellbach', 'Korntal', 'Gerlingen', 'Leonberg'],
  '71': ['Böblingen', 'Sindelfingen', 'Herrenberg', 'Leonberg', 'Renningen', 'Holzgerlingen', 'Waldenbuch'],
  '72': ['Tübingen', 'Reutlingen', 'Metzingen', 'Rottenburg', 'Nürtingen', 'Pfullingen', 'Dettenhausen'],
  '73': ['Esslingen', 'Göppingen', 'Kirchheim', 'Plochingen', 'Ostfildern', 'Nellingen', 'Wendlingen'],
  '74': ['Heilbronn', 'Neckarsulm', 'Weinsberg', 'Bad Friedrichshall', 'Öhringen', 'Mosbach', 'Sinsheim'],
  '75': ['Pforzheim', 'Königsbach-Stein', 'Ispringen', 'Birkenfeld', 'Neuenbürg', 'Remchingen', 'Straubenhardt'],
  '76': ['Karlsruhe', 'Ettlingen', 'Bruchsal', 'Rastatt', 'Rheinstetten', 'Stutensee', 'Bretten'],
  '78': ['Konstanz', 'Singen', 'Radolfzell', 'Friedrichshafen', 'Tuttlingen', 'Rottweil', 'Stockach'],
  '79': ['Freiburg', 'Emmendingen', 'Bad Krozingen', 'Breisach', 'March', 'Gundelfingen', 'Müllheim'],
  '80': ['München-Mitte', 'München-Schwabing', 'München-Haidhausen', 'Freising', 'Dachau', 'Ismaning', 'Unterföhring', 'Garching'],
  '81': ['München-Bogenhausen', 'München-Riem', 'München-Giesing', 'Unterhaching', 'Ottobrunn', 'Neubiberg', 'Haar'],
  '82': ['Starnberg', 'Geretsried', 'Wolfratshausen', 'Gauting', 'Tutzing', 'Berg', 'Gilching'],
  '83': ['Rosenheim', 'Bad Aibling', 'Kolbermoor', 'Brannenburg', 'Wasserburg', 'Prien', 'Traunstein'],
  '84': ['Landshut', 'Ergolding', 'Altdorf', 'Vilsbiburg', 'Moosburg', 'Dingolfing', 'Landau'],
  '85': ['Freising', 'Erding', 'Unterschleißheim', 'Oberschleißheim', 'Neufahrn', 'Eching', 'Hallbergmoos'],
  '86': ['Augsburg', 'Friedberg', 'Königsbrunn', 'Gersthofen', 'Neusäß', 'Stadtbergen', 'Bobingen'],
  '87': ['Kempten', 'Sonthofen', 'Immenstadt', 'Oberstdorf', 'Durach', 'Waltenhofen', 'Buchenberg'],
  '88': ['Ravensburg', 'Weingarten', 'Friedrichshafen', 'Lindau', 'Wangen', 'Tettnang', 'Markdorf'],
  '89': ['Ulm', 'Neu-Ulm', 'Blaustein', 'Erbach', 'Ehingen', 'Laupheim', 'Biberach'],
  '90': ['Nürnberg-Mitte', 'Nürnberg-Süd', 'Fürth', 'Schwabach', 'Stein', 'Oberasbach', 'Zirndorf', 'Erlangen'],
  '91': ['Erlangen', 'Herzogenaurach', 'Forchheim', 'Baiersdorf', 'Höchstadt', 'Eckental', 'Uttenreuth'],
  '93': ['Regensburg', 'Neutraubling', 'Lappersdorf', 'Tegernheim', 'Nittendorf', 'Pentling', 'Sinzing'],
  '94': ['Passau', 'Freyung', 'Vilshofen', 'Hauzenberg', 'Grafenau', 'Waldkirchen', 'Pocking'],
  '95': ['Bayreuth', 'Kulmbach', 'Pegnitz', 'Creußen', 'Hollfeld', 'Bindlach', 'Eckersdorf'],
  '96': ['Bamberg', 'Hallstadt', 'Bischberg', 'Strullendorf', 'Hirschaid', 'Memmelsdorf', 'Lichtenfels'],
  '97': ['Würzburg', 'Veitshöchheim', 'Höchberg', 'Gerbrunn', 'Randersacker', 'Zell', 'Ochsenfurt'],
  '99': ['Erfurt', 'Weimar', 'Gotha', 'Arnstadt', 'Sömmerda', 'Bad Langensalza', 'Mühlhausen'],
  '01': ['Dresden-Altstadt', 'Dresden-Neustadt', 'Radebeul', 'Freital', 'Pirna', 'Meißen', 'Coswig', 'Heidenau'],
  '04': ['Leipzig-Mitte', 'Leipzig-Connewitz', 'Leipzig-Plagwitz', 'Markkleeberg', 'Taucha', 'Schkeuditz', 'Markranstädt', 'Borna'],
  '06': ['Halle', 'Merseburg', 'Weinberg', 'Kröllwitz', 'Ammendorf', 'Nietleben', 'Landsberg'],
  '07': ['Jena', 'Gera', 'Apolda', 'Stadtroda', 'Kahla', 'Eisenberg', 'Hermsdorf'],
  '09': ['Chemnitz', 'Freiberg', 'Zwickau', 'Limbach-Oberfrohna', 'Mittweida', 'Flöha', 'Frankenberg'],
  '17': ['Rostock', 'Greifswald', 'Stralsund', 'Wismar', 'Güstrow', 'Bad Doberan', 'Ribnitz-Damgarten'],
  '18': ['Rostock-Warnemünde', 'Rostock-Mitte', 'Bentwisch', 'Broderstorf', 'Sanitz', 'Rövershagen', 'Papendorf'],
  '23': ['Lübeck', 'Bad Schwartau', 'Travemünde', 'Stockelsdorf', 'Ratekau', 'Eutin', 'Neustadt'],
  '24': ['Kiel', 'Kronshagen', 'Altenholz', 'Molfsee', 'Laboe', 'Rendsburg', 'Eckernförde', 'Neumünster'],
  '26': ['Oldenburg', 'Rastede', 'Bad Zwischenahn', 'Westerstede', 'Edewecht', 'Wardenburg', 'Wiefelstede'],
  '27': ['Bremerhaven', 'Cuxhaven', 'Langen', 'Nordenham', 'Geestland', 'Schiffdorf', 'Loxstedt'],
  '28': ['Bremen-Mitte', 'Bremen-Neustadt', 'Delmenhorst', 'Stuhr', 'Weyhe', 'Achim', 'Lilienthal', 'Schwanewede'],
};

// Map PLZ prefix to Bundesland for Google for Jobs
function getRegionFromPLZ(plz) {
  const p2 = plz.substring(0, 2);
  const map = {
    '01': 'SN', '02': 'SN', '03': 'BB', '04': 'SN', '06': 'ST', '07': 'TH', '08': 'SN', '09': 'SN',
    '10': 'BE', '12': 'BE', '13': 'BE', '14': 'BB', '15': 'BB', '16': 'BB', '17': 'MV', '18': 'MV', '19': 'MV',
    '20': 'HH', '21': 'HH', '22': 'HH', '23': 'SH', '24': 'SH', '25': 'SH', '26': 'NI', '27': 'NI', '28': 'HB', '29': 'NI',
    '30': 'NI', '31': 'NI', '32': 'NW', '33': 'NW', '34': 'HE', '35': 'HE', '36': 'HE', '37': 'NI', '38': 'NI', '39': 'ST',
    '40': 'NW', '41': 'NW', '42': 'NW', '44': 'NW', '45': 'NW', '46': 'NW', '47': 'NW', '48': 'NW', '49': 'NI',
    '50': 'NW', '51': 'NW', '52': 'NW', '53': 'NW', '54': 'RP', '55': 'RP', '56': 'RP', '57': 'NW', '58': 'NW', '59': 'NW',
    '60': 'HE', '61': 'HE', '63': 'HE', '64': 'HE', '65': 'HE', '66': 'SL', '67': 'RP', '68': 'BW', '69': 'BW',
    '70': 'BW', '71': 'BW', '72': 'BW', '73': 'BW', '74': 'BW', '75': 'BW', '76': 'BW', '77': 'BW', '78': 'BW', '79': 'BW',
    '80': 'BY', '81': 'BY', '82': 'BY', '83': 'BY', '84': 'BY', '85': 'BY', '86': 'BY', '87': 'BY', '88': 'BW', '89': 'BW',
    '90': 'BY', '91': 'BY', '92': 'BY', '93': 'BY', '94': 'BY', '95': 'BY', '96': 'BY', '97': 'BY', '98': 'TH', '99': 'TH',
  };
  return map[p2] || 'DE';
}

// Fallback nearby generator for unknown PLZ
function getNearbyCities(plz) {
  const p2 = plz.substring(0, 2);
  if (PLZ_NEARBY[p2]) return PLZ_NEARBY[p2];
  // generic fallback
  return ['Ihre Stadt', 'Umgebung', 'Nachbarort', 'Region Mitte', 'Region Nord', 'Region Süd'];
}

function getCityFromPLZ(plz) {
  const cities = getNearbyCities(plz);
  return cities[0].replace(/-.*/, ''); // main city name for the hint text
}

function seededRandom(seed) {
  let s = parseInt(seed, 10) || 12345;
  return function () { s = (s * 16807 + 0) % 2147483647; return (s - 1) / 2147483646; };
}

function generateJobs(plz) {
  const rng = seededRandom(plz);
  const nearbyCities = getNearbyCities(plz);
  const count = 10 + Math.floor(rng() * 6); // 10-15 jobs
  const shuffled = [...JOB_TEMPLATES].sort(() => rng() - 0.5);
  const jobs = [];
  for (let i = 0; i < count; i++) {
    const tmpl = shuffled[i % shuffled.length];
    const salaryVar = Math.floor(rng() * 400) - 200;
    const salMin = tmpl.salaryMin + salaryVar;
    const salMax = tmpl.salaryMax + salaryVar;
    const isFeatured = i < 2;
    // Pick a different city from nearby list for each job
    const cityIndex = Math.floor(rng() * nearbyCities.length);
    const jobCity = nearbyCities[cityIndex];
    // Closer cities first, farther cities later
    const baseDist = (cityIndex / nearbyCities.length) * 20;
    const dist = (baseDist + rng() * 8 + 0.5).toFixed(1);
    jobs.push({
      ...tmpl, city: jobCity,
      salary: salMin === salMax ? `${salMin.toLocaleString('de-DE')} €` : `${salMin.toLocaleString('de-DE')} – ${salMax.toLocaleString('de-DE')} €`,
      featured: isFeatured,
      distance: dist,
    });
  }
  // Sort by distance
  jobs.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
  // Re-mark first 2 as featured after sort
  jobs.forEach((j, i) => j.featured = i < 2);
  return jobs;
}

function renderJobs(jobs, plz) {
  const grid = document.getElementById('jobsGrid');
  grid.innerHTML = '';
  const hint = document.getElementById('plzHint');
  const city = getCityFromPLZ(plz);
  hint.innerHTML = `<span class="plz-city">${jobs.length} Stellen</span> in der Nähe von <span class="plz-city">${city}</span> (PLZ ${plz})`;

  // === Google for Jobs: JSON-LD JobPosting ===
  const today = new Date();
  const datePosted = today.toISOString().split('T')[0];
  const validDate = new Date(today);
  validDate.setDate(validDate.getDate() + 60);
  const validThrough = validDate.toISOString().split('T')[0];

  const jobPostings = jobs.map(job => {
    const salaryParts = job.salary.replace(/[^\d–\-]/g, '').split(/[–\-]/);
    const salaryMin = parseInt(salaryParts[0], 10) || 0;
    const salaryMax = parseInt(salaryParts[1], 10) || salaryMin;

    return {
      "@type": "JobPosting",
      "title": job.title,
      "description": `<p>${job.title} – ${job.details.join('. ')}. Gehalt: ${job.salary} Brutto/Monat. Standort: ${job.city}.</p><p>Quereinsteiger willkommen! Kostenlose Qualifizierung über Bildungsgutschein inkl. §34a Sachkundeprüfung. Garantierter Arbeitsplatz nach bestandener Prüfung.</p>`,
      "datePosted": datePosted,
      "validThrough": validThrough + "T23:59:59+01:00",
      "employmentType": "FULL_TIME",
      "hiringOrganization": {
        "@type": "Organization",
        "name": "ZSBV – Zentralstelle für Sichere Bildungs-Vermittlung",
        "sameAs": "https://www.sicherheit-karriere.de",
        "logo": "https://www.sicherheit-karriere.de/images/logo.png"
      },
      "jobLocation": {
        "@type": "Place",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": job.city.replace(/-.*/, ''),
          "postalCode": plz,
          "addressRegion": getRegionFromPLZ(plz),
          "addressCountry": "DE"
        }
      },
      "baseSalary": {
        "@type": "MonetaryAmount",
        "currency": "EUR",
        "value": {
          "@type": "QuantitativeValue",
          "minValue": salaryMin,
          "maxValue": salaryMax,
          "unitText": "MONTH"
        }
      },
      "applicantLocationRequirements": {
        "@type": "Country",
        "name": "Deutschland"
      },
      "jobBenefits": "Kostenlose Qualifizierung, §34a Sachkundeprüfung inklusive, Garantierter Arbeitsplatz, Bildungsgutschein möglich",
      "directApply": true
    };
  });

  // Remove old JSON-LD if exists & inject new one
  const oldScript = document.getElementById('jobPostingSchema');
  if (oldScript) oldScript.remove();

  const schemaScript = document.createElement('script');
  schemaScript.type = 'application/ld+json';
  schemaScript.id = 'jobPostingSchema';
  schemaScript.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": jobPostings
  });
  document.head.appendChild(schemaScript);

  // === Render job cards ===
  jobs.forEach((job, i) => {
    const card = document.createElement('div');
    card.className = `job-card${job.featured ? ' featured' : ''}`;
    card.style.cssText = `--i:${i}; opacity:0; transform:translateY(30px);`;
    card.innerHTML = `
      <div class="job-badge ${job.badgeClass}">${job.badge}</div>
      <h3 class="job-title">${job.title}</h3>
      <div class="job-location">${job.city} · ${job.distance} km</div>
      <div class="job-salary">
        <span class="salary-amount">${job.salary}</span>
        <span class="salary-label">Brutto / Monat</span>
      </div>
      <ul class="job-details">
        ${job.details.map(d => `<li>${d}</li>`).join('')}
      </ul>
      <button class="job-apply-btn" onclick="openModal(this)">Jetzt bewerben →</button>
    `;
    grid.appendChild(card);
    setTimeout(() => { card.style.transition = 'all 0.5s cubic-bezier(0.4,0,0.2,1)'; card.style.opacity = '1'; card.style.transform = 'translateY(0)'; }, 60 * i);
  });
}

function searchJobs() {
  const input = document.getElementById('plzInput');
  const plz = input.value.trim();
  if (!plz || plz.length < 4) {
    document.getElementById('plzHint').innerHTML = '<span style="color:#e74c3c;">Bitte geben Sie eine gültige PLZ ein (mind. 4 Stellen).</span>';
    return;
  }
  const jobs = generateJobs(plz);
  renderJobs(jobs, plz);
  document.getElementById('jobsGrid').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function getLocation() {
  const btn = document.getElementById('locationBtn');
  if (btn) btn.classList.add('loading');
  const hint = document.getElementById('plzHint');

  if (!navigator.geolocation) {
    if (btn) btn.classList.remove('loading');
    if (hint) hint.innerHTML = 'Standortdienste nicht verfügbar. Bitte PLZ manuell eingeben.';
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      try {
        const resp = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json&zoom=18&addressdetails=1`);
        const data = await resp.json();
        const plz = data.address?.postcode || '';
        if (plz) {
          document.getElementById('plzInput').value = plz;
          searchJobs();
        } else {
          if (hint) hint.innerHTML = 'PLZ konnte nicht ermittelt werden. Bitte manuell eingeben.';
        }
      } catch (e) {
        const roughPLZ = String(Math.floor(pos.coords.latitude * 100) % 100000).padStart(5, '0');
        document.getElementById('plzInput').value = roughPLZ;
        searchJobs();
      }
      if (btn) btn.classList.remove('loading');
    },
    () => {
      if (btn) btn.classList.remove('loading');
      // User denied location – show no jobs, just the search bar
      if (hint) hint.innerHTML = '📍 Standort nicht freigegeben – geben Sie Ihre PLZ ein, um Stellen zu finden.';
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );
}

// Auto-request location on page load + Enter key for search
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('plzInput');
  if (input) input.addEventListener('keydown', (e) => { if (e.key === 'Enter') searchJobs(); });

  // Auto-detect location on page load
  setTimeout(() => { getLocation(); }, 800);
});
