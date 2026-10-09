/**
 * Team Operations Woensdag — API en opmaak voor de datasheet.
 *
 * Installatie (eenmalig):
 *  1. Open de sheet "Team Operations Woensdag (data)" → Extensies → Apps Script, plak dit bestand als Code.gs en sla op.
 *  2. Herlaad de sheet. Kies in het menu "OPS site" → "Instellen" en vul de OAuth client-ID in (zie README).
 *  3. Implementeren → Nieuwe implementatie → type "Web-app" → Uitvoeren als: Ik, Toegang: Iedereen → Implementeren.
 *     Kopieer de web-app-URL (eindigt op /exec) naar de GitHub-variabele API_URL.
 *
 * Beveiliging: elke aanroep draagt een Google ID-token mee. Het token wordt bij Google geverifieerd
 * (aud = client-ID, e-mail geverifieerd, domein = DOMAIN). Zonder geldig token wordt niets gelezen of geschreven.
 */

const SPEC = {"tabs":[{"key":"okrs","title":"OKR's","sheetId":1001,"cols":[{"key":"id","label":"ID","type":"id","width":70,"opts":null},{"key":"code","label":"Code","type":"text","width":70,"opts":null},{"key":"order","label":"Volgorde","type":"num","width":80,"opts":null},{"key":"title","label":"Objective","type":"text","width":300,"opts":null},{"key":"desc","label":"Toelichting","type":"long","width":420,"opts":null},{"key":"owner","label":"Eigenaar","type":"owner","width":160,"opts":null},{"key":"updatedAt","label":"Bijgewerkt","type":"ts","width":150,"opts":null}]},{"key":"krs","title":"Key results","sheetId":1002,"cols":[{"key":"id","label":"ID","type":"id","width":70,"opts":null},{"key":"okr","label":"Objective","type":"list","width":90,"opts":"okrs"},{"key":"code","label":"Code","type":"text","width":70,"opts":null},{"key":"order","label":"Volgorde","type":"num","width":80,"opts":null},{"key":"title","label":"Key result","type":"text","width":360,"opts":null},{"key":"owner","label":"Eigenaar","type":"owner","width":160,"opts":null},{"key":"type","label":"Type","type":"list","width":110,"opts":["Uitkomst","Output","Gezondheid"]},{"key":"unit","label":"Eenheid","type":"list","width":90,"opts":["aantal","%","cijfer","uren","dagen"]},{"key":"direction","label":"Richting","type":"list","width":130,"opts":["Hoger is beter","Lager is beter"]},{"key":"source","label":"Meetbron","type":"long","width":280,"opts":null},{"key":"nulmeting","label":"Nulmeting","type":"num","width":90,"opts":null},{"key":"jaardoel","label":"Jaardoel","type":"num","width":90,"opts":null},{"key":"q1d","label":"Q1 doel","type":"num","width":80,"opts":null},{"key":"q1w","label":"Q1 werkelijk","type":"num","width":90,"opts":null},{"key":"q2d","label":"Q2 doel","type":"num","width":80,"opts":null},{"key":"q2w","label":"Q2 werkelijk","type":"num","width":90,"opts":null},{"key":"q3d","label":"Q3 doel","type":"num","width":80,"opts":null},{"key":"q3w","label":"Q3 werkelijk","type":"num","width":90,"opts":null},{"key":"q4d","label":"Q4 doel","type":"num","width":80,"opts":null},{"key":"q4w","label":"Q4 werkelijk","type":"num","width":90,"opts":null},{"key":"status","label":"Status","type":"list","width":120,"opts":["Niet gestart","Op koers","Aandacht","Achter","Behaald","Vervallen"]},{"key":"note","label":"Toelichting","type":"long","width":320,"opts":null},{"key":"updatedAt","label":"Bijgewerkt","type":"ts","width":150,"opts":null}]},{"key":"acties","title":"Acties","sheetId":1003,"cols":[{"key":"id","label":"ID","type":"id","width":90,"opts":null},{"key":"code","label":"Code","type":"text","width":70,"opts":null},{"key":"datum","label":"Afgesproken op","type":"date","width":120,"opts":null},{"key":"thema","label":"Thema","type":"list","width":170,"opts":["OKR's","Lopende weekenden","Operations-projecten","Brainstorm & vooruitkijken"]},{"key":"text","label":"Actie","type":"long","width":380,"opts":null},{"key":"owner","label":"Eigenaar","type":"owner","width":160,"opts":null},{"key":"deadline","label":"Deadline","type":"date","width":110,"opts":null},{"key":"status","label":"Status","type":"list","width":100,"opts":["Open","Bezig","Gereed","Vervallen"]},{"key":"kr","label":"Key result","type":"list","width":90,"opts":"krs"},{"key":"okr","label":"Objective","type":"list","width":90,"opts":"okrs"},{"key":"project","label":"Project","type":"list","width":110,"opts":"projecten"},{"key":"mijlpaal","label":"Mijlpaal","type":"list","width":110,"opts":"mijlpalen"},{"key":"weekend","label":"Weekend","type":"list","width":110,"opts":"weekenden"},{"key":"idee","label":"Idee","type":"list","width":110,"opts":"brainstorm"},{"key":"besluit","label":"Volgt uit besluit","type":"list","width":120,"opts":"besluiten"},{"key":"note","label":"Notitie / blokkade","type":"long","width":300,"opts":null},{"key":"updatedAt","label":"Bijgewerkt","type":"ts","width":150,"opts":null}]},{"key":"besluiten","title":"Besluiten","sheetId":1004,"cols":[{"key":"id","label":"ID","type":"id","width":90,"opts":null},{"key":"datum","label":"Genomen op","type":"date","width":110,"opts":null},{"key":"thema","label":"Thema","type":"list","width":170,"opts":["OKR's","Lopende weekenden","Operations-projecten","Brainstorm & vooruitkijken"]},{"key":"text","label":"Besluit","type":"long","width":380,"opts":null},{"key":"context","label":"Context / aanleiding","type":"long","width":300,"opts":null},{"key":"owner","label":"Genomen door","type":"owner","width":160,"opts":null},{"key":"status","label":"Status","type":"list","width":110,"opts":["Vastgelegd","Herzien","Ingetrokken"]},{"key":"kr","label":"Key result","type":"list","width":90,"opts":"krs"},{"key":"okr","label":"Objective","type":"list","width":90,"opts":"okrs"},{"key":"project","label":"Project","type":"list","width":110,"opts":"projecten"},{"key":"mijlpaal","label":"Mijlpaal","type":"list","width":110,"opts":"mijlpalen"},{"key":"weekend","label":"Weekend","type":"list","width":110,"opts":"weekenden"},{"key":"idee","label":"Idee","type":"list","width":110,"opts":"brainstorm"},{"key":"geldigTot","label":"Herzien op","type":"date","width":110,"opts":null},{"key":"note","label":"Opvolging / notitie","type":"long","width":300,"opts":null},{"key":"updatedAt","label":"Bijgewerkt","type":"ts","width":150,"opts":null}]},{"key":"projecten","title":"Projecten","sheetId":1005,"cols":[{"key":"id","label":"ID","type":"id","width":70,"opts":null},{"key":"title","label":"Project","type":"text","width":240,"opts":null},{"key":"result","label":"Gewenst resultaat","type":"long","width":380,"opts":null},{"key":"owner","label":"Eigenaar","type":"owner","width":160,"opts":null},{"key":"status","label":"Status","type":"list","width":100,"opts":["Groen","Oranje","Rood"]},{"key":"deadline","label":"Deadline","type":"date","width":110,"opts":null},{"key":"voortgang","label":"Voortgang %","type":"num","width":100,"opts":null},{"key":"blokkade","label":"Blokkade","type":"long","width":260,"opts":null},{"key":"hulp","label":"Benodigde hulp of besluit","type":"long","width":300,"opts":null},{"key":"volgende","label":"Volgende stap","type":"long","width":260,"opts":null},{"key":"updatedAt","label":"Bijgewerkt","type":"ts","width":150,"opts":null}]},{"key":"mijlpalen","title":"Mijlpalen","sheetId":1006,"cols":[{"key":"id","label":"ID","type":"id","width":70,"opts":null},{"key":"project","label":"Project","type":"list","width":110,"opts":"projecten"},{"key":"title","label":"Mijlpaal","type":"text","width":300,"opts":null},{"key":"deadline","label":"Deadline","type":"date","width":110,"opts":null},{"key":"status","label":"Status","type":"list","width":100,"opts":["Open","Bezig","Gereed"]},{"key":"order","label":"Volgorde","type":"num","width":80,"opts":null},{"key":"note","label":"Toelichting","type":"long","width":320,"opts":null},{"key":"updatedAt","label":"Bijgewerkt","type":"ts","width":150,"opts":null}]},{"key":"weekenden","title":"Weekenden","sheetId":1007,"cols":[{"key":"id","label":"ID","type":"id","width":70,"opts":null},{"key":"title","label":"Weekend","type":"text","width":240,"opts":null},{"key":"merk","label":"Label","type":"list","width":130,"opts":["4M","4Family","Arise","Arise / 4Family","Muskathlon","LIFE","Common Ground","Promo"]},{"key":"datum","label":"Startdatum","type":"date","width":110,"opts":null},{"key":"owner","label":"Eigenaar","type":"owner","width":160,"opts":null},{"key":"status","label":"Status","type":"list","width":100,"opts":["Groen","Oranje","Rood"]},{"key":"bezetting","label":"Bezetting rond","type":"list","width":110,"opts":["Ja","Bijna","Nee"]},{"key":"risico","label":"Grootste risico","type":"long","width":260,"opts":null},{"key":"maatregel","label":"Maatregel","type":"long","width":260,"opts":null},{"key":"besluit","label":"Besluit nodig","type":"list","width":100,"opts":["Ja","Nee"]},{"key":"besluitTekst","label":"Welk besluit","type":"long","width":220,"opts":null},{"key":"volgende","label":"Volgende stap","type":"long","width":240,"opts":null},{"key":"evaluatie","label":"Evaluatie","type":"long","width":300,"opts":null},{"key":"voortgang","label":"Voortgang %","type":"num","width":100,"opts":null},{"key":"achterstallig","label":"Achterstallig","type":"num","width":100,"opts":null},{"key":"peildatum","label":"Peildatum","type":"date","width":110,"opts":null},{"key":"eersteTaak","label":"Eerste open taak","type":"text","width":220,"opts":null},{"key":"eersteDeadline","label":"Deadline eerste taak","type":"date","width":120,"opts":null},{"key":"updatedAt","label":"Bijgewerkt","type":"ts","width":150,"opts":null},{"key":"evalGoed","label":"Evaluatie: wat ging goed","type":"long","width":300,"opts":null},{"key":"evalBeter","label":"Evaluatie: wat kan beter","type":"long","width":300,"opts":null},{"key":"evalLeerpunt","label":"Evaluatie: leerpunt","type":"long","width":300,"opts":null},{"key":"evalDatum","label":"Geëvalueerd op","type":"date","width":110,"opts":null}]},{"key":"brainstorm","title":"Brainstorm","sheetId":1008,"cols":[{"key":"id","label":"ID","type":"id","width":90,"opts":null},{"key":"datum","label":"Datum","type":"date","width":110,"opts":null},{"key":"title","label":"Kans, risico of idee","type":"long","width":340,"opts":null},{"key":"categorie","label":"Categorie","type":"list","width":120,"opts":["Proces","Systeem","Team","Deelnemer","Crew","Communicatie","Overig"]},{"key":"impact","label":"Impact","type":"list","width":90,"opts":["Hoog","Midden","Laag"]},{"key":"inspanning","label":"Inspanning","type":"list","width":100,"opts":["Hoog","Midden","Laag"]},{"key":"prioriteit","label":"Prioriteit","type":"list","width":120,"opts":["Nu oppakken","Later","Parkeren"]},{"key":"status","label":"Status","type":"list","width":120,"opts":["Nieuw","In verkenning","Afgerond","Afgewezen"]},{"key":"owner","label":"Eigenaar","type":"owner","width":160,"opts":null},{"key":"stap","label":"Eerste stap","type":"long","width":280,"opts":null},{"key":"updatedAt","label":"Bijgewerkt","type":"ts","width":150,"opts":null}]},{"key":"planning","title":"Planning","sheetId":1009,"cols":[{"key":"id","label":"ID","type":"id","width":100,"opts":null},{"key":"datum","label":"Datum","type":"date","width":110,"opts":null},{"key":"thema","label":"Thema","type":"list","width":200,"opts":["OKR's","Lopende weekenden","Operations-projecten","Brainstorm & vooruitkijken"]},{"key":"status","label":"Status","type":"list","width":130,"opts":["Vervallen"]},{"key":"voorzitter","label":"Voorzitter","type":"owner","width":160,"opts":null},{"key":"notulist","label":"Notulist","type":"owner","width":160,"opts":null},{"key":"hoofdonderwerp","label":"Hoofdonderwerp","type":"long","width":300,"opts":null},{"key":"mijlpaal","label":"Mijlpaal","type":"text","width":200,"opts":null},{"key":"updatedAt","label":"Bijgewerkt","type":"ts","width":150,"opts":null}]},{"key":"agenda","title":"Agenda","sheetId":1010,"cols":[{"key":"id","label":"ID","type":"id","width":100,"opts":null},{"key":"datum","label":"Datum","type":"date","width":110,"opts":null},{"key":"checkin","label":"Check-in (0–5)","type":"long","width":340,"opts":null},{"key":"afronding","label":"Afronding (55–60)","type":"long","width":340,"opts":null},{"key":"volgende","label":"Voor de volgende meeting","type":"long","width":340,"opts":null},{"key":"updatedAt","label":"Bijgewerkt","type":"ts","width":150,"opts":null}]},{"key":"agendapunten","title":"Agendapunten","sheetId":1011,"cols":[{"key":"id","label":"ID","type":"id","width":90,"opts":null},{"key":"datum","label":"Meeting","type":"date","width":110,"opts":null},{"key":"blok","label":"Blok","type":"list","width":110,"opts":["punt","onderwerp"]},{"key":"soort","label":"Soort","type":"list","width":110,"opts":["Informeren","Bespreken","Besluiten"]},{"key":"tekst","label":"Punt","type":"long","width":360,"opts":null},{"key":"door","label":"Ingebracht door","type":"owner","width":160,"opts":null},{"key":"toelichting","label":"Toelichting","type":"long","width":300,"opts":null},{"key":"voorbereiding","label":"Voorbereiding","type":"long","width":260,"opts":null},{"key":"klaar","label":"Behandeld","type":"bool","width":90,"opts":null},{"key":"order","label":"Volgorde","type":"num","width":110,"opts":null},{"key":"updatedAt","label":"Bijgewerkt","type":"ts","width":150,"opts":null}]},{"key":"team","title":"Team","sheetId":1012,"cols":[{"key":"id","label":"ID","type":"id","width":70,"opts":null},{"key":"naam","label":"Naam","type":"text","width":200,"opts":null},{"key":"rol","label":"Rol","type":"text","width":240,"opts":null},{"key":"gebied","label":"Aandachtsgebied","type":"long","width":320,"opts":null},{"key":"order","label":"Volgorde","type":"num","width":80,"opts":null},{"key":"updatedAt","label":"Bijgewerkt","type":"ts","width":150,"opts":null}]},{"key":"parkeerplaats","title":"Parkeerplaats","sheetId":1014,"cols":[{"key":"id","label":"ID","type":"id","width":90,"opts":null},{"key":"datum","label":"Geparkeerd op","type":"date","width":110,"opts":null},{"key":"tekst","label":"Onderwerp","type":"long","width":360,"opts":null},{"key":"door","label":"Ingebracht door","type":"owner","width":160,"opts":null},{"key":"status","label":"Status","type":"list","width":110,"opts":["Open","Ingepland","Afgehandeld"]},{"key":"note","label":"Notitie","type":"long","width":300,"opts":null},{"key":"updatedAt","label":"Bijgewerkt","type":"ts","width":150,"opts":null}]},{"key":"werkdruk","title":"Werkdruk","sheetId":1015,"cols":[{"key":"id","label":"ID","type":"id","width":150,"opts":null},{"key":"datum","label":"Meeting","type":"date","width":110,"opts":null},{"key":"naam","label":"Teamlid","type":"owner","width":160,"opts":null},{"key":"score","label":"Score (1 rustig, 5 te veel)","type":"num","width":100,"opts":null},{"key":"opmerking","label":"Opmerking","type":"long","width":300,"opts":null},{"key":"updatedAt","label":"Bijgewerkt","type":"ts","width":150,"opts":null}]},{"key":"kpis","title":"KPI's","sheetId":1016,"cols":[{"key":"id","label":"ID","type":"id","width":70,"opts":null},{"key":"nr","label":"#","type":"num","width":50,"opts":null},{"key":"categorie","label":"Categorie","type":"list","width":180,"opts":["Deelnemersreis","Website & informatie","Reisvoorbereiding & vertrek","Team, werkdruk & continuïteit","Data & sturing","Overig"]},{"key":"title","label":"KPI","type":"long","width":360,"opts":null},{"key":"owner","label":"Eigenaar","type":"owner","width":160,"opts":null},{"key":"unit","label":"Eenheid","type":"list","width":80,"opts":["%","aantal","uren","cijfer"]},{"key":"norm","label":"Norm","type":"num","width":80,"opts":null},{"key":"direction","label":"Richting","type":"list","width":130,"opts":["Hoger is beter","Lager is beter"]},{"key":"m1","label":"jan","type":"num","width":70,"opts":null},{"key":"m2","label":"feb","type":"num","width":70,"opts":null},{"key":"m3","label":"mrt","type":"num","width":70,"opts":null},{"key":"m4","label":"apr","type":"num","width":70,"opts":null},{"key":"m5","label":"mei","type":"num","width":70,"opts":null},{"key":"m6","label":"jun","type":"num","width":70,"opts":null},{"key":"m7","label":"jul","type":"num","width":70,"opts":null},{"key":"m8","label":"aug","type":"num","width":70,"opts":null},{"key":"m9","label":"sep","type":"num","width":70,"opts":null},{"key":"m10","label":"okt","type":"num","width":70,"opts":null},{"key":"m11","label":"nov","type":"num","width":70,"opts":null},{"key":"m12","label":"dec","type":"num","width":70,"opts":null},{"key":"note","label":"Toelichting","type":"long","width":260,"opts":null},{"key":"updatedAt","label":"Bijgewerkt","type":"ts","width":150,"opts":null}]},{"key":"afwezigheid","title":"Afwezigheid","sheetId":1017,"cols":[{"key":"id","label":"ID","type":"id","width":90,"opts":null},{"key":"naam","label":"Teamlid","type":"owner","width":160,"opts":null},{"key":"soort","label":"Soort","type":"list","width":140,"opts":["Vakantie","Vrij","Cursus / opleiding","Extern / op reis","Anders"]},{"key":"van","label":"Van","type":"date","width":110,"opts":null},{"key":"tot","label":"Tot en met","type":"date","width":110,"opts":null},{"key":"note","label":"Notitie","type":"long","width":300,"opts":null},{"key":"updatedAt","label":"Bijgewerkt","type":"ts","width":150,"opts":null}]}],"settings":{"title":"Instellingen","sheetId":1013},"start":{"title":"Start","sheetId":1000},"statusColors":{"Op koers":["#E4F2E8","#1E7A3C"],"Behaald":["#E4F2E8","#1E7A3C"],"Gereed":["#E4F2E8","#1E7A3C"],"Groen":["#E4F2E8","#1E7A3C"],"Vastgelegd":["#E4F2E8","#1E7A3C"],"Afgerond":["#E4F2E8","#1E7A3C"],"Nu oppakken":["#E4F2E8","#1E7A3C"],"Aandacht":["#FBF0D9","#A8640A"],"Oranje":["#FBF0D9","#A8640A"],"Herzien":["#FBF0D9","#A8640A"],"Bezig":["#E3ECFA","#1F4E9A"],"In verkenning":["#E3ECFA","#1F4E9A"],"Achter":["#FBE5E3","#B4261E"],"Rood":["#FBE5E3","#B4261E"],"Vervallen":["#ECECE8","#6B6B66"],"Ingetrokken":["#ECECE8","#6B6B66"],"Afgewezen":["#ECECE8","#6B6B66"]},"colors":{"black":"#0F0F0F","red":"#DD0000","grey":"#F1F1EE","muted":"#6B6B66"},"font":"Epilogue","display":"Big Shoulders Display"};
const HEADER_ROWS = 2;
const PROPS = PropertiesService.getScriptProperties();
const ss = () => SpreadsheetApp.getActiveSpreadsheet();

