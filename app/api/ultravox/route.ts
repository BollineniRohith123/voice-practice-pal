import { NextResponse, NextRequest } from 'next/server';
import { CallConfig } from '@/lib/types';

// List of valid fields for Ultravox API
const VALID_FIELDS = [
  'systemPrompt',
  'temperature',
  'model',
  'voice',
  'languageHint',
  'initialMessages',
  'joinTimeout',
  'maxDuration',
  'timeExceededMessage',
  'inactivityMessages',
  'selectedTools',
  'medium',
  'recordingEnabled',
  'firstSpeaker',
  'transcriptOptional',
  'initialOutputMedium',
  'vadSettings',
  'firstSpeakerSettings',
  'experimentalSettings'
];

export async function POST(request: NextRequest) {
  // Handle CORS
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key',
      },
    });
  }

  try {
    // Get the client-provided API key from headers if available
    const clientApiKey = request.headers.get('X-API-Key');
    
    // Debug log environment variables
    console.log('Environment check:', {
      nodeEnv: process.env.NODE_ENV,
      hasApiKey: !!process.env.ULTRAVOX_API_KEY,
      hasClientApiKey: !!clientApiKey,
      apiKeyLength: process.env.ULTRAVOX_API_KEY?.length
    });

    // Use client API key as fallback if environment variable is not set
    let apiKey = process.env.ULTRAVOX_API_KEY?.trim() || clientApiKey;
    
    if (!apiKey) {
      console.error('No API key available - neither environment variable nor client header');
      return NextResponse.json(
        { 
          error: 'Configuration error', 
          details: 'API key is not configured. Please provide an API key.' 
        },
        { status: 401 }
      );
    }

    // Validate request body
    let body: CallConfig;
    try {
      const rawBody = await request.json();
      
      // Type-safe body construction with field validation
      const sanitizedBody: Partial<CallConfig> = {};
      
      for (const [key, value] of Object.entries(rawBody)) {
        if (VALID_FIELDS.includes(key)) {
          // Type checking for each field
          switch (key) {
            case 'systemPrompt':
            case 'model':
            case 'voice':
            case 'languageHint':
            case 'maxDuration':
            case 'timeExceededMessage':
              if (typeof value === 'string') {
                sanitizedBody[key] = value;
              }
              break;
            case 'temperature':
              if (typeof value === 'number') {
                sanitizedBody[key] = value;
              }
              break;
            case 'selectedTools':
            case 'initialMessages':
            case 'inactivityMessages':
              if (Array.isArray(value)) {
                sanitizedBody[key] = value;
              }
              break;
            case 'recordingEnabled':
            case 'transcriptOptional':
              if (typeof value === 'boolean') {
                sanitizedBody[key] = value;
              }
              break;
            // Add other field validations as needed
          }
        }
      }

      // Ensure required fields are present
      if (!sanitizedBody.systemPrompt) {
        throw new Error('System prompt is required');
      }

      body = sanitizedBody as CallConfig;

      // Ensure maxDuration has 's' suffix
      if (body.maxDuration && !body.maxDuration.endsWith('s')) {
        body.maxDuration = `${body.maxDuration}s`;
      }
    } catch (parseError) {
      return NextResponse.json(
        { error: 'Invalid request', details: 'Invalid request body format' },
        { status: 400 }
      );
    }

    console.log('Making API request to Ultravox with config:', {
      hasSystemPrompt: !!body.systemPrompt,
      model: body.model,
      maxDuration: body.maxDuration
    });
    
    try {
      const response = await fetch('https://api.ultravox.ai/api/calls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKey,
          'Accept': 'application/json',
          'User-Agent': 'Ultravox-Client/1.0',
        },
        body: JSON.stringify({
          ...body,
          model: body.model || 'fixie-ai/ultravox-70B',
        }),
      });

      console.log('Ultravox API response:', {
        status: response.status,
        ok: response.ok,
        statusText: response.statusText
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Ultravox API error response:', errorText);
        
        let errorMessage = errorText;
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.error || errorJson.message || errorText;
        } catch {
          // Use raw error text if parsing fails
        }
        
        return NextResponse.json(
          { error: 'Ultravox API error', details: errorMessage },
          { status: response.status }
        );
      }

      const data = await response.json();
      return NextResponse.json(data);
    } catch (fetchError) {
      console.error('Ultravox API call failed:', fetchError);
      return NextResponse.json(
        { 
          error: 'API request failed', 
          details: fetchError instanceof Error ? fetchError.message : 'Unknown error occurred'
        },
        { status: 500 }
      );
    }
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