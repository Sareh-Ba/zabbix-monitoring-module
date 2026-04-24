# Zabbix Monitoring Modul – lesson_gauge_chart

Dieses Projekt ist ein **benutzerdefiniertes Zabbix-Widget-Modul**, das Monitoring-Daten sowohl als **Gauge-Diagramm (Tacho-Anzeige)** als auch als **numerischen Wert (Zahl)** darstellt.

Es wurde im Rahmen der Ausbildung zum Fachinformatiker für Anwendungsentwicklung entwickelt und dient zur Visualisierung von Zabbix-Metriken im Frontend.

---

## 🚀 Funktionen

- Eigenes Zabbix-Widget
- Darstellung von Monitoring-Daten als:
  - Gauge (Tacho / Kreisdiagramm)
  - Numerischer Wert (Zahl)
- Dynamische Datenabfrage aus dem Zabbix-Backend
- Trennung von Backend (PHP) und Frontend (JS/CSS)
- Konfigurierbares Widget-Formular

---

## 🧩 Projektstruktur
lesson_gauge_chart/
│
├── actions/ # Backend-Logik
│ └── WidgetView.php
│
├── assets/
│ ├── css/ # Styles
│ └── js/ # JavaScript Logik
│
├── includes/ # PHP Klassen (Formular & Logik)
│ └── WidgetForm.php
│
├── views/ # Frontend Templates
│ ├── widget.view.php
│ ├── widget.edit.php
│ └── widget.edit.js.php
│
├── Widget.php # Haupteinstiegspunkt
├── manifest.json # Widget Metadaten
└── README.md

---

## ⚙️ Installation

1. Projekt in das Zabbix Frontend Modul-Verzeichnis kopieren  
2. PHP Berechtigungen prüfen  
3. Cache ggf. leeren  
4. Widget im Zabbix Frontend aktivieren  

---

## 🛠️ Verwendete Technologien

- PHP (Zabbix Frontend Entwicklung)
- JavaScript (UI Logik)
- HTML / CSS
- Zabbix Widget API

---

## 🎯 Ziel des Projekts

Ziel dieses Projekts ist die praktische Umsetzung eines Monitoring-Widgets zur Visualisierung von Systemdaten in Zabbix durch:

- Gauge-Darstellung (visuell)
- Numerische Darstellung (Zahl)
- Frontend-Erweiterung von Zabbix

---

## 👤 Autor

Sareh Bahrani  
Fachinformatikerin – Anwendungsentwicklung (IHK)

---

## 📄 Lizenz

Dieses Projekt dient ausschließlich Ausbildungs- und Lernzwecken.