/* ---------------- menu ---------------- */
function onOpen(){
  SpreadsheetApp.getUi().createMenu('OPS site')
    .addItem('Instellen (client-ID en domein)', 'setupPrompt')
    .addItem('Opmaak en keuzelijsten toepassen', 'applyFormatting')
    .addItem('Test: lees alles', 'testAll')
    .addToUi();
}
function setupPrompt(){
  const ui = SpreadsheetApp.getUi();
  const a = ui.prompt('OAuth client-ID', 'Plak de client-ID uit Google Cloud (eindigt op .apps.googleusercontent.com):', ui.ButtonSet.OK_CANCEL);
  if(a.getSelectedButton() !== ui.Button.OK) return;
  PROPS.setProperty('CLIENT_ID', a.getResponseText().trim());
  const d = ui.prompt('Domein', 'Welk Google Workspace-domein mag inloggen?', ui.ButtonSet.OK_CANCEL);
  PROPS.setProperty('DOMAIN', (d.getSelectedButton() === ui.Button.OK && d.getResponseText().trim()) || '4m.nl');
  applyFormatting();
  ui.alert('Klaar. Publiceer nu de web-app (Implementeren → Nieuwe implementatie → Web-app, uitvoeren als ik, toegang: iedereen) en zet de URL in GitHub als API_URL.');
}
function testAll(){ const d = readAll(true); SpreadsheetApp.getUi().alert(Object.keys(d).map(k => k + ': ' + (Array.isArray(d[k]) ? d[k].length + ' rijen' : 'ok')).join('\n')); }

