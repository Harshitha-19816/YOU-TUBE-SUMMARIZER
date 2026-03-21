import { NextResponse } from 'next/server'
import FirecrawlApp from '@mendable/firecrawl-js'
import { createClient } from '@/utils/supabase/server'

export const maxDuration = 60;

// Initialize Firecrawl
const firecrawl = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY })

export async function POST(req: Request) {
  try {
    // 1. Authenticate user
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { query } = await req.json()
    if (!query) {
      return NextResponse.json({ error: 'Missing research query' }, { status: 400 })
    }

    // 2. Perform web search with Firecrawl
    let searchResponse: any
    try {
      searchResponse = await firecrawl.search(query, {
        limit: 5,
        scrapeOptions: { formats: ['markdown'] }
      })
    } catch (error: any) {
      console.error('Firecrawl Research Error:', error)
      return NextResponse.json({ error: 'Web search failed. Check Firecrawl API key.' }, { status: 502 })
    }

    const searchResults = Array.isArray(searchResponse.data) ? searchResponse.data : 
                          Array.isArray(searchResponse.web) ? searchResponse.web : 
                          Array.isArray(searchResponse) ? searchResponse : [];

    if (searchResults.length === 0) {
      return NextResponse.json({ error: 'No relevant information found on the web.' }, { status: 404 })
    }

    // 3. Format sources for AI context
    const sourcesContext = searchResults.map((res: any, index: number) => `
[Source ${index + 1}: ${res.title || 'Untitled'}]
URL: ${res.url || res.link || 'Unknown'}
Content Preview: ${res.markdown?.substring(0, 800) || res.description || 'No content available'}
`).join('\n')

    // 4. Synthesize answer with OpenRouter AI
    const systemPrompt = `You are an expert AI Research Assistant. Given a user's question and relevant web search results, your job is to synthesize a comprehensive, highly accurate answer.

Rules:
1. You MUST use information from the provided sources.
2. You MUST cite your sources using inline brackets like [Source 1], [Source 2].
3. At the end of your answer, provide a "Sources" list with the actual titles and URLs.
4. Format your answer using rich markdown (bolding, lists, etc) for readability.
`

    const aiRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-001',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Question: ${query}\n\nWeb Search Results:\n${sourcesContext}` }
        ]
      })
    })

    if (!aiRes.ok) throw new Error('Failed to generate AI synthesis')
    
    const aiData = await aiRes.json()
    const finalAnswer = aiData.choices[0].message.content

    // Return the final answer and the sources
    return NextResponse.json({
      answer: finalAnswer,
      sources: searchResults.map((s: any) => ({
        title: s.title || 'Untitled',
        url: s.url || s.link || ''
      }))
    })

  } catch (error: any) {
    console.error('Research API Error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    )
  }
}
