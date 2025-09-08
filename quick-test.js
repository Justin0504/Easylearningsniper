const fetch = require('node-fetch').default || require('node-fetch')

async function quickTest() {
  console.log('🚀 Quick Test - 1 Minute Summary')
  console.log('=' .repeat(40))
  
  try {
    // 测试API端点
    const response = await fetch('http://localhost:3000/api/communities')
    
    if (response.ok) {
      const communities = await response.json()
      console.log('✅ Server is running!')
      console.log('📊 Communities found:', communities.length)
      
      if (communities.length > 0) {
        const testCommunity = communities[0]
        console.log('🎯 Testing community:', testCommunity.name)
        
        // 测试每日总结API
        const summaryResponse = await fetch(`http://localhost:3000/api/communities/${testCommunity.id}/daily-summary`)
        
        if (summaryResponse.ok) {
          const summaryData = await summaryResponse.json()
          console.log('✅ Daily summary API working!')
          console.log('📝 Summary:', summaryData.summary)
          console.log('📊 Post count:', summaryData.postCount)
          
          if (summaryData.postCount > 0) {
            console.log('\n📋 Today\'s posts:')
            summaryData.posts.forEach((post, index) => {
              console.log(`   ${index + 1}. ${post.title} (${post.type})`)
              console.log(`      Author: ${post.author}`)
            })
          }
        } else {
          console.error('❌ Summary API error:', summaryResponse.status)
        }
      }
    } else {
      console.error('❌ Server not responding')
    }
  } catch (error) {
    console.error('❌ Error:', error.message)
    console.log('💡 Make sure to run: npm run dev')
  }
}

quickTest()
