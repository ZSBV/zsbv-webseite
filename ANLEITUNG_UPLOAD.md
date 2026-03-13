# 🚀 ZSBV Upload-Anleitung (GitHub & Netlify)

Diese Anleitung erklärt dir kurz, wie du Änderungen an deiner Webseite veröffentlichst.

## 1. Automatische Updates (Der Bot)
**Du musst nichts tun.** 
Alle 3 Tage nachts aktualisiert ein automatisches Programm bei GitHub alle Job-Daten (Datum etc.). Netlify übernimmt diese Änderungen sofort.

## 2. Manuelle Änderungen (Lokal -> Web)
Wenn wir hier gemeinsam etwas am Design oder an den Texten ändern, gehen wir so vor:

1. **Speichern:** Ich speichere die Dateien auf deinem Mac.
2. **Terminal-Befehl:** Du öffnest das Terminal im Ordner `ZSBV_WEBSEITE_UPLOAD`.
3. **Hochladen:** Gib diese drei Befehle nacheinander ein:

```bash
git add .
git commit -m "Änderungen an der Webseite"
git push
```

## 3. Passwort / Token
Wenn das Terminal nach einem Passwort fragt:
- Benutze **nicht** dein normales GitHub-Passwort.
- Benutze den **Personal Access Token** (den langen Code), den wir heute erstellt haben.

## 4. Kontrolle
- **GitHub:** Unter "Commits" siehst du, wann zuletzt etwas hochgeladen wurde.
- **Netlify:** Im Dashboard steht "Published", wenn die neue Version live ist.

---
*Tipp: Wenn du unsicher bist, frag mich einfach: "Kannst du die Änderungen für mich hochladen?" – dann helfe ich dir bei den Befehlen!*
