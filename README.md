# Hemandh_Athira_Wedding_Inv

React conversion of the Hemandh & Athira Wedding Invitation.

## Getting Started

```bash
npm install
npm start
```

## URL Parameter System

Share personalised links using query parameters:

| URL | Behaviour |
|-----|-----------|
| `/` or `/?invite=both` | Show both Wedding & Reception |
| `/?invite=wedding` | Show Wedding only |
| `/?invite=reception` | Show Reception only |
| `/?name=Rajan%20Nair` | Personalised banner with guest name |
| `/?invite=wedding&name=Priya` | Wedding invite + personalised banner |

## QR Codes

Both venue QR codes are **pre-generated and stored locally** as base64 PNG images in `src/qrData.js`.

- `QR_WEDDING` → V G D M Hall, Alummood, Kottayam (Google Maps)
- `QR_RECEPTION` → Shamiana Convention Centre, Panayappilly, Kochi (Google Maps)

This means the QR codes are fully offline-capable — no external API calls are made.  
If you need to regenerate them (e.g. if the map URLs change), use the `qrgen.py` script at the project root.

## Project Structure

```
src/
  App.jsx       — Main component with all sections and hooks
  index.js      — React entry point
  index.css     — All styles (1:1 port from original HTML)
  qrData.js     — Pre-generated QR code base64 images
public/
  index.html    — HTML shell with Google Fonts
```

## Build for Production

```bash
npm run build
```
