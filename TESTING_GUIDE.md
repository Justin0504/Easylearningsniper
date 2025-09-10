# AI Daily Summary Feature Testing Guide

## 🚀 Quick Testing

### 1. Basic Functionality Test
```bash
# Test environment variables and AI functionality
node test-simple.js
```

### 2. API Endpoints Test
```bash
# Start development server
npm run dev

# Run API tests in another terminal
node test-api-endpoints.js
```

### 3. Complete Feature Test
```bash
# Run complete test suite
node test-daily-summary.js
```

## 📋 Testing Checklist

### ✅ Environment Configuration
- [ ] GEMINI_API_KEY is set
- [ ] DATABASE_URL is set
- [ ] Database connection is working
- [ ] At least one community exists

### ✅ AI Functionality
- [ ] Gemini API connection is working
- [ ] Post classification feature is working
- [ ] Daily summary generation is working
- [ ] Keyword matching fallback is working

### ✅ API Endpoints
- [ ] Community list API (`/api/communities`)
- [ ] Daily summary API (`/api/communities/[id]/daily-summary`)
- [ ] Post list API (`/api/communities/[id]/posts`)

### ✅ Frontend Functionality
- [ ] Daily summary component displays correctly
- [ ] Auto-refresh feature works (every 2 minutes)
- [ ] Manual refresh button works
- [ ] Real-time status indicator works

## 🧪 Test Scenarios

### Scenario 1: No Posts
- Community has no posts
- Should display "AI summaries will appear here once there are posts to analyze"
- Should display "Auto-refreshes every 2 minutes"

### Scenario 2: With Posts
- Community has posts
- Should display AI-generated summary
- Should display post statistics
- Should display today's post list

### Scenario 3: Real-time Updates
- After adding new posts
- Wait 2 minutes or manually refresh
- Summary should update automatically

## 🔧 Troubleshooting

### Issue 1: Gemini API Error
```
Error: models/gemini-pro is not found
```
**Solution**: Use `gemini-1.5-flash` model

### Issue 2: Database Connection Error
```
Error: Environment variable not found: DATABASE_URL
```
**Solution**: Check `DATABASE_URL` in `.env.local` file

### Issue 3: Module Import Error
```
Cannot find module './ai-gemini'
```
**Solution**: Use `ai-simple.ts` file

### Issue 4: API Endpoint 404
```
404 Not Found
```
**Solution**: Ensure development server is running

## 📊 Performance Testing

### Response Time Testing
```bash
# Test API response time
time curl http://localhost:3000/api/communities/[id]/daily-summary
```

### Concurrent Testing
```bash
# Test multiple concurrent requests
for i in {1..5}; do
  curl http://localhost:3000/api/communities/[id]/daily-summary &
done
wait
```

### Load Testing
```bash
# Install artillery for load testing
npm install -g artillery

# Create load test configuration
cat > load-test.yml << EOF
config:
  target: 'http://localhost:3000'
  phases:
    - duration: 60
      arrivalRate: 5
scenarios:
  - name: "Daily Summary Load Test"
    requests:
      - get:
          url: "/api/communities/test-community/daily-summary"
EOF

# Run load test
artillery run load-test.yml
```

## 🎯 Expected Results

### Success Indicators
- ✅ All test scripts pass
- ✅ API response time < 2 seconds
- ✅ AI summary quality is good
- ✅ Real-time update feature works
- ✅ User interface is friendly

### Failure Indicators
- ❌ Any test script fails
- ❌ API response time > 5 seconds
- ❌ AI summary is empty or incorrect
- ❌ Real-time updates don't work
- ❌ User interface errors

## 📝 Test Report Template

```
Test Date: [Date]
Test Environment: [Development/Production]
Tested By: [Name]

Test Results:
- Environment Configuration: ✅/❌
- AI Functionality: ✅/❌
- API Endpoints: ✅/❌
- Frontend Functionality: ✅/❌

Issues Found:
1. [Issue description]
2. [Issue description]

Improvement Suggestions:
1. [Improvement suggestion]
2. [Improvement suggestion]
```

## 🔍 Advanced Testing

### Unit Testing
```bash
# Install Jest for unit testing
npm install --save-dev jest @types/jest

# Create test file
cat > __tests__/ai-summary.test.js << EOF
const { generateDailySummary } = require('../lib/ai');

describe('AI Summary Generation', () => {
  test('should generate summary for posts', async () => {
    const posts = [
      { title: 'Test Post', content: 'Test content' }
    ];
    const summary = await generateDailySummary('test-community', posts);
    expect(summary).toBeDefined();
    expect(summary.length).toBeGreaterThan(0);
  });
});
EOF

# Run tests
npm test
```

