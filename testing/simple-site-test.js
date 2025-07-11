const axios = require('axios');

async function testSite(baseUrl = 'http://localhost:3000') {
  console.log('🚀 Starting Site Test...\n');
  console.log(`Base URL: ${baseUrl}\n`);

  const routes = [
    '/',
    '/about',
    '/chapters',
    '/chapters/skcv',
    '/chapters/skie',
    '/chapters/skla', 
    '/chapters/sknc',
    '/chapters/skwa',
    '/events',
    '/gallery',
    '/store',
    '/cars',
    '/forum',
    '/contact',
    '/membership',
    '/membership/join',
    '/login',
    '/signup',
    '/admin',
    '/admin/login',
    '/member/dashboard',
    '/api/health',
    '/api/clubs',
    '/api/events'
  ];

  let passed = 0;
  let failed = 0;
  const results = [];

  for (const route of routes) {
    try {
      const startTime = Date.now();
      const response = await axios.get(`${baseUrl}${route}`, { 
        timeout: 10000,
        validateStatus: (status) => status < 500
      });
      const responseTime = Date.now() - startTime;
      
      console.log(`✅ ${route} - ${response.status} (${responseTime}ms)`);
      passed++;
      results.push({
        route,
        status: response.status,
        responseTime,
        result: 'passed'
      });
    } catch (error) {
      console.log(`❌ ${route} - ${error.message}`);
      failed++;
      results.push({
        route,
        error: error.message,
        result: 'failed'
      });
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('📊 TEST RESULTS');
  console.log('='.repeat(50));
  console.log(`Total Routes Tested: ${routes.length}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`Success Rate: ${((passed / routes.length) * 100).toFixed(1)}%`);

  if (failed > 0) {
    console.log('\n❌ Failed Routes:');
    results.filter(r => r.result === 'failed').forEach(r => {
      console.log(`   ${r.route} - ${r.error}`);
    });
  }

  // Test some specific functionality
  console.log('\n🔍 Testing Specific Features...');
  
  // Test if pages return HTML content
  try {
    const homeResponse = await axios.get(`${baseUrl}/`);
    if (homeResponse.data.includes('<html>')) {
      console.log('✅ Homepage returns HTML content');
    } else {
      console.log('⚠️  Homepage content may be incomplete');
    }
  } catch (error) {
    console.log('❌ Homepage test failed');
  }

  // Test API endpoint
  try {
    const apiResponse = await axios.get(`${baseUrl}/api/clubs`);
    console.log(`✅ API endpoint working - Status: ${apiResponse.status}`);
  } catch (error) {
    console.log(`⚠️  API endpoint issue: ${error.message}`);
  }

  console.log('\n🎯 Quick Manual Checks Needed:');
  console.log('1. Check navigation menu works');
  console.log('2. Test chapter page links');
  console.log('3. Verify forms submit correctly');
  console.log('4. Test PayPal integration');
  console.log('5. Check mobile responsiveness');
  
  return { passed, failed, total: routes.length };
}

// Run if called directly
if (require.main === module) {
  const baseUrl = process.argv[2] || 'http://localhost:3000';
  testSite(baseUrl)
    .then(() => {
      console.log('\n✅ Testing completed!');
    })
    .catch((error) => {
      console.error('\n❌ Testing failed:', error);
    });
}

module.exports = testSite;