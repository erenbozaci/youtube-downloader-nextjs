import { NextRequest, NextResponse } from 'next/server';
import ytdl from '@distube/ytdl-core';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL gereklidir' }, { status: 400 });
    }

    // Validate YouTube URL
    if (!ytdl.validateURL(url)) {
      return NextResponse.json({ error: 'Geçersiz YouTube URL\'si' }, { status: 400 });
    }

    // Get video info with additional options
    const info = await ytdl.getInfo(url, {
      requestOptions: {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      }
    });
    
    const videoDetails = {
      title: info.videoDetails.title,
      thumbnail: info.videoDetails.thumbnails?.[0]?.url || '/placeholder-thumbnail.jpg',
      duration: info.videoDetails.lengthSeconds,
      author: info.videoDetails.author.name,
      viewCount: info.videoDetails.viewCount,
    };

    return NextResponse.json({ videoDetails });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ 
      error: 'Video bilgileri alınamadı. YouTube sistemi güncellenmiş olabilir. Lütfen daha sonra tekrar deneyin.' 
    }, { status: 500 });
  }
}