### Integration Testing
```bash
# Test complete workflow
cat > test-integration.js << EOF
const fetch = require('node-fetch');

async function testCompleteWorkflow() {
  try {
    // 1. Create a community
    const communityResponse = await fetch('http://localhost:3000/api/communities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Community',
        description: 'Test Description'
      })
    });
    
    const community = await communityResponse.json();
    console.log('✅ Community created:', community.id);
    
    // 2. Create a post
    const postResponse = await fetch(\`http://localhost:3000/api/communities/\${community.id}/posts\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Test Post',
        content: 'Test content for AI summary',
        type: 'TEXT'
      })
    });
    
    const post = await postResponse.json();
    console.log('✅ Post created:', post.id);
    
    // 3. Generate summary
    const summaryResponse = await fetch(\`http://localhost:3000/api/communities/\${community.id}/daily-summary\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ communityId: community.id })
    });
    
    const summary = await summaryResponse.json();
    console.log('✅ Summary generated:', summary.summary);
    
    console.log('🎉 Complete workflow test passed!');
    
  } catch (error) {
    console.error('❌ Integration test failed:', error);
  }
}

testCompleteWorkflow();
EOF

# Run integration test
node test-integration.js
```

### End-to-End Testing
```bash
# Install Playwright for E2E testing
npm install --save-dev @playwright/test

# Create E2E test
cat > tests/e2e/daily-summary.spec.js << EOF
const { test, expect } = require('@playwright/test');

test('Daily Summary Feature', async ({ page }) => {
  // Navigate to community page
  await page.goto('http://localhost:3000/communities/test-community');
  
  // Check if daily summary component is visible
  await expect(page.locator('[data-testid="daily-summary"]')).toBeVisible();
  
  // Check if auto-refresh indicator is shown
  await expect(page.locator('[data-testid="auto-refresh"]')).toContainText('Auto-refreshes every 2 minutes');
  
  // Test manual refresh
  await page.click('[data-testid="refresh-button"]');
  await expect(page.locator('[data-testid="loading"]')).toBeVisible();
  
  // Wait for summary to load
  await expect(page.locator('[data-testid="summary-content"]')).toBeVisible();
});
EOF

# Run E2E tests
npx playwright test
```

## 🐛 Debug Mode

### Enable Debug Logging
```bash
# Set debug environment variable
export DEBUG=ai:*,prisma:*

# Run with debug logging
npm run dev
```

### Debug AI Responses
```typescript
// Add to your AI functions
console.log('AI Request:', { prompt, model });
console.log('AI Response:', response);
console.log('AI Processing Time:', Date.now() - startTime);
```

### Debug Database Queries
```typescript
// Enable Prisma query logging
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});
```

## 📈 Performance Monitoring

### API Response Times
```bash
# Monitor API performance
curl -w "@curl-format.txt" -o /dev/null -s "http://localhost:3000/api/communities/test/daily-summary"

# Create curl format file
cat > curl-format.txt << EOF
     time_namelookup:  %{time_namelookup}\n
        time_connect:  %{time_connect}\n
     time_appconnect:  %{time_appconnect}\n
    time_pretransfer:  %{time_pretransfer}\n
       time_redirect:  %{time_redirect}\n
  time_starttransfer:  %{time_starttransfer}\n
                     ----------\n
          time_total:  %{time_total}\n
EOF
```

### Memory Usage
```bash
# Monitor memory usage
node --inspect test-daily-summary.js

# Open Chrome DevTools
# Navigate to chrome://inspect
# Click "Open dedicated DevTools for Node"
```

### Database Performance
```sql
-- Check slow queries
SELECT query, mean_time, calls 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;

-- Check database size
SELECT pg_size_pretty(pg_database_size('ai_learning_community'));
```

## 🚀 Production Testing

### Pre-deployment Checklist
- [ ] All tests pass in staging environment
- [ ] Performance benchmarks meet requirements
- [ ] Error handling is comprehensive
- [ ] Logging is properly configured
- [ ] Monitoring is set up

### Production Monitoring
```bash
# Set up health checks
curl -f http://your-domain.com/api/health || exit 1

# Monitor error rates
curl -s http://your-domain.com/api/metrics | grep error_rate

# Check response times
curl -w "%{time_total}" -o /dev/null -s http://your-domain.com/api/communities/test/daily-summary
```

## 📚 Additional Resources

### Testing Tools
- **Jest**: Unit testing framework
- **Playwright**: End-to-end testing
- **Artillery**: Load testing
- **Newman**: API testing with Postman collections

### Monitoring Tools
- **Sentry**: Error tracking
- **DataDog**: Application monitoring
- **New Relic**: Performance monitoring
- **Grafana**: Metrics visualization

### Documentation
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Artillery Documentation](https://artillery.io/docs/)

Remember: Testing is an ongoing process. Regular testing ensures your application remains stable and performant as it evolves!