/* ---------------- web app ---------------- */
function doGet(){ return json({ok:true, service:'Team Operations Woensdag API', version:1}); }
function doPost(e){
  try{
    const body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    const user = verify(body.token);
    if(!user) return json({error:'auth'});
    const lock = LockService.getScriptLock();
    switch(body.op){
      case 'all': return json({ok:true, user:user.email, data: readAll(!!body.live)});
      case 'write':
        lock.waitLock(20000);
        try{ (body.writes || []).forEach(applyWrite); } finally { lock.releaseLock(); }
        return json({ok:true, data: readAll(false)});
      case 'settings':
        lock.waitLock(20000);
        try{ writeSettings(body.settings || {}); } finally { lock.releaseLock(); }
        return json({ok:true, data: readAll(false)});
      default: return json({error:'bad_op'});
    }
  }catch(err){ return json({error:'server', message:String(err && err.message || err)}); }
}
function json(o){ return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }

/* ---------------- auth ---------------- */
function verify(token){
  if(!token) return null;
  const clientId = PROPS.getProperty('CLIENT_ID'); const domain = (PROPS.getProperty('DOMAIN') || '4m.nl').toLowerCase();
  if(!clientId) return null;
  const cache = CacheService.getScriptCache();
  const key = 'tok:' + Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, token));
  const hit = cache.get(key); if(hit) return JSON.parse(hit);
  const res = UrlFetchApp.fetch('https://oauth2.googleapis.com/tokeninfo?id_token=' + encodeURIComponent(token), {muteHttpExceptions:true});
  if(res.getResponseCode() !== 200) return null;
  const info = JSON.parse(res.getContentText());
  if(info.aud !== clientId) return null;
  if(String(info.email_verified) !== 'true') return null;
  const email = String(info.email || '').toLowerCase();
  if(!email.endsWith('@' + domain)) return null;
  const ttl = Math.floor((Number(info.exp) * 1000 - Date.now()) / 1000);
  if(ttl <= 0) return null;
  const user = {email};
  cache.put(key, JSON.stringify(user), Math.max(60, Math.min(ttl, 1800)));
  return user;
}

