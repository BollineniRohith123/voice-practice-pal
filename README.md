# Viva Voce Practice

An interactive platform for medical students to practice their viva voce examination skills using AI.

## Features

- Real-time voice interaction with AI examiner
- Multiple medical specialties
- Instant feedback and analysis
- Progress tracking
- Secure and private sessions

## Technologies Used

- Next.js 14
- React 18
- Ultravox AI
- TailwindCSS
- TypeScript
- Vercel Deployment

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Ultravox API key
- Git

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd viva-voce-practice
```

2. Install dependencies:
```bash
npm install
```

3. Create .env.local file:
```bash
ULTRAVOX_API_KEY=your_api_key_here
```

4. Run development server:
```bash
npm run dev
```

## Deployment

### Deploying to Vercel

1. Push code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

2. On Vercel Dashboard:
- Create new project
- Import GitHub repository
- Add environment variables:
  - ULTRAVOX_API_KEY: Your API key
- Deploy

### Environment Variables

Required environment variables:
- `ULTRAVOX_API_KEY`: Your Ultravox API key

## Development

### File Structure

```
viva-voce-practice/
├── app/
│   ├── api/           # API routes
│   ├── components/    # React components
│   └── page.tsx      # Main page
├── lib/              # Utilities and types
├── public/           # Static assets
└── styles/          # Global styles
```

### Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## License

MIT License - See LICENSE file for details
