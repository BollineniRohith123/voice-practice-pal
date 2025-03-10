# Interview Bot API Documentation

## Base URL
The base URL for all API endpoints is relative to your deployment URL.

## Authentication
All API endpoints require an Ultravox API key that should be set in the environment variables as `ULTRAVOX_API_KEY`.

## Endpoints

### 1. Create Call
Creates a new interview call session.

**Endpoint:** `/api/ultravox`  
**Method:** `POST`  
**Content-Type:** `application/json`

#### Request Body Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| systemPrompt | string | Yes | The initial system prompt for the interview |
| temperature | number | No | Temperature setting for the model's responses |
| model | string | No | Model to use (defaults to 'fixie-ai/ultravox-70B') |
| voice | string | No | Voice ID to be used |
| languageHint | string | No | Preferred language for the conversation |
| maxDuration | string | No | Maximum duration of the call (append 's' for seconds) |
| timeExceededMessage | string | No | Message to show when time is exceeded |
| selectedTools | array | No | Array of tools to be used in the call |
| medium | string | No | Communication medium preference |
| recordingEnabled | boolean | No | Whether to enable recording |
| firstSpeaker | string | No | Who speaks first in the conversation |
| transcriptOptional | boolean | No | Whether transcript is optional |
| initialOutputMedium | string | No | Initial output medium preference |

#### Success Response
```json
{
    "callId": "string",
    "joinUrl": "string"
}
```

#### Error Response
```json
{
    "error": "string",
    "details": "string"
}
```

### 2. Get Call Messages
Retrieves messages for a specific call.

**Endpoint:** `/api/ultravox/messages`  
**Method:** `GET`  
**Query Parameters:**
- `callId` (required): The ID of the call to fetch messages for

#### Success Response
```json
{
    "results": [
        {
            "role": "string",
            "text": "string",
            "medium": "string",
            "callStageMessageIndex": "number",
            "callStageId": "string"
        }
    ],
    "total": "number",
    "next": "string | null",
    "previous": "string | null"
}
```

#### Message Properties
| Property | Type | Description |
|----------|------|-------------|
| role | string | Role of the message sender (MESSAGE_ROLE_USER or MESSAGE_ROLE_AGENT) |
| text | string | Content of the message |
| medium | string | Medium of the message (MESSAGE_MEDIUM_TEXT or MESSAGE_MEDIUM_VOICE) |
| callStageMessageIndex | number | Index of the message in the current call stage |
| callStageId | string | Identifier for the call stage |

## CORS Support
The API includes CORS support with the following headers:
- Access-Control-Allow-Origin: *
- Access-Control-Allow-Methods: POST, OPTIONS
- Access-Control-Allow-Headers: Content-Type, Authorization

## Error Handling
All endpoints return appropriate HTTP status codes:
- 200: Success
- 400: Bad Request (invalid parameters)
- 401: Unauthorized (invalid or missing API key)
- 500: Internal Server Error

## Client Functions
The API includes several client-side utility functions:

### startCall
```typescript
async function startCall(
    callbacks: CallCallbacks, 
    callConfig: CallConfig, 
    showDebugMessages?: boolean
): Promise<string>
```

### endCall
```typescript
async function endCall(): Promise<void>
```

### toggleMute
```typescript
function toggleMute(role: Role): void
```

### useTranscriptPolling Hook
A React hook for real-time transcript polling.

```typescript
function useTranscriptPolling(
    callId: string | null, 
    isActive: boolean
): {
    messages: Message[];
    error: string | null;
    isLoading: boolean;
}
```

#### Parameters
- `callId`: The ID of the call to poll messages for
- `isActive`: Boolean flag to control polling activity

#### Returns
| Property | Type | Description |
|----------|------|-------------|
| messages | Message[] | Array of messages from the transcript |
| error | string \| null | Error message if polling fails |
| isLoading | boolean | Loading state indicator |

#### Polling Behavior
- Automatically polls every 2 seconds when active
- Only updates with new messages
- Automatically cleans up on component unmount
- Resets state when call ends or callId changes

## Type Definitions

### CallConfig
```typescript
interface CallConfig {
    systemPrompt: string;
    temperature?: number;
    model?: string;
    voice?: string;
    languageHint?: string;
    maxDuration?: string;
    timeExceededMessage?: string;
    selectedTools?: string[];
    medium?: string;
    recordingEnabled?: boolean;
    firstSpeaker?: string;
    transcriptOptional?: boolean;
    initialOutputMedium?: string;
}
```