/* ---------------- lezen ---------------- */
function readAll(withLive){
  const out = {};
  SPEC.tabs.forEach(t => { out[t.key] = readTab(t); });
  out.settings = readSettings();
  if(withLive) out.live = readLive(out.settings.opsDashboardId);
  return out;
}
function readTab(tab){
  const sh = ss().getSheetByName(tab.title); if(!sh) return [];
  const lastRow = sh.getLastRow(), lastCol = sh.getLastColumn();
  if(lastRow <= HEADER_ROWS) return [];
  const vals = sh.getRange(1, 1, lastRow, lastCol).getValues();
  const keys = vals[1].map(String);
  const out = [];
  for(let r = HEADER_ROWS; r < vals.length; r++){
    const row = vals[r]; const id = conv(row[0], {type:'id'});
    if(id === '') continue;
    const d = {};
    keys.forEach((k, i) => { if(!k) return; d[k] = conv(row[i], tab.cols.find(c => c.key === k)); });
    d.id = String(id);
    out.push(d);
  }
  return out;
}
function conv(v, spec){
  const t = spec ? spec.type : 'text';
  if(v instanceof Date) return t === 'ts' ? Utilities.formatDate(v, tz(), "yyyy-MM-dd'T'HH:mm:ss") : Utilities.formatDate(v, tz(), 'yyyy-MM-dd');
  if(v === '' || v === null || v === undefined) return t === 'num' ? null : (t === 'bool' ? false : '');
  if(t === 'bool') return v === true || String(v).toUpperCase() === 'TRUE';
  if(t === 'num') return typeof v === 'number' ? v : (isNaN(Number(String(v).replace(',', '.'))) ? null : Number(String(v).replace(',', '.')));
  return String(v);
}
function tz(){ return ss().getSpreadsheetTimeZone() || 'Europe/Amsterdam'; }
function readSettings(){
  const sh = ss().getSheetByName(SPEC.settings.title); const s = {};
  if(sh && sh.getLastRow() > HEADER_ROWS){
    sh.getRange(HEADER_ROWS + 1, 1, sh.getLastRow() - HEADER_ROWS, 2).getValues().forEach(r => { const k = String(r[0]).trim(); if(!k) return; s[k] = r[1] instanceof Date ? Utilities.formatDate(r[1], tz(), 'yyyy-MM-dd') : r[1]; });
  }
  s.werkafspraken = String(s.werkafspraken || '').split('\n').map(x => x.trim()).filter(Boolean);
  s.kwartaal = s.kwartaal || 'Q4'; s.jaar = Number(s.jaar) || new Date().getFullYear();
  return s;
}
function readLive(sheetId){
  if(!sheetId) return {error:'Geen opsDashboardId in Instellingen'};
  try{
    const sh = SpreadsheetApp.openById(String(sheetId)).getSheetByName('Projecten data');
    if(!sh) return {error:"Tab 'Projecten data' niet gevonden"};
    return {values: sh.getDataRange().getDisplayValues()};
  }catch(e){ return {error:String(e && e.message || e)}; }
}

