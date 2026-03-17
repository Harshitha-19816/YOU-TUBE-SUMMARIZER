import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { YoutubeTranscript } from 'youtube-transcript'
import axios from 'axios'

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
    const transcriptItems = await YoutubeTranscript.fetchTranscript(url)
    const fullText = transcriptItems.map(item => item.text).join(' ')
    
    // Limit transcript size to avoid token limits (approx 10k chars for safety)
    const truncatedText = fullText.substring(0, 10000)

    // 2. Send to OpenRouter
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'google/gemini-2.0-flash-lite-preview-02-05:free', // Using a free/capable model
        messages: [
          {
            role: 'system',
            content: 'You are an expert video summarizer. Provide a detailed summary of the following YouTube video transcript. Format your response strictly in JSON with the following keys: "explanation" (a short paragraph), "key_points" (an array of 3-5 major takeaways), and "bullet_summary" (a detailed list of points).'
          },
          {
            role: 'user',
            content: `Transcript: ${truncatedText}`
          }
        ],
        response_format: { type: 'json_object' }
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://ai-hub.vercel.app', // Optional for OpenRouter
        }
      }
    )

    const summary = JSON.parse(response.data.choices[0].message.content)

    return NextResponse.json(summary)
  } catch (error: any) {
    console.error('YouTube Summary Error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate summary. Make sure the video has captions enabled.' },
      { status: 500 }
    )
  }
}
