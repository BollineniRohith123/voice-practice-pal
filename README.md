# TezHire Interview Bot

> AI-powered technical interview platform using Ultravox for conducting realistic programming interviews and providing detailed candidate feedback.

## Overview

TezHire Interview Bot is an innovative platform designed to help technical recruiters and hiring managers conduct preliminary technical interviews without human intervention. Using advanced AI technologies, the platform simulates realistic interview experiences across multiple programming languages, providing detailed feedback and candidate assessment.

## Key Features

- **Multi-language Technical Interviews**: Support for Python, JavaScript, Java, and C# programming interviews
- **AI-Powered Interviewer**: Natural conversation flow with adaptive questioning based on candidate responses
- **Real-time Candidate Assessment**: Evaluate technical skills, problem-solving abilities, and communication
- **Comprehensive Feedback**: Detailed post-interview analytics and performance metrics
- **Interactive Interview Experience**: Voice-based interactions with real-time transcription
- **Performance Visualization**: Visual representation of candidate performance with animated scoring
- **Customizable Question Categories**: Organized by programming language and technical domains

## Technical Stack

- **Next.js**: React framework for the user interface
- **Ultravox AI**: Conversational AI engine for realistic interview simulations
- **TypeScript**: Type-safe programming language
- **Tailwind CSS**: Utility-first CSS framework for modern designs
- **pnpm**: Fast, disk space efficient package manager

## Setup Instructions

### Prerequisites
- Node.js installed
- pnpm installed ([installation instructions](https://pnpm.io/installation))
- Ultravox API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/BollineniRohith123/Interviewbot.git
   cd Interviewbot
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   - Create a file called `.env.local`
   - Add your Ultravox API key:
     ```
     ULTRAVOX_API_KEY=<YOUR_KEY_HERE>
     ```

### Running the Application

Start the development server:
```bash
pnpm dev
```

## Interview Process

1. **Language Selection**: Choose from Python, JavaScript, Java, or C#
2. **Interview Initiation**: Begin the interview with an AI-powered interviewer
3. **Technical Assessment**: Answer questions across multiple technical categories
4. **Performance Analysis**: Receive detailed feedback and performance metrics
5. **Review Results**: Analyze interview performance and areas for improvement

## Query Parameters

| What | Parameter | Notes |
|--------|--------|---------|
|**Debug Logging**|`showDebugMessages=true`| Turns on additional console logging|
|**Speaker Mute Toggle**|`showSpeakerMute=true`| Shows the speaker mute button|
|**Change Model**|`model=ultravox-70B`|Changes the model to what is specified. Note: the app will prepend `fixie-ai/` to the value|
|**Enable User Transcripts**|`showUserTranscripts=true`|Displays user transcripts. Otherwise, only Ultravox/agent transcripts are shown|

## Documentation
For more information about Ultravox and its capabilities, visit: [Ultravox Documentation](https://docs.ultravox.ai)