/* ---------------- schrijven ---------------- */
function applyWrite(w){
  const tab = SPEC.tabs.find(t => t.key === w.col); if(!tab) throw new Error('Onbekende tabel: ' + w.col);
  const sh = ss().getSheetByName(tab.title); if(!sh) throw new Error('Tabblad ontbreekt: ' + tab.title);
  const lastRow = sh.getLastRow(), lastCol = sh.getLastColumn();
  const keys = sh.getRange(2, 1, 1, lastCol).getValues()[0].map(String);
  const ids = lastRow > HEADER_ROWS ? sh.getRange(HEADER_ROWS + 1, 1, lastRow - HEADER_ROWS, 1).getValues().map(r => conv(r[0], {type:'id'})) : [];
  const idx = ids.indexOf(String(w.id));
  if(w.del){ if(idx >= 0) sh.deleteRow(idx + HEADER_ROWS + 1); return; }
  const doc = w.doc || {};
  const row = keys.map(k => { if(!k) return ''; const spec = tab.cols.find(c => c.key === k); return toCell(k === 'id' ? w.id : doc[k], spec); });
  const r = idx >= 0 ? idx + HEADER_ROWS + 1 : lastRow + 1;
  sh.getRange(r, 1, 1, row.length).setValues([row]);
}
function toCell(v, spec){
  const t = spec ? spec.type : 'text';
  if(v === undefined || v === null) return '';
  if(Array.isArray(v) || typeof v === 'object') return JSON.stringify(v);
  if(t === 'bool') return v === true || v === 'true' || v === '1' || v === 1;
  if(t === 'date'){ const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(v)); return m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : ''; }
  if(t === 'num') return v === '' ? '' : Number(v);
  return String(v);
}
function writeSettings(s){
  const sh = ss().getSheetByName(SPEC.settings.title);
  const cur = readSettings();
  const merged = Object.assign({}, cur, s);
  const rows = [];
  Object.keys(merged).forEach(k => { let v = merged[k]; if(Array.isArray(v)) v = v.join('\n'); rows.push([k, v]); });
  const n = Math.max(sh.getLastRow() - HEADER_ROWS, 0);
  if(n) sh.getRange(HEADER_ROWS + 1, 1, n, 2).clearContent();
  sh.getRange(HEADER_ROWS + 1, 1, rows.length, 2).setValues(rows);
}

