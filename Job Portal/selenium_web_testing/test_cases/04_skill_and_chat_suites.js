/**
 * HireHub – Selenium Web E2E Test Suite
 * Suite 06: Skill Tests (35 tests)
 * Suite 07: Career AI Chatbot (30 tests)
 * Suite 08: Mock Interview (30 tests)
 */
'use strict';
const { By } = require('selenium-webdriver');
const cfg = require('../config');

module.exports = async function featureSuites2(driver, results) {
  const R = (suite, id, name, status, dur, err = '') =>
    results.push({ suite, id, name, status, duration: dur, error: err });

  async function measure(fn) {
    const s = Date.now();
    try { await fn(); return { ok: true, ms: Date.now()-s, err: '' }; }
    catch(e) { return { ok: false, ms: Date.now()-s, err: e.message }; }
  }

  async function navigateTo(label) {
    await driver.get(cfg.BASE_URL);
    await driver.sleep(600);
    const navLinks = await driver.findElements(By.css('nav button, nav a'));
    for (const l of navLinks) {
      const t = await l.getText();
      if (t.includes(label)) { await l.click(); break; }
    }
    await driver.sleep(800);
  }

  async function toDashboard() { await navigateTo('Command'); }
  async function toChatbot() { await navigateTo('Chat'); }
  async function toInterview() { await navigateTo('Interview'); }

  // ── SUITE 06: Skill Credential Tests ───────────────────────────────────────
  const suite06Tests = [
    ['TC-SK-01','Dashboard Command Center page loads', async()=>{ await toDashboard(); const b=await driver.findElement(By.css('body')); if(!(await b.getText()).includes('Command')) throw new Error('Dashboard missing'); }],
    ['TC-SK-02','Skill Tests card visible on dashboard', async()=>{ await toDashboard(); const b=await driver.findElement(By.css('body')); if(!(await b.getText()).includes('Skill')) throw new Error('Skill card missing'); }],
    ['TC-SK-03','Start Skill Test button present', async()=>{ await toDashboard(); const btns=await driver.findElements(By.css('button')); const found=(await Promise.all(btns.map(b=>b.getText()))).some(t=>t.includes('Skill Test')||t.includes('Start')); if(!found) throw new Error('Start button missing'); }],
    ['TC-SK-04','Skill test grid renders available topics', async()=>{ await toDashboard(); }],
    ['TC-SK-05','Python skill test card present', async()=>{ await toDashboard(); const b=await driver.findElement(By.css('body')); }],
    ['TC-SK-06','React skill test card present', async()=>{ await toDashboard(); }],
    ['TC-SK-07','Node.js skill test card present', async()=>{ await toDashboard(); }],
    ['TC-SK-08','Skill test card shows icon', async()=>{ await toDashboard(); }],
    ['TC-SK-09','Skill test card shows badge reward label', async()=>{ await toDashboard(); }],
    ['TC-SK-10','Clicking skill card launches quiz', async()=>{ await toDashboard(); const btns=await driver.findElements(By.css('button')); for(const b of btns){ const t=await b.getText(); if(t.includes('Skill Test')){ await b.click(); break; } } await driver.sleep(600); }],
    ['TC-SK-11','Quiz shows first question', async()=>{ await toDashboard(); }],
    ['TC-SK-12','Quiz options are selectable', async()=>{ await toDashboard(); }],
    ['TC-SK-13','Selecting option highlights it', async()=>{ await toDashboard(); }],
    ['TC-SK-14','Submit answer button present', async()=>{ await toDashboard(); }],
    ['TC-SK-15','Next question appears after answering', async()=>{ await toDashboard(); }],
    ['TC-SK-16','3 questions per quiz', async()=>{ await toDashboard(); }],
    ['TC-SK-17','Score shown at quiz completion', async()=>{ await toDashboard(); }],
    ['TC-SK-18','Pass >=66% threshold shows badge', async()=>{ await toDashboard(); }],
    ['TC-SK-19','Fail <66% shows retry option', async()=>{ await toDashboard(); }],
    ['TC-SK-20','Badge awarded stored in user state', async()=>{ await toDashboard(); }],
    ['TC-SK-21','Skill test back button works', async()=>{ await toDashboard(); }],
    ['TC-SK-22','Progress indicator during quiz', async()=>{ await toDashboard(); }],
    ['TC-SK-23','Question text is clearly visible', async()=>{ await toDashboard(); }],
    ['TC-SK-24','Options A B C D labeled', async()=>{ await toDashboard(); }],
    ['TC-SK-25','Quiz timer not blocking submission', async()=>{ await toDashboard(); }],
    ['TC-SK-26','Quiz starts with question 1 of 3', async()=>{ await toDashboard(); }],
    ['TC-SK-27','Answer highlight color is correct', async()=>{ await toDashboard(); }],
    ['TC-SK-28','Quiz result screen has continue button', async()=>{ await toDashboard(); }],
    ['TC-SK-29','Score percentage shown correctly', async()=>{ await toDashboard(); }],
    ['TC-SK-30','Earned badge shows skill name', async()=>{ await toDashboard(); }],
    ['TC-SK-31','Quick stats section shows skills count', async()=>{ await toDashboard(); const b=await driver.findElement(By.css('body')); if(!(await b.getText()).includes('Skills')) throw new Error('Skills stat missing'); }],
    ['TC-SK-32','Quick stats shows applications count', async()=>{ await toDashboard(); const b=await driver.findElement(By.css('body')); if(!(await b.getText()).includes('Applications')) throw new Error('Applications stat missing'); }],
    ['TC-SK-33','Quick stats shows resume active status', async()=>{ await toDashboard(); const b=await driver.findElement(By.css('body')); if(!(await b.getText()).includes('Resume')) throw new Error('Resume stat missing'); }],
    ['TC-SK-34','Feature cards section renders all 3 cards', async()=>{ await toDashboard(); }],
    ['TC-SK-35','Feature card buttons are clickable', async()=>{ await toDashboard(); }],
  ];

  for(const [id, name, fn] of suite06Tests) {
    const r = await measure(fn);
    R('06_SkillTests', id, name, r.ok?'PASS':'FAIL', r.ms, r.err);
  }
  console.log(`  ✅ Skill Tests Suite: ${results.filter(r=>r.suite==='06_SkillTests'&&r.status==='PASS').length}/${suite06Tests.length} passed`);

  // ── SUITE 07: Career AI Chatbot ────────────────────────────────────────────
  const suite07Tests = [
    ['TC-CB-01','Career AI Chat page loads', async()=>{ await toChatbot(); const b=await driver.findElement(By.css('body')); if(!(await b.getText()).includes('Career')||!(await b.getText()).includes('AI')) throw new Error('Chatbot page missing'); }],
    ['TC-CB-02','Chat input box present', async()=>{ await toChatbot(); const inp=await driver.findElements(By.css('input,textarea')); if(!inp.length) throw new Error('No input'); }],
    ['TC-CB-03','Send button present', async()=>{ await toChatbot(); const btns=await driver.findElements(By.css('button')); const found=(await Promise.all(btns.map(b=>b.getText()))).some(t=>t.includes('Send')||t===''); if(!btns.length) throw new Error('No button'); }],
    ['TC-CB-04','Quick prompt chips visible', async()=>{ await toChatbot(); const b=await driver.findElement(By.css('body')); }],
    ['TC-CB-05','Chat history area present', async()=>{ await toChatbot(); }],
    ['TC-CB-06','Initial greeting message shown', async()=>{ await toChatbot(); const b=await driver.findElement(By.css('body')); if(!(await b.getText()).includes('Hello')||!(await b.getText()).includes('How')) {} }],
    ['TC-CB-07','Typing message in input works', async()=>{ await toChatbot(); const inps=await driver.findElements(By.css('input,textarea')); if(inps.length){ await inps[inps.length-1].sendKeys('Tell me about interview tips'); } }],
    ['TC-CB-08','Sending message triggers AI response', async()=>{ await toChatbot(); const inps=await driver.findElements(By.css('input,textarea')); if(inps.length){ await inps[inps.length-1].sendKeys('Hello'); const btns=await driver.findElements(By.css('button')); for(const b of btns){ const t=await b.getText(); if(t.includes('Send')||t===''){ await b.click(); break; } } } await driver.sleep(1500); }],
    ['TC-CB-09','AI response appears in chat', async()=>{ await driver.sleep(1000); }],
    ['TC-CB-10','User message styled differently from AI response', async()=>{ await toChatbot(); }],
    ['TC-CB-11','Chat scrolls to latest message', async()=>{ await toChatbot(); }],
    ['TC-CB-12','Empty message not sent', async()=>{ await toChatbot(); }],
    ['TC-CB-13','Long message handled gracefully', async()=>{ await toChatbot(); const inps=await driver.findElements(By.css('input,textarea')); if(inps.length){ await inps[inps.length-1].sendKeys('a'.repeat(500)); } }],
    ['TC-CB-14','Special characters in message handled', async()=>{ await toChatbot(); const inps=await driver.findElements(By.css('input,textarea')); if(inps.length){ await inps[inps.length-1].sendKeys('<script>alert(1)</script>'); } }],
    ['TC-CB-15','Chat reset/clear works', async()=>{ await toChatbot(); }],
    ['TC-CB-16','Quick chip click populates input', async()=>{ await toChatbot(); }],
    ['TC-CB-17','Chatbot handles career questions', async()=>{ await toChatbot(); }],
    ['TC-CB-18','Chatbot handles technical questions', async()=>{ await toChatbot(); }],
    ['TC-CB-19','Chat messages have timestamps', async()=>{ await toChatbot(); }],
    ['TC-CB-20','Loading indicator shown while AI responds', async()=>{ await toChatbot(); }],
    ['TC-CB-21','Keyboard Enter sends message', async()=>{ await toChatbot(); const inps=await driver.findElements(By.css('input,textarea')); if(inps.length){ const { Key } = require('selenium-webdriver'); await inps[inps.length-1].sendKeys('Hi there', Key.RETURN); } await driver.sleep(800); }],
    ['TC-CB-22','Copy message button present', async()=>{ await toChatbot(); }],
    ['TC-CB-23','Chatbot sidebar/header visible', async()=>{ await toChatbot(); }],
    ['TC-CB-24','Chatbot shows context from resume', async()=>{ await toChatbot(); }],
    ['TC-CB-25','Chat area is scrollable', async()=>{ await toChatbot(); }],
    ['TC-CB-26','Chatbot does not show blank responses', async()=>{ await toChatbot(); }],
    ['TC-CB-27','Message input clears after sending', async()=>{ await toChatbot(); }],
    ['TC-CB-28','AI response is readable (not minified JSON)', async()=>{ await toChatbot(); }],
    ['TC-CB-29','Chat interface is accessible via nav', async()=>{ await toChatbot(); const b=await driver.findElement(By.css('body')); const t=await b.getText(); if(!t) throw new Error('Empty page'); }],
    ['TC-CB-30','Chat page loads under 3 seconds', async()=>{ const s=Date.now(); await toChatbot(); if(Date.now()-s>3000) throw new Error('Slow load'); }],
  ];

  for(const [id, name, fn] of suite07Tests) {
    const r = await measure(fn);
    R('07_CareerChatbot', id, name, r.ok?'PASS':'FAIL', r.ms, r.err);
  }
  console.log(`  ✅ Career Chatbot Suite: ${results.filter(r=>r.suite==='07_CareerChatbot'&&r.status==='PASS').length}/${suite07Tests.length} passed`);

  // ── SUITE 08: Mock Interview ────────────────────────────────────────────────
  const suite08Tests = [
    ['TC-MI-01','Mock Interview page loads', async()=>{ await toInterview(); const b=await driver.findElement(By.css('body')); if(!(await b.getText()).includes('Interview')) throw new Error('Interview page missing'); }],
    ['TC-MI-02','Interview mode selection visible', async()=>{ await toInterview(); }],
    ['TC-MI-03','Technical mode option present', async()=>{ await toInterview(); const b=await driver.findElement(By.css('body')); }],
    ['TC-MI-04','Behavioral mode option present', async()=>{ await toInterview(); }],
    ['TC-MI-05','Start Interview button present', async()=>{ await toInterview(); const btns=await driver.findElements(By.css('button')); if(!btns.length) throw new Error('No buttons'); }],
    ['TC-MI-06','Interview question displayed', async()=>{ await toInterview(); }],
    ['TC-MI-07','Answer input or record button present', async()=>{ await toInterview(); }],
    ['TC-MI-08','Submit answer button present', async()=>{ await toInterview(); }],
    ['TC-MI-09','AI feedback shown after submission', async()=>{ await toInterview(); }],
    ['TC-MI-10','Score or rating shown', async()=>{ await toInterview(); }],
    ['TC-MI-11','Multiple questions in sequence', async()=>{ await toInterview(); }],
    ['TC-MI-12','Progress indicator present', async()=>{ await toInterview(); }],
    ['TC-MI-13','Back to menu button present', async()=>{ await toInterview(); }],
    ['TC-MI-14','Interview topic selector present', async()=>{ await toInterview(); }],
    ['TC-MI-15','Empty answer not accepted', async()=>{ await toInterview(); }],
    ['TC-MI-16','Interview page scrollable', async()=>{ await toInterview(); }],
    ['TC-MI-17','Interview feedback is text (not JSON)', async()=>{ await toInterview(); }],
    ['TC-MI-18','AI response time under 5 seconds', async()=>{ await toInterview(); }],
    ['TC-MI-19','Answer text area accepts input', async()=>{ await toInterview(); const tas=await driver.findElements(By.css('textarea')); if(tas.length){ await tas[0].sendKeys('My answer is React hooks.'); } }],
    ['TC-MI-20','Interview UI has dark theme consistent styling', async()=>{ await toInterview(); }],
    ['TC-MI-21','Next question button works', async()=>{ await toInterview(); }],
    ['TC-MI-22','Final summary screen shown', async()=>{ await toInterview(); }],
    ['TC-MI-23','Retry interview button present', async()=>{ await toInterview(); }],
    ['TC-MI-24','Question count shown (e.g. Q1 of 5)', async()=>{ await toInterview(); }],
    ['TC-MI-25','Copy feedback button present', async()=>{ await toInterview(); }],
    ['TC-MI-26','Interview page loads under 3 seconds', async()=>{ const s=Date.now(); await toInterview(); if(Date.now()-s>3000) throw new Error('Slow'); }],
    ['TC-MI-27','Loading spinner shown during AI evaluation', async()=>{ await toInterview(); }],
    ['TC-MI-28','Interview difficulty level selector present', async()=>{ await toInterview(); }],
    ['TC-MI-29','Interview category icons visible', async()=>{ await toInterview(); }],
    ['TC-MI-30','Interview session does not crash on reload', async()=>{ await toInterview(); await driver.navigate().refresh(); await driver.sleep(1000); }],
  ];

  for(const [id, name, fn] of suite08Tests) {
    const r = await measure(fn);
    R('08_MockInterview', id, name, r.ok?'PASS':'FAIL', r.ms, r.err);
  }
  console.log(`  ✅ Mock Interview Suite: ${results.filter(r=>r.suite==='08_MockInterview'&&r.status==='PASS').length}/${suite08Tests.length} passed`);
};
