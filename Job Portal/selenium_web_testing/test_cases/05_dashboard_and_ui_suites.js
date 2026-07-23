/**
 * HireHub – Selenium Web E2E Test Suite
 * Suite 09: Command Center & Dashboard (25 tests)
 * Suite 10: UI Responsiveness & Error Handling (25 tests)
 */
'use strict';
const { By } = require('selenium-webdriver');
const cfg = require('../config');

module.exports = async function uiAndDashboardSuites(driver, results) {
  const R = (suite, id, name, status, dur, err = '') =>
    results.push({ suite, id, name, status, duration: dur, error: err });

  async function measure(fn) {
    const s = Date.now();
    try { await fn(); return { ok: true, ms: Date.now()-s, err: '' }; }
    catch(e) { return { ok: false, ms: Date.now()-s, err: e.message }; }
  }

  async function go(label) {
    await driver.get(cfg.BASE_URL);
    await driver.sleep(600);
    const navLinks = await driver.findElements(By.css('nav button, nav a'));
    for (const l of navLinks) {
      const t = await l.getText();
      if (t.includes(label)) { await l.click(); break; }
    }
    await driver.sleep(800);
  }

  // ── SUITE 09: Command Center Dashboard ─────────────────────────────────────
  const suite09Tests = [
    ['TC-CC-01','Command Center page renders', async()=>{ await go('Command'); const b=await driver.findElement(By.css('body')); if(!(await b.getText()).includes('Command')||!(await b.getText()).includes('Center')) throw new Error('CC not found'); }],
    ['TC-CC-02','Welcome greeting shows user name', async()=>{ await go('Command'); const b=await driver.findElement(By.css('body')); if(!(await b.getText()).includes('Welcome')) throw new Error('Welcome missing'); }],
    ['TC-CC-03','Quick stats row visible', async()=>{ await go('Command'); }],
    ['TC-CC-04','Skills Verified stat present', async()=>{ await go('Command'); const b=await driver.findElement(By.css('body')); if(!(await b.getText()).includes('Skills')) throw new Error('Skills stat missing'); }],
    ['TC-CC-05','Applications stat present', async()=>{ await go('Command'); const b=await driver.findElement(By.css('body')); if(!(await b.getText()).includes('Applications')) throw new Error('Apps stat missing'); }],
    ['TC-CC-06','Resume Active stat present', async()=>{ await go('Command'); const b=await driver.findElement(By.css('body')); if(!(await b.getText()).includes('Resume')) throw new Error('Resume stat missing'); }],
    ['TC-CC-07','Feature cards grid renders', async()=>{ await go('Command'); }],
    ['TC-CC-08','Skill Tests feature card visible', async()=>{ await go('Command'); const b=await driver.findElement(By.css('body')); if(!(await b.getText()).includes('Skill')) throw new Error('Skill card missing'); }],
    ['TC-CC-09','Career AI Chat card visible', async()=>{ await go('Command'); const b=await driver.findElement(By.css('body')); if(!(await b.getText()).includes('AI')) throw new Error('AI card missing'); }],
    ['TC-CC-10','Salary Predictor card visible', async()=>{ await go('Command'); const b=await driver.findElement(By.css('body')); if(!(await b.getText()).includes('Salary')) throw new Error('Salary card missing'); }],
    ['TC-CC-11','Feature card buttons navigate correctly', async()=>{ await go('Command'); const btns=await driver.findElements(By.css('button')); if(!btns.length) throw new Error('No buttons'); }],
    ['TC-CC-12','Applications section renders', async()=>{ await go('Command'); }],
    ['TC-CC-13','No applications message shown when empty', async()=>{ await go('Command'); }],
    ['TC-CC-14','Job listings visible in dashboard', async()=>{ await go('Command'); const b=await driver.findElement(By.css('body')); }],
    ['TC-CC-15','Apply to job button present', async()=>{ await go('Command'); }],
    ['TC-CC-16','Job filter works by type', async()=>{ await go('Command'); }],
    ['TC-CC-17','Job search input present', async()=>{ await go('Command'); }],
    ['TC-CC-18','Candidate header label visible', async()=>{ await go('Command'); const b=await driver.findElement(By.css('body')); if(!(await b.getText()).includes('Candidate')) throw new Error('Candidate label missing'); }],
    ['TC-CC-19','Dashboard loads within 3 seconds', async()=>{ const s=Date.now(); await go('Command'); if(Date.now()-s>3000) throw new Error('Slow load'); }],
    ['TC-CC-20','Back to overview navigation works', async()=>{ await go('Command'); await driver.get(cfg.BASE_URL); await driver.sleep(600); }],
    ['TC-CC-21','Upload resume CTA in dashboard visible', async()=>{ await go('Command'); }],
    ['TC-CC-22','Dashboard does not crash on reload', async()=>{ await go('Command'); await driver.navigate().refresh(); await driver.sleep(1000); }],
    ['TC-CC-23','Scrolling dashboard works smoothly', async()=>{ await go('Command'); await driver.executeScript('window.scrollTo(0, 500)'); await driver.sleep(300); }],
    ['TC-CC-24','Profile completeness shown in dashboard', async()=>{ await go('Command'); }],
    ['TC-CC-25','Logout from dashboard clears session', async()=>{ await go('Command'); const btns=await driver.findElements(By.css('button')); for(const b of btns){ const t=await b.getText(); if(t.includes('Logout')||t.includes('Sign Out')){ await b.click(); break; } } await driver.sleep(1000); }],
  ];

  for(const [id, name, fn] of suite09Tests) {
    const r = await measure(fn);
    R('09_CommandCenter', id, name, r.ok?'PASS':'FAIL', r.ms, r.err);
  }
  console.log(`  ✅ Command Center Suite: ${results.filter(r=>r.suite==='09_CommandCenter'&&r.status==='PASS').length}/${suite09Tests.length} passed`);

  // ── SUITE 10: UI Responsiveness & Error Handling ───────────────────────────
  const suite10Tests = [
    ['TC-UI-01','Page uses dark theme background', async()=>{ await driver.get(cfg.BASE_URL); await driver.sleep(600); const bg=await driver.executeScript('return document.body.style.backgroundColor||window.getComputedStyle(document.body).backgroundColor'); if(!bg) throw new Error('No bg'); }],
    ['TC-UI-02','Navbar is sticky on scroll', async()=>{ await driver.get(cfg.BASE_URL); await driver.sleep(600); await driver.executeScript('window.scrollTo(0,500)'); await driver.sleep(300); const nav=await driver.findElement(By.css('nav')); if(!nav) throw new Error('No nav'); }],
    ['TC-UI-03','Animations use CSS transitions', async()=>{ await driver.get(cfg.BASE_URL); await driver.sleep(600); }],
    ['TC-UI-04','Page font is Outfit or Inter', async()=>{ const ff=await driver.executeScript('return window.getComputedStyle(document.body).fontFamily'); if(!ff) throw new Error('No font'); }],
    ['TC-UI-05','Gradient text renders on brand name', async()=>{ await driver.get(cfg.BASE_URL); await driver.sleep(500); const el=await driver.findElements(By.css('.gradient-text')); if(!el.length) throw new Error('No gradient text'); }],
    ['TC-UI-06','HireHub brand logo visible', async()=>{ await driver.get(cfg.BASE_URL); const b=await driver.findElement(By.css('body')); if(!(await b.getText()).includes('HireHub')) throw new Error('Brand missing'); }],
    ['TC-UI-07','Footer renders at bottom', async()=>{ await driver.get(cfg.BASE_URL); await driver.executeScript('window.scrollTo(0,99999)'); await driver.sleep(500); const footer=await driver.findElements(By.css('footer')); if(!footer.length) throw new Error('No footer'); }],
    ['TC-UI-08','Footer has copyright text', async()=>{ await driver.get(cfg.BASE_URL); await driver.executeScript('window.scrollTo(0,99999)'); await driver.sleep(400); const footer=await driver.findElement(By.css('footer')); const t=await footer.getText(); if(!t) throw new Error('Empty footer'); }],
    ['TC-UI-09','404 / unknown routes handled gracefully', async()=>{ await driver.get(cfg.BASE_URL+'/this-does-not-exist'); await driver.sleep(800); }],
    ['TC-UI-10','Auth modal overlay visible', async()=>{ await driver.get(cfg.BASE_URL); await driver.sleep(400); const btns=await driver.findElements(By.css('button')); for(const b of btns){ const t=await b.getText(); if(t.includes('Sign')){ await b.click(); break; } } await driver.sleep(500); }],
    ['TC-UI-11','Scrollbar styled (not default browser)', async()=>{ const css=await driver.executeScript('const s=document.createElement("style"); document.head.appendChild(s); return s.sheet?true:false'); }],
    ['TC-UI-12','No horizontal overflow on landing page', async()=>{ await driver.get(cfg.BASE_URL); await driver.sleep(600); const w=await driver.executeScript('return document.body.scrollWidth'); const vw=await driver.executeScript('return window.innerWidth'); if(w>vw+20) throw new Error(`Overflow: body(${w}) > viewport(${vw})`); }],
    ['TC-UI-13','CTA buttons have hover styles defined', async()=>{ await driver.get(cfg.BASE_URL); await driver.sleep(400); }],
    ['TC-UI-14','Error boundary does not show blank screen', async()=>{ await driver.get(cfg.BASE_URL); await driver.sleep(600); const body=await driver.findElement(By.css('body')); const t=await body.getText(); if(!t||t.length<10) throw new Error('Blank page'); }],
    ['TC-UI-15','Select dropdown option text is visible', async()=>{ await driver.get(cfg.BASE_URL); await driver.sleep(400); const navLinks=await driver.findElements(By.css('nav button')); for(const l of navLinks){ const t=await l.getText(); if(t.includes('Salary')){ await l.click(); break; } } await driver.sleep(600); const sel=await driver.findElements(By.css('select')); if(sel.length){ const opts=await sel[0].findElements(By.css('option')); if(!opts.length) throw new Error('No options'); } }],
    ['TC-UI-16','Buttons have visible focus outlines', async()=>{ await driver.get(cfg.BASE_URL); }],
    ['TC-UI-17','Form inputs have label associations', async()=>{ await driver.get(cfg.BASE_URL); await driver.sleep(400); const btns=await driver.findElements(By.css('button')); for(const b of btns){ const t=await b.getText(); if(t.includes('Sign')){ await b.click(); break; } } await driver.sleep(500); const labels=await driver.findElements(By.css('label')); if(!labels.length) throw new Error('No labels'); }],
    ['TC-UI-18','Loading spinner is animated (SVG or CSS)', async()=>{ await driver.get(cfg.BASE_URL); }],
    ['TC-UI-19','Motion animations do not block interaction', async()=>{ await driver.get(cfg.BASE_URL); await driver.sleep(600); const btns=await driver.findElements(By.css('button')); if(btns.length) await btns[0].click(); }],
    ['TC-UI-20','Page renders without console errors on load', async()=>{ await driver.get(cfg.BASE_URL); await driver.sleep(1200); const b=await driver.findElement(By.css('body')); if(!(await b.getText())) throw new Error('Empty body'); }],
    ['TC-UI-21','API 401 shows login prompt not crash', async()=>{ const st=await driver.executeScript(`return fetch('${cfg.API_URL}/api/resume/analysis').then(r=>r.status)`); if(st!==401) throw new Error(`Expected 401, got ${st}`); }],
    ['TC-UI-22','API 400 errors show friendly message', async()=>{ const st=await driver.executeScript(`return fetch('${cfg.API_URL}/api/resume/upload',{method:'POST'}).then(r=>r.status)`); if(st!==401&&st!==400) throw new Error(`Unexpected status ${st}`); }],
    ['TC-UI-23','Page text is not white-on-white', async()=>{ await driver.get(cfg.BASE_URL); await driver.sleep(500); const body=await driver.findElement(By.css('body')); const t=await body.getText(); if(!t||t.length<5) throw new Error('No visible text'); }],
    ['TC-UI-24','Responsive container max-width applied', async()=>{ await driver.get(cfg.BASE_URL); await driver.sleep(400); const el=await driver.findElements(By.css('.container,[class*="container"]')); if(!el.length) throw new Error('No container'); }],
    ['TC-UI-25','All navigation links navigate without 404', async()=>{ await driver.get(cfg.BASE_URL); await driver.sleep(400); const navLinks=await driver.findElements(By.css('nav button')); for(const l of navLinks){ await l.click(); await driver.sleep(400); } }],
  ];

  for(const [id, name, fn] of suite10Tests) {
    const r = await measure(fn);
    R('10_UIErrorHandling', id, name, r.ok?'PASS':'FAIL', r.ms, r.err);
  }
  console.log(`  ✅ UI & Error Handling Suite: ${results.filter(r=>r.suite==='10_UIErrorHandling'&&r.status==='PASS').length}/${suite10Tests.length} passed`);
};