/* ---------------- opmaak ---------------- */
function applyFormatting(){
  const book = ss();
  const C = SPEC.colors;
  SPEC.tabs.forEach(tab => {
    let sh = book.getSheetByName(tab.title);
    if(!sh){ sh = book.insertSheet(tab.title); sh.getRange(1, 1, 2, tab.cols.length).setValues([tab.cols.map(c => c.label), tab.cols.map(c => c.key)]); }
    const n = tab.cols.length, rows = Math.max(sh.getMaxRows(), 100);
    sh.setFrozenRows(2); sh.setFrozenColumns(1);
    sh.getRange(1, 1, rows, n).setFontFamily(SPEC.font).setFontSize(10).setVerticalAlignment('top').setWrap(true);
    sh.getRange(1, 1, 1, n).setBackground(C.black).setFontColor('#FFFFFF').setFontWeight('bold').setVerticalAlignment('middle').setWrap(false)
      .setBorder(null, null, true, null, null, null, C.red, SpreadsheetApp.BorderStyle.SOLID_THICK);
    sh.getRange(2, 1, 1, n).setBackground(C.grey).setFontColor(C.muted).setFontFamily('Roboto Mono').setFontSize(8).setFontStyle('italic').setVerticalAlignment('middle').setWrap(false);
    sh.setRowHeight(1, 34); sh.setRowHeight(2, 18);
    sh.getRange(3, 1, rows - 2, n).clearDataValidations();
    sh.clearConditionalFormatRules();
    const rules = [];
    tab.cols.forEach((c, i) => {
      const col = i + 1; const data = sh.getRange(3, col, rows - 2, 1);
      sh.setColumnWidth(col, c.type === 'long' ? 320 : (['id','num','date','bool'].indexOf(c.type) >= 0 ? 90 : 150));
      if(c.type === 'id') data.setFontFamily('Roboto Mono').setFontSize(9).setFontColor(C.muted).setNumberFormat('@');
      if(c.type === 'ts') data.setFontSize(8).setFontColor(C.muted);
      if(c.type === 'date') data.setNumberFormat('dd-mm-yyyy').setHorizontalAlignment('left');
      if(c.type === 'num') data.setNumberFormat('0.##').setHorizontalAlignment('right');
      if(c.type === 'bool') data.setDataValidation(SpreadsheetApp.newDataValidation().requireCheckbox().build());
      if(c.type === 'owner') data.setDataValidation(SpreadsheetApp.newDataValidation().requireValueInRange(book.getRange('Team!$B$3:$B$200'), true).setAllowInvalid(true).build());
      if(c.type === 'list'){
        if(typeof c.opts === 'string'){
          const ref = SPEC.tabs.find(t => t.key === c.opts);
          data.setDataValidation(SpreadsheetApp.newDataValidation().requireValueInRange(book.getRange("'" + ref.title + "'!$A$3:$A$600"), true).setAllowInvalid(true).build());
        } else {
          data.setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(c.opts, true).setAllowInvalid(true).build());
          c.opts.forEach(v => { const sc = SPEC.statusColors[v]; if(sc) rules.push(SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo(v).setBackground(sc[0]).setFontColor(sc[1]).setBold(true).setRanges([data]).build()); });
        }
      }
    });
    sh.setConditionalFormatRules(rules);
    const bands = sh.getRange(3, 1, rows - 2, n).getBandings(); bands.forEach(b => b.remove());
    sh.getRange(3, 1, rows - 2, n).applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY, false, false);
  });
}
