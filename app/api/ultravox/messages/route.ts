import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const callId = request.nextUrl.searchParams.get('callId');
    if (!callId) {
      return NextResponse.json({ error: 'Call ID is required' }, { status: 400 });
    }

    // Get API key from request header
    const clientApiKey = request.headers.get('X-API-Key');
    const apiKey = process.env.ULTRAVOX_API_KEY?.trim() || clientApiKey;

    if (!apiKey) {
      console.error('No API key available');
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 401 }
      );
    }

    const response = await fetch(`https://api.ultravox.ai/api/calls/${callId}/messages`, {
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = errorText;
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.error || errorJson.message || errorText;
      } catch {
        // Use raw error text if parsing fails
      }
      
      return NextResponse.json(
        { error: 'Failed to fetch messages', details: errorMessage },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
