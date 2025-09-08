// import OpenAI from 'openai'

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// })

export async function categorizePost(content: string, title: string): Promise<string[]> {
  // 优先使用 Gemini API（免费）
  if (process.env.GEMINI_API_KEY) {
    try {
      // 动态导入GoogleGenerativeAI
      const { GoogleGenerativeAI } = await import('@google/generative-ai')
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
      
      const prompt = `Classify this educational content: "${title}" - "${content}". 
      Categories: AI Course, Essay, Technical Document, Discussion, Resource, News. 
      Return only the category name.`

      const result = await model.generateContent(prompt)
      const response = await result.response
      const category = response.text().trim()
      
      if (['AI Course', 'Essay', 'Technical Document', 'Discussion', 'Resource', 'News'].includes(category)) {
        return [category]
      }
      
      return categorizeByKeywords(title, content)
    } catch (error) {
      console.error('Error with Gemini API:', error)
      return categorizeByKeywords(title, content)
    }
  }
  
  // 如果没有 Gemini API Key，使用关键词匹配
  console.log('No Gemini API key, using keyword matching')
  
  // 如果都没有，使用关键词匹配
  return categorizeByKeywords(title, content)
}

export async function generateDailySummary(communityId: string, posts: any[]): Promise<string> {
  // 优先使用 Gemini API（免费）
  if (process.env.GEMINI_API_KEY) {
    try {
      // 动态导入GoogleGenerativeAI
      const { GoogleGenerativeAI } = await import('@google/generative-ai')
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
      
      // 计算统计数据
      const uniqueAuthors = new Set(posts.map(p => p.author.name)).size
      const totalLikes = posts.reduce((sum, post) => sum + (post._count?.likes || 0), 0)
      const totalComments = posts.reduce((sum, post) => sum + (post._count?.comments || 0), 0)
      
      // 按热度排序
      const sortedPosts = posts.sort((a, b) => 
        ((b._count?.likes || 0) + (b._count?.comments || 0)) - ((a._count?.likes || 0) + (a._count?.comments || 0))
      )
      
      const topPosts = sortedPosts.slice(0, 3)
      const postSummaries = posts.map((post, index) => 
        `• ${post.title} (${post.type}): ${post.content?.substring(0, 200)}... [${post._count?.likes || 0} likes, ${post._count?.comments || 0} comments]`
      ).join('\n\n')

      const prompt = `Create a structured daily summary for an AI learning community based on these posts:

      POSTS DATA:
      ${postSummaries}

      STATISTICS:
      - Total posts: ${posts.length}
      - Unique authors: ${uniqueAuthors}
      - Total likes: ${totalLikes}
      - Total comments: ${totalComments}
      - Top 3 most engaging posts: ${topPosts.map(p => p.title).join(', ')}

      Please structure your summary as follows:
      1. **Community Activity Overview**: Start with how many users posted how many posts today
      2. **Main Discussion Topics**: Identify and summarize the key topics being discussed
      3. **Top 3 Most Popular Posts**: Highlight the most engaging posts with their engagement metrics
      4. **Key Insights**: Provide educational insights and learning takeaways
      5. **Community Engagement**: Comment on the overall engagement level and participation

      IMPORTANT FORMATTING REQUIREMENTS:
      - Use bullet points (•) for each post summary
      - Add line breaks between each post summary
      - Use clear section headers with **bold** formatting
      - Make each post summary concise but informative
      - Ensure proper spacing and readability

      Make it engaging, educational, and well-structured with clear sections and proper formatting.`

      const result = await model.generateContent(prompt)
      const response = await result.response
      return response.text()
    } catch (error) {
      console.error('Error generating summary with Gemini:', error)
      return generateSimpleSummary(posts)
    }
  }
  
  // 如果没有 Gemini API Key，使用简单总结
  console.log('No Gemini API key, using simple summary')
  
  // 如果都没有，使用简单总结
  return generateSimpleSummary(posts)
}

function categorizeByKeywords(title: string, content: string): string[] {
  const text = `${title} ${content}`.toLowerCase()
  
  if (text.includes('course') || text.includes('tutorial') || text.includes('learn') || text.includes('ai')) {
    return ['AI Course']
  } else if (text.includes('essay') || text.includes('opinion') || text.includes('analysis')) {
    return ['Essay']
  } else if (text.includes('code') || text.includes('technical') || text.includes('documentation') || text.includes('programming')) {
    return ['Technical Document']
  } else if (text.includes('resource') || text.includes('tool') || text.includes('link') || text.includes('useful')) {
    return ['Resource']
  } else if (text.includes('news') || text.includes('update') || text.includes('announcement')) {
    return ['News']
  } else {
    return ['Discussion']
  }
}

function generateSimpleSummary(posts: any[]): string {
  const topics = posts.map(post => post.title).join(', ')
  return `Today in the AI learning community, we discussed: ${topics}. 
  ${posts.length} posts were shared covering various AI topics. 
  Key themes included: ${extractKeywords(posts.map(p => p.title + ' ' + p.content).join(' ')).join(', ')}.`
}

function extractKeywords(text: string): string[] {
  const keywords = ['AI', 'machine learning', 'deep learning', 'neural networks', 'data science', 'programming']
  return keywords.filter(keyword => text.toLowerCase().includes(keyword.toLowerCase()))
}
