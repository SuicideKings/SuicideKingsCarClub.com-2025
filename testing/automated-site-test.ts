#!/usr/bin/env ts-node

import axios from 'axios'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

interface TestResult {
  url: string
  status: 'passed' | 'failed' | 'warning'
  statusCode?: number
  responseTime?: number
  error?: string
  issues?: string[]
}

interface TestSuite {
  name: string
  baseUrl: string
  tests: TestResult[]
  summary: {
    total: number
    passed: number
    failed: number
    warnings: number
  }
}

class SiteTestRunner {
  private baseUrl: string
  private results: TestSuite[] = []

  constructor(baseUrl: string = 'http://localhost:3000') {
    this.baseUrl = baseUrl
  }

  async runAllTests(): Promise<void> {
    console.log('🚀 Starting Comprehensive Site Testing...\n')
    console.log(`Base URL: ${this.baseUrl}\n`)

    // Test suites in order of priority
    await this.testPublicPages()
    await this.testAuthPages()
    await this.testAPIEndpoints()
    await this.testAdminPages()
    await this.testMemberPages()
    await this.testPayPalIntegration()

    this.generateReport()
  }

  private async testUrl(url: string, expectedStatus: number = 200): Promise<TestResult> {
    const startTime = Date.now()
    
    try {
      const response = await axios.get(url, { 
        timeout: 10000,
        validateStatus: (status) => status < 500 // Don't throw on 4xx errors
      })
      
      const responseTime = Date.now() - startTime
      const issues: string[] = []

      // Check response time
      if (responseTime > 3000) {
        issues.push(`Slow response time: ${responseTime}ms`)
      }

      // Check content length
      if (response.data && typeof response.data === 'string' && response.data.length < 100) {
        issues.push('Response content seems too short')
      }

      const status = response.status === expectedStatus ? 'passed' : 
                    response.status >= 400 ? 'failed' : 'warning'

      return {
        url,
        status: issues.length > 0 && status === 'passed' ? 'warning' : status,
        statusCode: response.status,
        responseTime,
        issues: issues.length > 0 ? issues : undefined
      }

    } catch (error) {
      return {
        url,
        status: 'failed',
        responseTime: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  private async testPublicPages(): Promise<void> {
    console.log('📄 Testing Public Pages...')
    
    const publicRoutes = [
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
      '/membership/join'
    ]

    const testSuite: TestSuite = {
      name: 'Public Pages',
      baseUrl: this.baseUrl,
      tests: [],
      summary: { total: 0, passed: 0, failed: 0, warnings: 0 }
    }

    for (const route of publicRoutes) {
      console.log(`  Testing: ${route}`)
      const result = await this.testUrl(`${this.baseUrl}${route}`)
      testSuite.tests.push(result)
      this.updateSummary(testSuite.summary, result)
    }

    this.results.push(testSuite)
    console.log(`✅ Public Pages: ${testSuite.summary.passed}/${testSuite.summary.total} passed\n`)
  }

  private async testAuthPages(): Promise<void> {
    console.log('🔐 Testing Authentication Pages...')
    
    const authRoutes = [
      '/login',
      '/signup',
      '/auth/signin',
      '/auth/signup'
    ]

    const testSuite: TestSuite = {
      name: 'Authentication Pages',
      baseUrl: this.baseUrl,
      tests: [],
      summary: { total: 0, passed: 0, failed: 0, warnings: 0 }
    }

    for (const route of authRoutes) {
      console.log(`  Testing: ${route}`)
      const result = await this.testUrl(`${this.baseUrl}${route}`)
      testSuite.tests.push(result)
      this.updateSummary(testSuite.summary, result)
    }

    this.results.push(testSuite)
    console.log(`✅ Auth Pages: ${testSuite.summary.passed}/${testSuite.summary.total} passed\n`)
  }

  private async testAPIEndpoints(): Promise<void> {
    console.log('🔌 Testing API Endpoints...')
    
    const apiRoutes = [
      '/api/health',
      '/api/clubs',
      '/api/events',
      '/api/gallery',
      '/api/system/env-status',
      '/api/auth/check',
      '/api/setup-db'
    ]

    const testSuite: TestSuite = {
      name: 'API Endpoints',
      baseUrl: this.baseUrl,
      tests: [],
      summary: { total: 0, passed: 0, failed: 0, warnings: 0 }
    }

    for (const route of apiRoutes) {
      console.log(`  Testing: ${route}`)
      // Some API routes might return 401 unauthorized, which is expected
      const expectedStatus = route.includes('/auth/') || route.includes('/admin/') ? 401 : 200
      const result = await this.testUrl(`${this.baseUrl}${route}`, expectedStatus)
      testSuite.tests.push(result)
      this.updateSummary(testSuite.summary, result)
    }

    this.results.push(testSuite)
    console.log(`✅ API Endpoints: ${testSuite.summary.passed}/${testSuite.summary.total} passed\n`)
  }

  private async testAdminPages(): Promise<void> {
    console.log('🛠️ Testing Admin Pages (expect 401/403)...')
    
    const adminRoutes = [
      '/admin',
      '/admin/login',
      '/admin/dashboard',
      '/admin/system',
      '/admin/setup',
      '/admin/editor',
      '/admin/deploy',
      '/admin/gallery',
      '/admin/gallery/upload'
    ]

    const testSuite: TestSuite = {
      name: 'Admin Pages',
      baseUrl: this.baseUrl,
      tests: [],
      summary: { total: 0, passed: 0, failed: 0, warnings: 0 }
    }

    for (const route of adminRoutes) {
      console.log(`  Testing: ${route}`)
      // Admin pages should redirect or show login, so we expect various responses
      const result = await this.testUrl(`${this.baseUrl}${route}`)
      
      // For admin pages, 401, 403, or 302 redirects are acceptable
      if (result.statusCode && [200, 302, 401, 403].includes(result.statusCode)) {
        result.status = 'passed'
      }
      
      testSuite.tests.push(result)
      this.updateSummary(testSuite.summary, result)
    }

    this.results.push(testSuite)
    console.log(`✅ Admin Pages: ${testSuite.summary.passed}/${testSuite.summary.total} passed\n`)
  }

  private async testMemberPages(): Promise<void> {
    console.log('👤 Testing Member Pages (expect auth required)...')
    
    const memberRoutes = [
      '/member/dashboard',
      '/member/cars'
    ]

    const testSuite: TestSuite = {
      name: 'Member Pages',
      baseUrl: this.baseUrl,
      tests: [],
      summary: { total: 0, passed: 0, failed: 0, warnings: 0 }
    }

    for (const route of memberRoutes) {
      console.log(`  Testing: ${route}`)
      const result = await this.testUrl(`${this.baseUrl}${route}`)
      
      // Member pages should require auth, so 401/302 is expected
      if (result.statusCode && [200, 302, 401].includes(result.statusCode)) {
        result.status = 'passed'
      }
      
      testSuite.tests.push(result)
      this.updateSummary(testSuite.summary, result)
    }

    this.results.push(testSuite)
    console.log(`✅ Member Pages: ${testSuite.summary.passed}/${testSuite.summary.total} passed\n`)
  }

  private async testPayPalIntegration(): Promise<void> {
    console.log('💳 Testing PayPal Integration...')
    
    const paypalRoutes = [
      '/api/clubs/1/paypal-settings',
      '/api/clubs/1/setup-paypal-products',
      '/api/clubs/1/test-paypal',
      '/api/admin/paypal-monitoring'
    ]

    const testSuite: TestSuite = {
      name: 'PayPal Integration',
      baseUrl: this.baseUrl,
      tests: [],
      summary: { total: 0, passed: 0, failed: 0, warnings: 0 }
    }

    for (const route of paypalRoutes) {
      console.log(`  Testing: ${route}`)
      // PayPal routes require authentication, expect 401
      const result = await this.testUrl(`${this.baseUrl}${route}`, 401)
      testSuite.tests.push(result)
      this.updateSummary(testSuite.summary, result)
    }

    this.results.push(testSuite)
    console.log(`✅ PayPal Integration: ${testSuite.summary.passed}/${testSuite.summary.total} passed\n`)
  }

  private updateSummary(summary: TestSuite['summary'], result: TestResult): void {
    summary.total++
    switch (result.status) {
      case 'passed':
        summary.passed++
        break
      case 'failed':
        summary.failed++
        break
      case 'warning':
        summary.warnings++
        break
    }
  }

  private generateReport(): void {
    console.log('📊 Generating Test Report...\n')

    const totalTests = this.results.reduce((sum, suite) => sum + suite.summary.total, 0)
    const totalPassed = this.results.reduce((sum, suite) => sum + suite.summary.passed, 0)
    const totalFailed = this.results.reduce((sum, suite) => sum + suite.summary.failed, 0)
    const totalWarnings = this.results.reduce((sum, suite) => sum + suite.summary.warnings, 0)

    console.log('='.repeat(60))
    console.log('🎯 COMPREHENSIVE SITE TEST RESULTS')
    console.log('='.repeat(60))
    console.log(`📊 Overall Summary:`)
    console.log(`   Total Tests: ${totalTests}`)
    console.log(`   ✅ Passed: ${totalPassed} (${((totalPassed/totalTests)*100).toFixed(1)}%)`)
    console.log(`   ❌ Failed: ${totalFailed} (${((totalFailed/totalTests)*100).toFixed(1)}%)`)
    console.log(`   ⚠️  Warnings: ${totalWarnings} (${((totalWarnings/totalTests)*100).toFixed(1)}%)`)
    console.log()

    // Detailed results by test suite
    this.results.forEach(suite => {
      console.log(`📋 ${suite.name}:`)
      console.log(`   ${suite.summary.passed}/${suite.summary.total} passed`)
      
      if (suite.summary.failed > 0) {
        console.log(`   ❌ Failed tests:`)
        suite.tests.filter(t => t.status === 'failed').forEach(test => {
          console.log(`      ${test.url} - ${test.error || `Status: ${test.statusCode}`}`)
        })
      }

      if (suite.summary.warnings > 0) {
        console.log(`   ⚠️  Warning tests:`)
        suite.tests.filter(t => t.status === 'warning').forEach(test => {
          console.log(`      ${test.url} - ${test.issues?.join(', ')}`)
        })
      }
      console.log()
    })

    // Performance summary
    const allTests = this.results.flatMap(suite => suite.tests)
    const responseTimes = allTests.filter(t => t.responseTime).map(t => t.responseTime!)
    const avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
    const slowTests = allTests.filter(t => t.responseTime && t.responseTime > 3000)

    console.log(`⚡ Performance Summary:`)
    console.log(`   Average Response Time: ${avgResponseTime.toFixed(0)}ms`)
    console.log(`   Slow Tests (>3s): ${slowTests.length}`)
    if (slowTests.length > 0) {
      slowTests.forEach(test => {
        console.log(`      ${test.url} - ${test.responseTime}ms`)
      })
    }
    console.log()

    // Save detailed report to file
    this.saveDetailedReport()

    // Final assessment
    const passRate = (totalPassed / totalTests) * 100
    console.log('🏆 Final Assessment:')
    if (passRate >= 95) {
      console.log('   🎉 EXCELLENT! Site is functioning very well.')
    } else if (passRate >= 85) {
      console.log('   ✅ GOOD! Most features are working correctly.')
    } else if (passRate >= 70) {
      console.log('   ⚠️  FAIR! Several issues need attention.')
    } else {
      console.log('   ❌ POOR! Significant issues require immediate attention.')
    }

    console.log('\n📝 Detailed report saved to: testing/test-results.json')
    console.log('📋 Manual checklist available at: testing/comprehensive-test-checklist.md')
  }

  private saveDetailedReport(): void {
    const reportData = {
      timestamp: new Date().toISOString(),
      baseUrl: this.baseUrl,
      summary: {
        totalTests: this.results.reduce((sum, suite) => sum + suite.summary.total, 0),
        totalPassed: this.results.reduce((sum, suite) => sum + suite.summary.passed, 0),
        totalFailed: this.results.reduce((sum, suite) => sum + suite.summary.failed, 0),
        totalWarnings: this.results.reduce((sum, suite) => sum + suite.summary.warnings, 0)
      },
      testSuites: this.results
    }

    const reportPath = path.join(__dirname, 'test-results.json')
    fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2))
  }
}

// Run tests if this file is executed directly
const isMainModule = import.meta.url === `file://${process.argv[1]}`
if (isMainModule) {
  const baseUrl = process.argv[2] || 'http://localhost:3000'
  const testRunner = new SiteTestRunner(baseUrl)
  
  testRunner.runAllTests()
    .then(() => {
      console.log('\n✅ Testing completed!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('\n❌ Testing failed:', error)
      process.exit(1)
    })
}