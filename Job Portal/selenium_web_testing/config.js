const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

// Base URL for the Job Portal frontend (adjust if needed)
const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';

// Create a driver instance with Chrome (headless optional)
function buildDriver() {
  const options = new chrome.Options();
  if (process.env.HEADLESS === 'true') {
    options.addArguments('--headless', '--disable-gpu');
  }
  return new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();
}

module.exports = { buildDriver, BASE_URL, By, until };
