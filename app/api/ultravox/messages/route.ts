import { NextResponse, NextRequest } from 'next/server';

// Mark route as dynamic
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    // Get the call ID from the query parameters
    const callId = req.nextUrl.searchParams.get('callId');

    if (!callId) {
      return NextResponse.json({ error: 'Call ID is required' }, { status: 400 });
    }

    // Get the API key from environment variables
    const apiKey = process.env.ULTRAVOX_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    // Make the request to the Ultravox API
    const response = await fetch(
      `https://api.ultravox.ai/api/calls/${callId}/messages`,
      {
        method: 'GET',
        headers: {
          'X-API-Key': apiKey,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { error: 'Failed to parse error response' };
      }

      return NextResponse.json(
        { error: `API Error: ${errorData.error || 'Unknown error'}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching call messages:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
