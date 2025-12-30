# AI Chat

AI-powered chat application built with Next.js and Claude API.

## Features

- Real-time streaming responses from Claude AI
- Conversation history stored in MongoDB
- Dark mode support
- Markdown rendering with syntax highlighting
- Responsive design (mobile-friendly)

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **AI**: Anthropic Claude API
- **Database**: MongoDB with Mongoose
- **UI**: shadcn/ui + Tailwind CSS
- **Testing**: Vitest + Testing Library

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Anthropic API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/ai-chat.git
cd ai-chat
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```bash
cp .env.example .env.local
```

4. Configure environment variables in `.env.local`:
```env
ANTHROPIC_API_KEY=sk-ant-xxxxx
MONGODB_URI=mongodb+srv://user:pass@cluster.xxxxx.mongodb.net/ai-chat
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run test` | Run tests in watch mode |
| `npm run test:run` | Run tests once |
| `npm run lint` | Run ESLint |

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Add environment variables:
   - `ANTHROPIC_API_KEY`
   - `MONGODB_URI`
4. Deploy

### MongoDB Atlas Setup

1. Create a cluster on [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a database user
3. Whitelist IP addresses (0.0.0.0/0 for Vercel)
4. Get connection string and add to environment variables

## Project Structure

```
ai-chat/
├── app/
│   ├── api/
│   │   ├── chat/           # Streaming chat API
│   │   └── conversations/  # Conversation CRUD API
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── chat/               # Chat UI components
│   ├── sidebar/            # Sidebar components
│   ├── theme/              # Theme provider & toggle
│   └── ui/                 # shadcn/ui components
├── hooks/
│   ├── useChat.ts          # Chat logic hook
│   └── useConversations.ts # Conversation management hook
├── lib/
│   ├── anthropic.ts        # Claude API client
│   ├── mongodb.ts          # MongoDB connection
│   └── utils.ts            # Utility functions
├── models/
│   └── Conversation.ts     # Mongoose model
└── types/
    └── index.ts            # TypeScript types
```

## License

MIT