### Message
```typescript
interface Message {
    role: string;
    text: string;
    medium: string;
    callStageMessageIndex: number;
    callStageId: string;
}
```

### TranscriptResponse
```typescript
interface TranscriptResponse {
    results: Message[];
    total: number;
    next: string | null;
    previous: string | null;
}
```

## Client Tools

### captureInterviewDataTool
A tool for capturing and managing interview data throughout the session.

#### Data Structure
```typescript
interface InterviewDataStore {
  candidate: {
    name: string;
    position: string;
    years_of_experience: number;
  };
  session: {
    timestamp: string;
    startTime: number;
    duration: number;
    completed_categories: string[];
  };
  qa_history: Array<{
    question: string;
    answer: string;
    category: string;
    score?: number;
  }>;
  progress: {
    completed_categories: string[];
    current_category: string;
    questions_remaining: number;
    average_score: number;
  };
  technical_evaluation: {
    category_scores: Record<string, {
      score: number;
      questions: number;
    }>;
    overall_score: number;
  };
  final_evaluation: {
    technical_score: number;
    recommendation: {
      hire_recommendation: boolean;
      justification: string;
    };
  };
}
```

#### Events
The tool dispatches the following custom events:
- `interviewCompleted`: Fired when the interview is completed
- `orderDetailsUpdated`: Fired when order details are updated
- `productHighlight`: Fired when a product is highlighted/unhighlighted

### Interview Analysis

#### analyzeInterview Function
```typescript
async function analyzeInterview(data: InterviewData, language: string): Promise<string>
```

Analyzes the interview using Groq AI and provides:
- Overall impression
- Technical knowledge assessment (0-100)
- Communication skills evaluation (0-100)
- Problem-solving ability (0-100)
- Areas of strength
- Areas for improvement
- Suggested follow-up questions
- Final recommendation (Hire/Consider/Do Not Recommend)
- Overall score (0-100)

#### Interview Ratings Interface
```typescript
interface InterviewRatings {
  technicalScore: number;
  communicationScore: number;
  problemSolving: number;
  overallScore: number;
  recommendation: 'Hire' | 'Consider' | 'Do Not Recommend';
}
```

### Programming Languages Support
The system supports interviews for:
- Python
- Java
- JavaScript
- C#

Each language has predefined interview categories and coding challenges.

## Events System
The application uses a custom events system for real-time updates:

### Custom Events
1. `interviewCompleted`
   - Triggered when an interview session ends
   - Contains complete interview data and final status

2. `orderDetailsUpdated`
   - Triggered when order details are modified
   - Contains updated order information

3. `productHighlight`
   - Triggered when products are highlighted/unhighlighted
   - Contains product name and action (show/hide)

## Best Practices

### Interview Session Management
1. Always initialize the interview with proper language selection
2. Handle real-time transcript updates efficiently
3. Implement proper error handling for API calls
4. Store interview data securely
5. Clean up resources when the interview ends

### Data Capture
1. Use the captureInterviewDataTool for all interview data
2. Maintain consistent scoring across categories
3. Capture both quantitative and qualitative feedback
4. Record timestamps for session duration tracking
5. Store complete Q&A history for analysis

### Analysis and Feedback
1. Process interview data in real-time when possible
2. Generate comprehensive feedback reports
3. Calculate scores based on multiple criteria
4. Provide actionable improvement suggestions
5. Store analysis results for future reference

## Error Handling
- Implement proper error handling for all API calls
- Log errors with appropriate context
- Provide user-friendly error messages
- Handle network connectivity issues gracefully
- Implement retry mechanisms for critical operations

## Security Considerations
1. Protect API keys and sensitive data
2. Implement proper authentication
3. Validate all user inputs
4. Sanitize data before storage
5. Follow security best practices for data transmission

## Rate Limiting and Performance
1. Implement appropriate rate limiting
2. Cache frequently accessed data
3. Optimize API calls
4. Handle concurrent interview sessions
5. Monitor system performance

## Rate Limiting
Please refer to the Ultravox API documentation for rate limiting details.

## Support
For additional support or questions, please refer to the project documentation or contact the development team.