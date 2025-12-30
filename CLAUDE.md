# AI Chat - プロジェクト仕様書

## プロジェクト概要

汎用AIアシスタントチャットボットアプリケーション。Anthropic Claude APIを使用し、ストリーミングレスポンスによるリアルタイムな対話体験を提供する。

## 技術スタック

### フロントエンド
- **フレームワーク**: Next.js 14+ (App Router)
- **言語**: TypeScript
- **UIライブラリ**: shadcn/ui
- **スタイリング**: Tailwind CSS
- **状態管理**: React hooks (useState, useReducer)
- **Markdownレンダリング**: react-markdown
- **コードハイライト**: highlight.js または Prism.js

### バックエンド
- **ランタイム**: Next.js API Routes (Route Handlers)
- **AI API**: Anthropic Claude API (@anthropic-ai/sdk)
- **データベース**: MongoDB (mongoose)

### インフラ
- **ホスティング**: Vercel
- **データベース**: MongoDB Atlas

---

## ディレクトリ構造

```
ai-chat/
├── app/
│   ├── layout.tsx          # ルートレイアウト（テーマプロバイダー含む）
│   ├── page.tsx             # チャットメインページ
│   ├── globals.css          # グローバルスタイル
│   └── api/
│       ├── chat/
│       │   └── route.ts     # チャットAPI（ストリーミング）
│       └── conversations/
│           ├── route.ts     # 会話一覧取得・新規作成
│           └── [id]/
│               └── route.ts # 個別会話の取得・更新・削除
├── components/
│   ├── ui/                  # shadcn/uiコンポーネント
│   ├── chat/
│   │   ├── ChatContainer.tsx    # チャットコンテナ
│   │   ├── MessageList.tsx      # メッセージ一覧
│   │   ├── MessageItem.tsx      # 個別メッセージ
│   │   ├── ChatInput.tsx        # 入力フォーム
│   │   └── MarkdownRenderer.tsx # Markdown表示
│   ├── sidebar/
│   │   ├── Sidebar.tsx          # サイドバー
│   │   └── ConversationList.tsx # 会話履歴リスト
│   └── theme/
│       └── ThemeToggle.tsx      # ダークモード切替
├── lib/
│   ├── mongodb.ts           # MongoDB接続
│   ├── anthropic.ts         # Claude APIクライアント
│   └── utils.ts             # ユーティリティ関数
├── models/
│   └── Conversation.ts      # 会話モデル（Mongoose）
├── types/
│   └── index.ts             # 型定義
├── hooks/
│   ├── useChat.ts           # チャットロジック
│   └── useConversations.ts  # 会話履歴管理
├── public/
├── .env.local               # 環境変数（ローカル）
├── .env.example             # 環境変数サンプル
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## データベース設計

### Conversation コレクション

```typescript
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
}

interface Conversation {
  _id: ObjectId;
  title: string;              // 会話タイトル（最初のメッセージから自動生成）
  messages: Message[];        // メッセージ配列
  createdAt: Date;
  updatedAt: Date;
}
```

### インデックス
- `createdAt`: 降順（最新の会話を先頭に）
- `updatedAt`: 降順

---

## API設計

### POST /api/chat
チャットメッセージを送信し、ストリーミングレスポンスを受け取る。

**リクエスト**
```json
{
  "conversationId": "string | null",
  "messages": [
    { "role": "user", "content": "こんにちは" }
  ]
}
```

**レスポンス**
- Content-Type: `text/event-stream`
- ストリーミング形式でトークンを返却

### GET /api/conversations
会話一覧を取得。

**レスポンス**
```json
{
  "conversations": [
    {
      "_id": "xxx",
      "title": "会話タイトル",
      "updatedAt": "2025-01-01T00:00:00Z"
    }
  ]
}
```

### POST /api/conversations
新規会話を作成。

### GET /api/conversations/[id]
特定の会話を取得（メッセージ含む）。

### DELETE /api/conversations/[id]
会話を削除。

---

## 環境変数

```bash
# .env.local

