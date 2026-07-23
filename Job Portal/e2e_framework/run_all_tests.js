/**
 * HireHub Master E2E & Load Testing Suite Execution Script
 * Executes all 6 test suites (300 test cases each = 1,800 test cases total)
 * Generates individual Excel reports and compiles the Master Excel Report.
 */
const { run: runSelenium } = require('./01_selenium_web_tests');
const { run: runAppium } = require('./02_appium_android_tests');
const { run: runUnit } = require('./03_unit_api_tests');
const { run: runValidation } = require('./04_validation_tests');
const { run: runDeployment } = require('./05_deployment_tests');
const { run: runLoad } = require('./06_load_performance_tests');
const { compileMasterReport } = require('./07_master_report_compiler');

async function main() {
  console.log('================================================================');
  console.log('       HIREHUB FULL E2E & LOAD TESTING EXECUTION SUITE          ');
  console.log('================================================================');
  console.log('Starting execution of 1,800 test cases across 6 categories...\n');

  const startTime = Date.now();

  console.log('1/6: Running Selenium Website Tests (300 cases)...');
  await runSelenium();

  console.log('\n2/6: Running Appium Android Tests (300 cases)...');
  await runAppium();

  console.log('\n3/6: Running API Unit Tests (300 cases)...');
  await runUnit();

  console.log('\n4/6: Running Schema & Data Validation Tests (300 cases)...');
  await runValidation();

  console.log('\n5/6: Running Deployment Status Tests (300 cases)...');
  await runDeployment();

  console.log('\n6/6: Running Load & Performance Tests (300 cases)...');
  await runLoad();

  console.log('\n----------------------------------------------------------------');
  console.log('Compiling Master Report (full-e2e-report.xlsx)...');
  await compileMasterReport();

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log('\n================================================================');
  console.log(` SUCCESS: All 1,800 Test Cases Executed & 7 Excel Reports Generated!`);
  console.log(` Total Time Elapsed: ${duration} seconds`);
  console.log('================================================================\n');
}

main().catch(err => {
  console.error('Test Suite Execution Error:', err);
  process.exit(1);
});
