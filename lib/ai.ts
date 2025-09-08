import OpenAI from 'openai'
// import { categorizePostWithGemini, generateDailySummaryWithGemini, findRelevantResourcesWithGemini } from './ai-gemini'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function categorizePost(content: string, title: string): Promise<string[]> {
  // 优先使用 Gemini API（免费）
  if (process.env.GEMINI_API_KEY) {
    return await categorizePostWithGemini(content, title)
  }
  
  // 如果没有 Gemini API Key，使用 OpenAI
  if (process.env.OPENAI_API_KEY) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are an AI assistant that categorizes educational content. 
            Analyze the given post and categorize it into one or more of these categories:
            - AI Course: Educational content about AI concepts, tutorials, courses
            - Essay: Opinion pieces, analysis, research papers
            - Technical Document: Code examples, technical guides, documentation
            - Discussion: Questions, debates, general discussions
            - Resource: Useful links, tools, datasets
            - News: Latest updates, announcements, news
            
            Return only the category names, separated by commas if multiple.`
          },
          {
            role: "user",
            content: `Title: ${title}\nContent: ${content}`
          }
        ],
        max_tokens: 100,
        temperature: 0.3,
      })

      const categories = response.choices[0]?.message?.content?.split(',').map(c => c.trim()) || ['Discussion']
      return categories
    } catch (error) {
      console.error('Error categorizing post with OpenAI:', error)
      return ['Discussion']
    }
  }
  
  // 如果都没有，使用关键词匹配
  return categorizeByKeywords(title, content)
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

export async function generateDailySummary(communityId: string, posts: any[]): Promise<string> {
  // 优先使用 Gemini API（免费）
  if (process.env.GEMINI_API_KEY) {
    return await generateDailySummaryWithGemini(communityId, posts)
  }
  
  // 如果没有 Gemini API Key，使用 OpenAI
  if (process.env.OPENAI_API_KEY) {
    try {
      const postSummaries = posts.map(post => 
        `- ${post.title} (${post.type}): ${post.content?.substring(0, 200)}...`
      ).join('\n')

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are an AI assistant that creates daily summaries for an AI learning community. 
            Create a comprehensive summary of the day's posts, highlighting key topics, insights, and resources shared.
            Make it engaging and educational, focusing on what the community learned and discussed.`
          },
          {
            role: "user",
            content: `Here are today's posts from the AI learning community:\n\n${postSummaries}`
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
      })

      return response.choices[0]?.message?.content || 'No summary available for today.'
    } catch (error) {
      console.error('Error generating daily summary with OpenAI:', error)
      return 'Unable to generate summary at this time.'
    }
  }
  
  // 如果都没有，使用简单总结
  return generateSimpleSummary(posts)
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

export async function findRelevantResources(topic: string): Promise<any[]> {
  try {
    // This would integrate with external APIs to find relevant resources
    // For now, we'll return a mock response
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are an AI assistant that finds relevant educational resources. 
          Given a topic, suggest 3-5 relevant resources including:
          - Online courses
          - Research papers
          - Tutorials
          - Tools
          - Books
          
          Return as JSON array with title, description, url, and type fields.`
        },
        {
          role: "user",
          content: `Find resources for: ${topic}`
        }
      ],
      max_tokens: 300,
      temperature: 0.5,
    })

    const content = response.choices[0]?.message?.content
    try {
      return JSON.parse(content || '[]')
    } catch {
      return []
    }
  } catch (error) {
    console.error('Error finding resources:', error)
    return []
  }
}
