# Bipolare Störung - Selbstbeobachtung

Eine persönliche Website zur Früherkennung und Selbsthilfe bei bipolarer Störung mit reizarmem, professionellem Design.

## ✅ Bereits implementierte Funktionen

### 🎯 Hauptfunktionen
- **Zwei Hauptbereiche**: Manie und Depression
- **Fünf Kategorien pro Bereich**:
  - Frühwarnzeichen (mit Checkbox-System)
  - Warum es wichtig ist JETZT gegenzusteuern (mit wissenschaftlichen Begründungen)
  - Präventive Maßnahmen (mit persistenten Checkboxen)
  - Maßnahmenkatalog
  - Nachrichten von mir an mich
- **Kontaktpersonen-Management**: Separater Bereich mit persistenter Abhak-Liste

### 🚨 Intelligentes Warnsystem
- **Kategorisierte Frühwarnzeichen**: 17 spezifische Manie-Indikatoren in 4 Kategorien:
  - **Schlaf** (3 Items): Schlafdauer, Einschlafprobleme, nächtliches Aufwachen
  - **Energie/Aktivitäten** (4 Items): Überaktivität, neue Projekte, Umräumaktionen, Hyperfokus
  - **Kognitiv & Emotional** (7 Items): Stimmung, rasende Gedanken, Redebedürfnis, Euphorie
  - **Impulsivität** (3 Items): Ungefilterte Gespräche, Unterbrechen, finanzielle Ausgaben
- **Dreistufiges Warnsystem**: 
  - 🟢 <30%: Weiter beobachten
  - 🟡 30-50%: Gespräch zu Kontaktperson suchen  
  - 🔴 ≥50%: Gegenmaßnahmen einleiten
- **Doppelte Anzeige**: Warnstatus sowohl oben als auch unten in der Frühwarnzeichen-Liste
- **Session-basierte Checkbox-Zustände** (werden bei Neustart zurückgesetzt)

### 📱 Medien-Upload System
- **Textnachrichten, Audio, Bilder, Videos**
- **Drag & Drop Funktionalität**
- **Lokale Browser-Speicherung** (localStorage)
- **Löschfunktion** für Nachrichten

### 🎨 Reizarmes Design
- **Beruhigende Farbpalette** (warme Grautöne, sanfte Akzente)
- **Minimalistisches Layout** ohne störende Icons
- **Professionelle Typografie** mit optimierter Lesbarkeit
- **Großzügige Abstände** für entspannte Nutzung
- **Sanfte Animationen** zur Manie-Prävention

### 💾 Datenpersistenz
- **Persönliche Nachrichten** bleiben erhalten (localStorage)
- **Präventive Maßnahmen** werden persistent gespeichert
- **Kontaktpersonen-Status** bleibt erhalten
- **Zweistufiges Checkbox-System**: Frühwarnzeichen (temporär) vs. Aufgaben (persistent)
- **Session-basierte Authentifizierung** mit konfigurierbarem Passwort

### 🔐 Passwortschutz (✅ Implementiert)
- **Passwort-Login** beim Seitenaufruf erforderlich
- **Session-Management** für sichere Nutzung
- **Konfigurierbar** in script.js (Zeile 2)
- **Automatische Abmeldung** bei Browser-Schließung

### 🔗 Navigation & Verlinkung
- **Interne Verlinkungen**: Direkte Sprünge zu Maßnahmen und Begründungen
- **Scroll-to-Kontaktpersonen**: Automatisches Scrollen zum Kontaktpersonen-Bereich
- **Highlight-Effekte**: Kurze Hervorhebung von Zielbereichen beim Navigieren

## 🔧 Technische Details

### Dateien
- `index.html` - Hauptstruktur mit semantischem HTML
- `styles.css` - Reizarmes, modernes CSS-Design
- `script.js` - Interaktive Funktionen und Datenmanagement
- `README.md` - Projektdokumentation

### Browser-Kompatibilität
- Moderne Browser (Chrome, Firefox, Safari, Edge)
- Responsive Design für verschiedene Bildschirmgrößen
- localStorage für Datenspeicherung

## 📋 Noch zu implementieren

### 🔐 Erweiterte Sicherheit
- [ ] **Verschlüsselte Speicherung** sensibler Daten
- [ ] **Passwort-Wiederherstellung** oder Reset-Funktion
- [ ] **Automatische Abmeldung** nach Inaktivität

### 📱 Mobile Optimierung
- [ ] **Touch-optimierte Bedienung** für Smartphones
- [ ] **Verbesserte Navigation** auf kleinen Bildschirmen
- [ ] **Optimierte Schriftgrößen** für mobile Geräte
- [ ] **PWA-Funktionalität** (Progressive Web App)

### 💾 Erweiterte Datenspeicherung
- [ ] **Browser-Cache Optimierung** für schnellere Ladezeiten
- [ ] **Offline-Verfügbarkeit** der Grundfunktionen
- [ ] **Export-Funktion** für persönliche Daten
- [ ] **Import-Funktion** für Daten-Wiederherstellung

### 🚀 GitHub Pages Deployment
- [ ] **Repository auf GitHub erstellen**
- [ ] **Dateien hochladen** und committen
- [ ] **GitHub Pages aktivieren** in den Repository-Settings
- [ ] **Custom Domain** optional konfigurieren
- [ ] **HTTPS-Verschlüsselung** aktivieren

## 📈 Prioritätenliste

### Hoch (Funktionalität & Deployment)
1. **GitHub Pages** Deployment
2. **Mobile Optimierung** vervollständigen
3. **Erweiterte Sicherheitsfeatures**

### Mittel (Benutzerfreundlichkeit)
4. **Offline-Funktionalität** hinzufügen
5. **Export/Import** von Daten
6. **PWA-Features** implementieren

### Niedrig (Zusatzfeatures)
7. **Erweiterte Statistiken** über Symptomverläufe
8. **Erinnerungsfunktionen** für regelmäßige Checks
9. **Backup-Funktionen** in die Cloud

## 🛠️ Installation & Nutzung

### Lokal verwenden
1. Repository klonen oder Dateien herunterladen
2. **Passwort konfigurieren**: In `script.js` Zeile 2 das Passwort ändern
3. `index.html` in einem modernen Browser öffnen
4. Mit dem konfigurierten Passwort anmelden
5. **Frühwarnzeichen** beobachten (werden nicht gespeichert)
6. **Präventive Maßnahmen** abhaken (werden persistent gespeichert)
7. **Kontaktpersonen** informieren und Status verfolgen
8. **Persönliche Nachrichten** erstellen (Text, Audio, Bild, Video)

### Auf GitHub Pages deployen
```bash
git init
git add .
git commit -m "Initial bipolar tracking website"
git branch -M main
git remote add origin https://github.com/DEIN-USERNAME/REPO-NAME.git
git push -u origin main
```

Dann in GitHub → Settings → Pages → Source: "Deploy from a branch" → Branch: "main" wählen.

## ⚠️ Wichtige Hinweise

- **Kein Ersatz für professionelle Hilfe**: Diese Website ergänzt, ersetzt aber nicht die professionelle medizinische Betreuung
- **Lokale Daten**: Alle Daten werden nur lokal im Browser gespeichert
- **Datenschutz**: Keine Daten werden an externe Server übertragen
- **Backup**: Regelmäßige Sicherung der Daten wird empfohlen

## 📞 Support & Weiterentwicklung

Bei Fragen oder Verbesserungsvorschlägen kann die Website entsprechend angepasst werden. Das Design ist bewusst erweiterbar und modular aufgebaut.