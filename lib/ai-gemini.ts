import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function categorizePostWithGemini(content: string, title: string): Promise<string[]> {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return categorizeByKeywords(title, content)
    }

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

export async function generateDailySummaryWithGemini(communityId: string, posts: any[]): Promise<string> {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return generateSimpleSummary(posts)
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
    
    const postSummaries = posts.map(post => 
      `- ${post.title} (${post.type}): ${post.content?.substring(0, 200)}...`
    ).join('\n')

    const prompt = `Create a daily summary for an AI learning community based on these posts:
    
    ${postSummaries}
    
    Make it engaging and educational, highlighting key topics and insights.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    return response.text()
  } catch (error) {
    console.error('Error generating summary with Gemini:', error)
    return generateSimpleSummary(posts)
  }
}

export async function findRelevantResourcesWithGemini(topic: string): Promise<any[]> {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return []
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
    
    const prompt = `Find 3-5 relevant educational resources for the topic: ${topic}
    
    Return as JSON array with title, description, url, and type fields.
    Include online courses, research papers, tutorials, tools, and books.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const content = response.text()
    
    try {
      return JSON.parse(content)
    } catch {
      return []
    }
  } catch (error) {
    console.error('Error finding resources with Gemini:', error)
    return []
  }
}

// 备选方案：关键词匹配
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
