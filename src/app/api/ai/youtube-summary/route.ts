import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { YoutubeTranscript } from 'youtube-transcript'
import axios from 'axios'

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { url } = await request.json()

  if (!url) {
    return NextResponse.json({ error: 'YouTube URL is required' }, { status: 400 })
  }

  try {
    // 1. Extract transcript
    let videoId = url
    try {
      if (url.includes('youtube.com/') || url.includes('youtu.be/')) {
        const urlObj = new URL(url)
        if (urlObj.hostname.includes('youtu.be')) {
          videoId = urlObj.pathname.slice(1)
        } else if (urlObj.pathname.includes('/live/')) {
          videoId = urlObj.pathname.split('/live/')[1]
        } else if (urlObj.pathname.includes('/shorts/')) {
          videoId = urlObj.pathname.split('/shorts/')[1]
        } else {
          videoId = urlObj.searchParams.get('v') || url
        }
      }
    } catch (e) {
      console.warn('URL parsing failed, trying raw URL:', url)
    }
    
    // Cleanup any lingering query params or slashes
    videoId = videoId.split('?')[0].split('&')[0].replace(/\/$/, '')
    
    console.log('Extracted Video ID:', videoId)
    let fullText = ''
    try {
      const transcriptItems = await YoutubeTranscript.fetchTranscript(videoId)
      fullText = transcriptItems.map(item => item.text).join(' ')
    } catch (transcriptError) {
      console.warn('Transcript extraction failed/blocked. Falling back to Firecrawl metadata scrape...', transcriptError)
      // Fallback: Use Firecrawl to violently scrape the YouTube page title and description
      const FirecrawlApp = (await import('@mendable/firecrawl-js')).default
      const firecrawl = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY })
      
      const scrapeResponse = await firecrawl.scrape(`https://www.youtube.com/watch?v=${videoId}`, {
        formats: ['markdown']
      })
      
      if (!scrapeResponse || !scrapeResponse.markdown) {
        throw new Error('Both Transcript and Fallback Web Scraper failed. Please try a different video.')
      }
      
      fullText = scrapeResponse.markdown || 'No detailed content found, but the video was verified.'
      // Prepend a disclaimer to the context so the AI knows it's working off metadata, not a full transcript
      fullText = `[NOTICE: Full transcript was disabled. Summarizing based on scraped metadata, title, and description instead:]\n\n` + fullText
    }
    
    // Limit transcript/metadata size to avoid token limits (approx 10k chars for safety)
    const truncatedText = fullText.substring(0, 10000)

    console.log('Final Extraction length:', truncatedText.length)

    // 2. Send to OpenRouter
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'google/gemini-2.0-flash-001',
        messages: [
          {
            role: 'system',
            content: 'You are an expert video summarizer. Provide a detailed summary of the following YouTube video content or metadata. Format your response strictly as a JSON object with the following keys: "explanation" (a short paragraph), "key_points" (an array of 3-5 major takeaways), and "bullet_summary" (a detailed list of points). Respond ONLY with the JSON.'
          },
          {
            role: 'user',
            content: `Video Content/Transcript: ${truncatedText}`
          }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        }
      }
    )

    console.log('OpenRouter Response Status:', response.status)

    let rawContent = response.data.choices[0].message.content
    // Clean up markdown code blocks if present
    rawContent = rawContent.replace(/```json/g, '').replace(/```/g, '').trim()
    
    const summary = JSON.parse(rawContent)

    return NextResponse.json(summary)
  } catch (error: any) {
    console.error('YouTube Summary Error Detail:', error.response?.data || error.message)
    return NextResponse.json(
      { error: error.response?.data?.error?.message || error.message || 'Failed to generate summary.' },
      { status: 500 }
    )
  }
}
