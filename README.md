# Zabbix Monitoring Dashboard Widget – Gauge Chart Extension

Dieses Projekt erweitert die Zabbix Monitoring Plattform um ein individuelles Widget zur visuellen Darstellung von Systemmetriken in Echtzeit.

Das Widget wurde im Rahmen der Ausbildung zur Fachinformatikerin für Anwendungsentwicklung (IHK) entwickelt und vollständig in PHP und JavaScript implementiert.

---

## 🚀 Funktionen

- Benutzerdefiniertes Zabbix-Dashboard-Widget
- Drei Anzeigemodi:
  - **Gauge** – Kreisbogendiagramm mit Tick-Markierungen und Nadel
  - **Bar** – Horizontaler Fortschrittsbalken mit Gradient
  - **Number** – Numerische Großanzeige mit Fortschrittsring
- Dynamische Echtzeit-Datenabfrage über die Zabbix API
- Animierte Übergänge bei Werteänderungen
- Statusbadge mit automatischer Farbänderung (grün / gelb / rot)
- Light- und Dark-Mode-Unterstützung
- Konfigurierbares Widget-Formular:
  - Item-Auswahl
  - Min- / Max-Wert
  - Farbe
  - Einheit (automatisch oder statisch)
  - Anzeigetyp
  - Beschreibung

---

## 🧩 Projektstruktur

```
lesson_gauge_chart/
├── actions/
│   └── WidgetView.php       # Backend-Logik, Zabbix API-Abfrage
├── assets/
│   ├── class.widget.js      # Frontend-Logik, Canvas-Rendering
│   └── widget.css           # Styling des Widgets
├── includes/
│   └── WidgetForm.php       # Formular-Felder Definition
├── views/
│   ├── widget.view.php      # Widget-Ansicht Template
│   ├── widget.edit.php      # Formular-Ansicht Template
│   └── widget.edit.js.php   # Formular JavaScript
├── Widget.php               # Einstiegspunkt / Konstanten
├── manifest.json            # Modul-Konfiguration
└── README.md
```

---

## ⚙️ Installation

### Manuell

1. Projektordner nach `/usr/share/zabbix/modules/lesson_gauge_chart/` kopieren
2. Dateiberechtigungen für PHP-Dateien prüfen
3. Zabbix-Cache leeren
4. In Zabbix: **Administration → General → Modules → Scan directory**
5. Modul aktivieren und Widget im Dashboard hinzufügen

### Mit Docker (Entwicklung)

```bash
git clone https://github.com/Sareh-Ba/zabbix-monitoring-module.git
cd zabbix-monitoring-module
docker-compose up -d
```

Zabbix ist dann erreichbar unter: `http://localhost:8888`  
Login: `Admin` / `zabbix`

---

## 🛠️ Technologien

| Technologie | Verwendung |
|---|---|
| PHP | Backend-Logik, Zabbix Widget API |
| JavaScript (ES6+) | Canvas-Rendering, Animationen |
| HTML / CSS | Widget-Template, Styling |
| Zabbix Widget API | Integration ins Dashboard |
| SQL | Datenbankabfragen über Zabbix API |
| Git | Versionsverwaltung |
| Docker | Lokale Entwicklungsumgebung |

---

## 🎯 Ziel des Projekts

Entwicklung eines praxisnahen Monitoring-Widgets als Abschlussprojekt der IHK-Ausbildung zur Fachinformatikerin für Anwendungsentwicklung.

**Schwerpunkte:**
- Integration eines benutzerdefinierten Moduls in die Zabbix-Plattform
- Vollständige Trennung von Backend (PHP) und Frontend (JavaScript)
- Dynamische Datenabfrage über die Zabbix History- und Item-API
- Visuelle Aufbereitung von Monitoring-Daten durch Canvas-basiertes Rendering

---

## 👤 Entwicklerin

**Sareh Bahrani**  
Fachinformatikerin Anwendungsentwicklung (IHK)  
GitHub: [Sareh-Ba](https://github.com/Sareh-Ba)

---

## 📄 Lizenz

Dieses Projekt dient ausschließlich Ausbildungs- und Lernzwecken.