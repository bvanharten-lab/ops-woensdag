# Team Operations Woensdag

Meetingpagina van Team Operations (Coalition58) voor de wekelijkse woensdagmeeting: OKR's met key results en acties, lopende weekenden, Operations-projecten, brainstorm, acties, besluiten, agenda en planning.

- **Site:** https://bvanharten-lab.github.io/ops-woensdag/
- **Data:** Google Sheet "Team Operations Woensdag (data)". De site leest en schrijft daarin via een Apps Script-web-app. Alles wat op de site gebeurt staat dus direct in de sheet, en wat je in de sheet aanpast staat binnen een minuut op de site.
- **Toegang:** inloggen met een Google-account van `4m.nl`. Andere accounts komen er niet in.

## Hoe het werkt

```
browser (GitHub Pages: index.html)
   │  POST + Google ID-token
   ▼
Apps Script web-app (Code.gs, draait als Bart)
   │  verifieert token bij Google (client-ID + domein 4m.nl)
   ▼
Google Sheet "Team Operations Woensdag (data)"   ←  leest ook "OPS Dashboard projecten" (live weekenden)
```

## Eenmalige installatie (±15 minuten)

### 1. Apps Script in de datasheet
1. Open de sheet **Team Operations Woensdag (data)** → **Extensies → Apps Script**.
2. Vervang de inhoud van `Code.gs` door het bestand `Code.gs` uit deze repo. Opslaan.
3. Herlaad de sheet. Er staat nu een menu **OPS site**.

### 2. OAuth client-ID aanmaken (Google Cloud)
1. Ga naar https://console.cloud.google.com/ → kies of maak een project (bijv. "OPS Woensdag").
2. **APIs & Services → OAuth consent screen**: type **Internal** (alleen 4m.nl), naam "Team Operations Woensdag", opslaan.
3. **APIs & Services → Credentials → Create credentials → OAuth client ID** → type **Web application**.
   - Authorized JavaScript origins: `https://bvanharten-lab.github.io`
   - (geen redirect URI nodig)
4. Kopieer de **Client ID** (eindigt op `.apps.googleusercontent.com`).

### 3. Script instellen en publiceren
1. In de sheet: menu **OPS site → Instellen**, plak de client-ID, domein `4m.nl`. Dit zet ook de opmaak en keuzelijsten van alle tabbladen.
2. In Apps Script: **Implementeren → Nieuwe implementatie** → type **Web-app**:
   - Uitvoeren als: **Ik**
   - Wie heeft toegang: **Iedereen** (de toegang wordt door het ID-token afgedwongen, niet door Google's deelinstelling)
   - Implementeren → autoriseren → kopieer de **web-app-URL** (eindigt op `/exec`).

### 4. GitHub koppelen
1. In deze repo: **Settings → Secrets and variables → Actions → Variables** → **New repository variable**:
   - `API_URL` = de web-app-URL uit stap 3
   - `CLIENT_ID` = de client-ID uit stap 2
2. **Actions → Deploy naar GitHub Pages → Run workflow** (of push een wijziging). Na een minuut staat de site live.

### 5. Testen
Open https://bvanharten-lab.github.io/ops-woensdag/, log in met je 4m.nl-account, zet een actie op "Bezig" en kijk in de sheet (tab Acties).

## Wijzigingen later

- **Site aanpassen:** bewerk `index.html`, push naar `main`; de workflow publiceert automatisch.
- **Script aanpassen:** plak de nieuwe `Code.gs` in Apps Script en maak een **nieuwe versie** van de implementatie (Implementeren → Implementaties beheren → potlood → Versie: Nieuw). De URL blijft gelijk.
- **Nieuwe kolom:** voeg hem toe in `SPEC` in `Code.gs` (en in de sheet rij 1 = label, rij 2 = veldnaam). De site negeert velden die hij niet kent.

## Spelregels in de sheet

- Rij 1 = kolomnaam, rij 2 = veldnaam voor de koppeling. Rij 2 en kolom A (ID) niet wijzigen.
- Nieuwe rijen liefst via de site; in de sheet zelf: unieke ID in kolom A.
- Datums als `jjjj-mm-dd` of via de datumkiezer. Percentages bij key results als fractie (`0,95`).
- Tab **Instellingen**: huidig kwartaal, jaar, ID van het OPS Dashboard-sheet, werkafspraken.

## Privacy

De sheet bevat alleen teamwerk (OKR's, acties, besluiten, planning) en namen van teamleden. Geen deelnemers-, crew- of donateursgegevens.
