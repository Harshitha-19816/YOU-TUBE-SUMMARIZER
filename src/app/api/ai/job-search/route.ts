import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import FirecrawlApp from '@mendable/firecrawl-js'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { query } = await request.json()

  if (!query) {
    return NextResponse.json({ error: 'Search query is required' }, { status: 400 })
  }

  const firecrawl = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY })

  try {
    // Search for jobs using Firecrawl
    const searchResponse = (await firecrawl.search(
      `${query} job openings`, 
      {
        limit: 8,
        scrapeOptions: {
            formats: ['markdown']
        }
      }
    )) as any

    if (!searchResponse.success) {
      throw new Error(searchResponse.error || 'Firecrawl search failed')
    }

    const rawData = searchResponse.data.map((d: any) => ({
        title: d.title,
        description: d.description,
        url: d.url,
        content: d.markdown?.substring(0, 1000)
    }))

    const parseResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-001',
        messages: [
          {
            role: 'system',
            content: 'You are a job data parser. I will provide you with raw search results for job openings. Your task is to extract a list of 5-8 specific job listings. For each job, provide: "title", "company", "location", and "link". Format your entire response strictly as a JSON array of objects. Respond ONLY with the JSON.'
          },
          {
            role: 'user',
            content: `Raw Search Data: ${JSON.stringify(rawData)}`
          }
        ]
      })
    })

    const parseData = await parseResponse.json()
    const content = JSON.parse(parseData.choices[0].message.content)
    
    // Handle both { jobs: [...] } and [...] formats
    const jobs = Array.isArray(content) ? content : (content.jobs || content.listings || [])

    return NextResponse.json({ jobs })
  } catch (error: any) {
    console.error('Job Search Error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to search for jobs' },
      { status: 500 }
    )
  }
}
