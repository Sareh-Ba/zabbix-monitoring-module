# Zabbix Monitoring Dashboard Widget – Gauge Chart Extension

Dieses Projekt erweitert die Zabbix Monitoring Plattform um ein individuelles Widget zur visuellen Darstellung von Systemmetriken in Echtzeit.

Das Widget wurde im Rahmen der Ausbildung zum Fachinformatiker für Anwendungsentwicklung (IHK) entwickelt.

Es verbessert die Übersicht von Monitoring-Daten und ermöglicht eine schnellere visuelle Bewertung von Systemzuständen.

---

## 🚀 Funktionen

- Benutzerdefiniertes Zabbix-Widget
- Darstellung von Monitoring-Daten als:
  - Gauge (Tacho / Kreisdiagramm)
  - Numerischer Wert
- Dynamische Datenabfrage aus dem Zabbix-Backend
- Konfigurierbares Widget-Formular
- Trennung von Backend (PHP) und Frontend (JavaScript / CSS)

---

## 🧩 Projektstruktur

lesson_gauge_chart/
├── actions/          Backend-Logik
├── assets/           CSS & JavaScript
├── includes/         PHP Klassen
├── views/            UI Templates
├── Widget.php        Einstiegspunkt
├── manifest.json     Konfiguration
└── README.md

---

## ⚙️ Installation

- Modul in das Zabbix Frontend-Verzeichnis kopieren
- Berechtigungen für PHP-Dateien prüfen
- Cache von Zabbix leeren
- Widget im Dashboard aktivieren

---

## 🛠️ Technologien

- PHP (Zabbix Frontend Entwicklung)
- JavaScript (UI Logik)
- HTML / CSS
- Zabbix Widget API

---

## 🎯 Ziel des Projekts

Das Ziel ist die Entwicklung eines praxisnahen Monitoring-Widgets zur besseren Visualisierung von Systemdaten in Zabbix durch:

- visuelle Gauge-Darstellung
- numerische Darstellung
- Erweiterung der Zabbix Frontend-Funktionalität

---

## 👤 Entwickler

Sareh Bahrani  
Fachinformatiker Anwendungsentwicklung (IHK)

---

## 📄 Lizenz

Dieses Projekt dient ausschließlich Ausbildungs- und Lernzwecken.
