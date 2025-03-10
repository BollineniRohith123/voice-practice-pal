'use client';
import { UltravoxSession, UltravoxSessionStatus, Transcript, UltravoxExperimentalMessageEvent, Role } from 'ultravox-client';
import { JoinUrlResponse, CallConfig } from '@/lib/types';
import { updateOrderTool, highlightProductTool, captureInterviewDataTool } from '@/lib/clientTools';

let uvSession: UltravoxSession | null = null;
const debugMessages: Set<string> = new Set(["debug"]);

interface CallCallbacks {
  onStatusChange: (status: UltravoxSessionStatus | string | undefined) => void;
  onTranscriptChange: (transcripts: Transcript[] | undefined) => void;
  onDebugMessage?: (message: UltravoxExperimentalMessageEvent ) => void;
}

export function toggleMute(role: Role): void {

  if (uvSession) {
    // Toggle (user) Mic
    if (role == Role.USER) {
      uvSession.isMicMuted ? uvSession.unmuteMic() : uvSession.muteMic();
    } 
    // Mute (agent) Speaker
    else {
      uvSession.isSpeakerMuted ? uvSession.unmuteSpeaker() : uvSession.muteSpeaker();
    }
  } else {
    console.error('uvSession is not initialized.');
  }
}

async function createCall(callConfig: CallConfig, showDebugMessages?: boolean): Promise<JoinUrlResponse> {
  try {
    if(showDebugMessages) {
      console.log('Call config:', {
        hasSystemPrompt: !!callConfig.systemPrompt,
        model: callConfig.model,
        maxDuration: callConfig.maxDuration,
        hasTools: (callConfig.selectedTools ?? []).length > 0
      });
    }

    // Validate required fields
    if (!callConfig.systemPrompt) {
      throw new Error('System prompt is required');
    }

    // Create a sanitized request body with only valid fields
    const requestBody = {
      systemPrompt: callConfig.systemPrompt,
      model: callConfig.model || 'fixie-ai/ultravox-70B',
      ...(callConfig.temperature && { temperature: callConfig.temperature }),
      ...(callConfig.voice && { voice: callConfig.voice }),
      ...(callConfig.languageHint && { languageHint: callConfig.languageHint }),
      ...(callConfig.initialMessages && { initialMessages: callConfig.initialMessages }),
      ...(callConfig.maxDuration && { maxDuration: callConfig.maxDuration.endsWith('s') ? callConfig.maxDuration : `${callConfig.maxDuration}s` }),
      ...(callConfig.timeExceededMessage && { timeExceededMessage: callConfig.timeExceededMessage }),
      ...(callConfig.selectedTools && { selectedTools: callConfig.selectedTools }),
      ...(callConfig.medium && { medium: callConfig.medium }),
      ...(callConfig.recordingEnabled !== undefined && { recordingEnabled: callConfig.recordingEnabled }),
      ...(callConfig.firstSpeaker && { firstSpeaker: callConfig.firstSpeaker }),
      ...(callConfig.transcriptOptional !== undefined && { transcriptOptional: callConfig.transcriptOptional }),
      ...(callConfig.initialOutputMedium && { initialOutputMedium: callConfig.initialOutputMedium })
    };

    const response = await fetch('/api/ultravox', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    let errorData;
    if (!response.ok) {
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { error: 'Failed to parse error response' };
      }

      throw new Error(
        `API Error (${response.status}): ${
          errorData.details || errorData.error || 'Unknown error'
        }`
      );
    }

    const data = await response.json();

    if (!data.joinUrl) {
      throw new Error('Invalid response: missing join URL');
    }

    if(showDebugMessages) {
      console.log('Call created successfully');
    }
    
    return data;
  } catch (error) {
    console.error('Error creating call:', error);
    throw error;
  }
}

export async function startCall(callbacks: CallCallbacks, callConfig: CallConfig, showDebugMessages?: boolean): Promise<string> {
  try {
    if (uvSession) {
      console.warn('Call session already exists, ending previous session');
      await endCall();
    }

    const callData = await createCall(callConfig, showDebugMessages);
    const joinUrl = callData.joinUrl;
    const callId = callData.callId; // Assuming callId is part of the response

    if (!joinUrl) {
      throw new Error('Join URL is required but not provided');
    }

    if(showDebugMessages) {
      console.log('Joining call:', joinUrl);
    }

    // Start up our Ultravox Session with correct typing
    const sessionConfig = {
      audioContext: new window.AudioContext(),
      experimentalMessages: debugMessages,
      handlers: {
        statusChange: (status: UltravoxSessionStatus) => {
          if(showDebugMessages) {
            console.log('Status change:', status);
          }
          callbacks.onStatusChange(status);
        },
        transcriptChange: (transcripts: Transcript[]) => {
          if(showDebugMessages) {
            console.log('Transcript update:', transcripts?.length || 0, 'messages');
          }
          callbacks.onTranscriptChange(transcripts);
        },
        debugMessage: (msg: UltravoxExperimentalMessageEvent) => {
          if(showDebugMessages) {
            console.log('Debug message:', msg);
          }
          callbacks.onDebugMessage?.(msg);
        }
      }
    };

    uvSession = new UltravoxSession(sessionConfig);

    // Register our tools
    try {
      if (uvSession) {
        const tools = [
          { name: "updateOrder", implementation: updateOrderTool },
          { name: "highlightProduct", implementation: highlightProductTool },
          { name: "captureInterviewData", implementation: captureInterviewDataTool }
        ];

        for (const tool of tools) {
          try {
            uvSession.registerToolImplementation(tool.name, tool.implementation);
            if(showDebugMessages) {
              console.log(`Tool ${tool.name} registered successfully`);
            }
          } catch (toolError) {
            console.error(`Failed to register tool ${tool.name}:`, toolError);
            throw toolError;
          }
        }

        if(showDebugMessages) {
          console.log('All tools registered successfully');
        }
      }
    } catch (error) {
      console.error('Error registering tools:', error);
      callbacks.onStatusChange(`Error: Failed to register interview tools - ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }

    await uvSession.joinCall(joinUrl);

    return callId; // Return the call ID
  } catch (error: unknown) {
    console.error('Error in startCall:', error);
    callbacks.onStatusChange(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw error;
  }
}

export async function endCall(): Promise<void> {
  try {
    if (uvSession) {
      await uvSession.leaveCall(); // Using the correct method name
      uvSession = null;
    }
  } catch (error) {
    console.error('Error ending call:', error);
    throw error;
  }

  // Dispatch a custom event when the call ends
  if (typeof window !== 'undefined') {
    const event = new CustomEvent('callEnded');
    window.dispatchEvent(event);
  }
}