# Anthropic API
ANTHROPIC_API_KEY=sk-ant-xxxxx

# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-chat

# アプリケーション設定（オプション）
NEXT_PUBLIC_APP_NAME=AI Chat
```

---

## 機能要件

### 1. チャット機能
- [x] メッセージ送信・受信
- [x] ストリーミングレスポンス（リアルタイム表示）
- [x] 会話コンテキストの維持
- [x] 入力中のローディング表示

### 2. 会話履歴
- [x] 会話の自動保存（MongoDB）
- [x] 過去の会話一覧表示（サイドバー）
- [x] 会話の切り替え
- [x] 会話の削除
- [x] 新規会話の作成

### 3. UI/UX
- [x] ダークモード / ライトモード切替
- [x] レスポンシブデザイン（モバイル対応）
- [x] Markdownレンダリング
- [x] コードブロックのシンタックスハイライト
- [x] コードブロックのコピー機能

### 4. その他
- [ ] 認証機能（現時点では不要）

---

## Claude API 設定

### 使用モデル
- `claude-sonnet-4-20250514`（推奨：バランス型）
- または `claude-3-5-haiku-20241022`（高速・低コスト）

### パラメータ
```typescript
{
  model: "claude-sonnet-4-20250514",
  max_tokens: 4096,
  stream: true,
  messages: [...],
  system: "あなたは親切で知識豊富なAIアシスタントです。日本語で丁寧に回答してください。"
}
```

---

## 開発コマンド

```bash
# 依存関係インストール
npm install

# 開発サーバー起動
npm run dev

# ビルド
npm run build

# 本番起動
npm run start

# リント
npm run lint
```

---

## 主要パッケージ

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "@anthropic-ai/sdk": "^0.30.0",
    "mongoose": "^8.0.0",
    "react-markdown": "^9.0.0",
    "remark-gfm": "^4.0.0",
    "highlight.js": "^11.0.0",
    "next-themes": "^0.3.0",
    "lucide-react": "^0.300.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.0.0",
    "postcss": "^8.0.0",
    "eslint": "^8.0.0",
    "eslint-config-next": "^14.0.0"
  }
}
```

---

## デプロイ（Vercel）

### 手順
1. GitHubリポジトリにプッシュ
2. Vercelでプロジェクトをインポート
3. 環境変数を設定:
   - `ANTHROPIC_API_KEY`
   - `MONGODB_URI`
4. デプロイ実行

### 注意事項
- Vercelのサーバーレス関数タイムアウト: Hobbyプランは10秒、Proプランは60秒
- ストリーミングレスポンスを使用することでタイムアウトを回避

---

## コーディング規約

### 命名規則
- **コンポーネント**: PascalCase（例: `ChatContainer.tsx`）
- **関数・変数**: camelCase（例: `handleSubmit`）
- **定数**: UPPER_SNAKE_CASE（例: `MAX_TOKENS`）
- **型・インターフェース**: PascalCase（例: `Message`）

### ファイル構成
- 1ファイル1コンポーネントを基本とする
- 関連するコンポーネントは同一ディレクトリにまとめる
- 共通ロジックは `hooks/` または `lib/` に切り出す

### コメント
- 複雑なロジックには日本語でコメントを追加
- JSDocは公開APIのみに記述

---

## セキュリティ考慮事項

- APIキーはサーバーサイドのみで使用（クライアントに露出しない）
- 環境変数は `.env.local` で管理し、Gitにコミットしない
- ユーザー入力のサニタイズ（XSS対策）
- MongoDBへの接続はTLS/SSL必須

---

## 今後の拡張候補

- ユーザー認証（NextAuth.js）
- 会話のエクスポート機能（JSON/Markdown）
- ファイルアップロード対応
- 音声入力対応
- プロンプトテンプレート機能
