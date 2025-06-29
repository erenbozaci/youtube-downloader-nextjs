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

    // Get video info
    const info = await ytdl.getInfo(url, {
      requestOptions: {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      }
    });
    
    const title = info.videoDetails.title.replace(/[^\w\s-]/gi, ''); // Remove special characters
    
    // Get highest quality audio stream (usually MP4 with AAC codec)
    const audioStream = ytdl(url, {
      quality: 'highestaudio',
      filter: format => format.hasAudio && !format.hasVideo,
      requestOptions: {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      }
    });

    // Convert Node.js Readable to Web ReadableStream
    const readableStream = new ReadableStream({
      start(controller) {
        audioStream.on('data', (chunk: Buffer) => {
          controller.enqueue(new Uint8Array(chunk));
        });
        audioStream.on('end', () => {
          controller.close();
        });
        audioStream.on('error', (error) => {
          controller.error(error);
        });
      }
    });

    // Set response headers for MP4 audio (AAC codec - high quality)
    const headers = new Headers({
      'Content-Type': 'audio/mp4',
      'Content-Disposition': `attachment; filename="${title}.m4a"`,
    });

    // Return the stream as response
    return new Response(readableStream, {
      status: 200,
      headers,
    });

  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json({ 
      error: 'İndirme başarısız. YouTube sistemi güncellenmiş olabilir. Lütfen daha sonra tekrar deneyin.' 
    }, { status: 500 });
  }
}
