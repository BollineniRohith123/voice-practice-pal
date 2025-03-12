import { NextResponse, NextRequest } from 'next/server';

interface AccountInfo {
  name: string;
  billingUrl: string;
  freeTimeUsed: string;
  freeTimeRemaining: string;
  hasActiveSubscription: boolean;
  activeCalls: number;
  allowedConcurrentCalls: number;
  allowedVoices: number;
}

export async function POST(request: NextRequest) {
  try {
    const { apiKey } = await request.json();

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Security key is required' },
        { status: 400 }
      );
    }

    // Validate by fetching account info
    const response = await fetch('https://api.ultravox.ai/api/accounts/me', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Invalid security key' },
        { status: 401 }
      );
    }

    const accountInfo: AccountInfo = await response.json();
    return NextResponse.json({
      valid: true,
      accountInfo
    });

  } catch (error) {
    console.error('Error validating key:', error);
    return NextResponse.json(
      { 
        error: 'Validation failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
