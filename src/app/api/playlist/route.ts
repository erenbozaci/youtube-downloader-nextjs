import { NextRequest, NextResponse } from 'next/server';
import ytdl from '@distube/ytdl-core';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL gereklidir' }, { status: 400 });
    }

    // Check if it's a playlist URL
    const playlistMatch = url.match(/[?&]list=([^&]+)/);
    if (!playlistMatch) {
      return NextResponse.json({ error: 'Geçersiz playlist URL\'si' }, { status: 400 });
    }

    const playlistId = playlistMatch[1];

    try {
      // For playlists, we need to get individual video URLs and fetch their info
      // This is a simplified approach - in production, you might want to use YouTube Data API
      const playlistUrl = `https://www.youtube.com/playlist?list=${playlistId}`;
      
      // Extract video IDs from playlist page (this is a basic approach)
      const response = await fetch(playlistUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      const html = await response.text();
      
      // Extract video IDs from the HTML (basic regex approach)
      const videoIdMatches = html.match(/"videoId":"([^"]{11})"/g);
      
      if (!videoIdMatches || videoIdMatches.length === 0) {
        return NextResponse.json({ error: 'Playlist\'te video bulunamadı' }, { status: 400 });
      }

      // Remove duplicates and limit to first 50 videos
      const videoIds = [...new Set(videoIdMatches.map(match => match.match(/"videoId":"([^"]{11})"/)?.[1]))].slice(0, 50);
      
      // Extract playlist title
      const titleMatch = html.match(/<title>([^<]+)<\/title>/);
      const playlistTitle = titleMatch ? titleMatch[1].replace(' - YouTube', '') : 'Bilinmeyen Playlist';

      const videos = [];
      
      // Get info for each video (limit concurrent requests)
      const batchSize = 5;
      for (let i = 0; i < videoIds.length; i += batchSize) {
        const batch = videoIds.slice(i, i + batchSize);
        const batchPromises = batch.map(async (videoId) => {
          if (!videoId) return null;
          
          try {
            const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
            const info = await ytdl.getInfo(videoUrl, {
              requestOptions: {
                headers: {
                  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
              }
            });
            
            return {
              title: info.videoDetails.title,
              thumbnail: info.videoDetails.thumbnails?.[0]?.url || '/placeholder-thumbnail.jpg',
              duration: info.videoDetails.lengthSeconds,
              author: info.videoDetails.author.name,
              viewCount: info.videoDetails.viewCount,
              url: videoUrl
            };
          } catch (error) {
            console.error(`Error fetching info for video ${videoId}:`, error);
            return null;
          }
        });
        
        const batchResults = await Promise.all(batchPromises);
        videos.push(...batchResults.filter(video => video !== null));
        
        // Add a small delay between batches to avoid rate limiting
        if (i + batchSize < videoIds.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      if (videos.length === 0) {
        return NextResponse.json({ error: 'Playlist\'teki hiçbir video için bilgi alınamadı' }, { status: 400 });
      }

      return NextResponse.json({ 
        title: playlistTitle,
        videos: videos,
        totalVideos: videos.length
      });

    } catch (error) {
      console.error('Playlist processing error:', error);
      return NextResponse.json({ 
        error: 'Playlist bilgileri alınamadı. Playlist genel erişime açık olduğundan emin olun.' 
      }, { status: 500 });
    }

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ 
      error: 'Playlist bilgileri alınamadı' 
    }, { status: 500 });
  }
}
