# AI Chat - 実行計画 TODO

## Phase 1: プロジェクトセットアップ ✅

### 1.1 Next.js プロジェクト初期化
- [x] Next.js プロジェクト作成（TypeScript, App Router, Tailwind CSS）
- [x] ESLint / Prettier 設定
- [x] `.env.local` と `.env.example` 作成
- [x] `.gitignore` 確認・更新

### 1.2 依存パッケージインストール
- [x] shadcn/ui 初期化・基本コンポーネント追加
- [x] @anthropic-ai/sdk インストール
- [x] mongoose インストール
- [x] react-markdown, remark-gfm インストール
- [x] highlight.js インストール
- [x] next-themes インストール（ダークモード用）
- [x] lucide-react インストール（アイコン用）

### 1.3 ディレクトリ構造作成
- [x] `components/` ディレクトリ構造作成
- [x] `lib/` ディレクトリ作成
- [x] `models/` ディレクトリ作成
- [x] `types/` ディレクトリ作成
- [x] `hooks/` ディレクトリ作成

---

## Phase 2: 基盤構築 ✅

### 2.1 型定義
- [x] `types/index.ts` - Message, Conversation 型定義

### 2.2 データベース接続
- [x] `lib/mongodb.ts` - MongoDB 接続ユーティリティ作成
- [x] `models/Conversation.ts` - Mongoose スキーマ・モデル作成
- [ ] MongoDB Atlas でデータベース作成・接続確認（ユーザー側で設定）

### 2.3 Claude API クライアント
- [x] `lib/anthropic.ts` - Anthropic クライアント初期化
- [x] ストリーミングレスポンスのヘルパー関数作成

### 2.4 ユーティリティ
- [x] `lib/utils.ts` - cn() 関数など共通ユーティリティ作成（shadcn/uiで自動生成済み）

---

## Phase 3: API Routes 実装 ✅

### 3.1 チャット API
- [x] `app/api/chat/route.ts` - POST: ストリーミングチャットAPI
  - [x] リクエストバリデーション
  - [x] Claude API 呼び出し（ストリーミング）
  - [x] レスポンスストリーム返却
  - [x] エラーハンドリング

### 3.2 会話 CRUD API
- [x] `app/api/conversations/route.ts`
  - [x] GET: 会話一覧取得
  - [x] POST: 新規会話作成
- [x] `app/api/conversations/[id]/route.ts`
  - [x] GET: 会話詳細取得
  - [x] PUT: 会話更新（メッセージ追加）
  - [x] DELETE: 会話削除

---

## Phase 4: UI コンポーネント実装 ✅

### 4.1 レイアウト・テーマ
- [x] `app/layout.tsx` - ルートレイアウト設定
- [x] `app/globals.css` - グローバルスタイル調整
- [x] `components/theme/ThemeProvider.tsx` - テーマプロバイダー
- [x] `components/theme/ThemeToggle.tsx` - ダークモード切替ボタン

### 4.2 shadcn/ui コンポーネント追加
- [x] Button コンポーネント
- [x] Input コンポーネント
- [x] ScrollArea コンポーネント
- [x] Separator コンポーネント
- [x] Sheet コンポーネント（モバイルサイドバー用）

### 4.3 サイドバー
- [x] `components/sidebar/Sidebar.tsx` - サイドバーコンテナ
- [x] `components/sidebar/ConversationList.tsx` - 会話履歴リスト
- [x] 新規チャットボタン
- [x] 会話削除機能

### 4.4 チャット UI
- [x] `components/chat/ChatContainer.tsx` - チャットメインコンテナ
- [x] `components/chat/MessageList.tsx` - メッセージ一覧
- [x] `components/chat/MessageItem.tsx` - 個別メッセージ表示
  - [x] ユーザー/アシスタントの区別表示
  - [x] アバター表示
- [x] `components/chat/ChatInput.tsx` - メッセージ入力フォーム
  - [x] テキストエリア（複数行対応）
  - [x] 送信ボタン
  - [x] Enter送信 / Shift+Enter改行

### 4.5 Markdown レンダリング
- [x] `components/chat/MarkdownRenderer.tsx` - Markdown 表示コンポーネント
- [x] `components/chat/CodeBlock.tsx` - コードブロック表示
  - [x] シンタックスハイライト適用
  - [x] コピーボタン実装

---

## Phase 5: カスタムフック実装 ✅

### 5.1 チャットロジック
- [x] `hooks/useChat.ts`
  - [x] メッセージ送信処理
  - [x] ストリーミングレスポンス処理
  - [x] ローディング状態管理
  - [x] エラーハンドリング

### 5.2 会話管理
- [x] `hooks/useConversations.ts`
  - [x] 会話一覧取得
  - [x] 会話作成
  - [x] 会話切り替え
  - [x] 会話削除

---

## Phase 6: ページ実装 ✅

### 6.1 メインページ
- [x] `app/page.tsx` - チャットページ実装
  - [x] サイドバー統合
  - [x] チャットコンテナ統合
  - [x] レスポンシブレイアウト

---

## Phase 7: 機能統合・調整 ✅

### 7.1 ストリーミング統合
- [x] フロントエンドでのストリーム受信処理
- [x] リアルタイムメッセージ表示
- [x] 自動スクロール実装

### 7.2 会話履歴統合
- [x] 会話保存処理
- [x] 会話読み込み処理
- [x] 会話タイトル自動生成

### 7.3 UI/UX 調整
- [x] ローディングインジケーター
- [x] エラー表示
- [x] 空状態の表示（サンプルプロンプト付き）
- [x] アニメーション追加

---

## Phase 8: テスト・品質確認 ✅

### 8.1 テスト環境セットアップ
- [x] Vitest + Testing Library インストール・設定
- [x] vitest.config.ts 作成
- [x] vitest.setup.ts 作成（jsdomマッチャー設定）
- [x] package.json にテストスクリプト追加

### 8.2 ユニットテスト作成
- [x] コンポーネントテスト
  - [x] ChatInput.test.tsx (8テスト)
  - [x] MessageItem.test.tsx (5テスト)
  - [x] ThemeToggle.test.tsx (3テスト)
- [x] フックテスト
  - [x] useChat.test.tsx (7テスト)
  - [x] useConversations.test.tsx (7テスト)
- [x] APIルートテスト
  - [x] conversations.test.ts (8テスト)

### 8.3 テスト結果
- [x] 全38テストがパス
- [x] `npm run test:run` で実行確認

### 8.4 ビルド・動作確認
- [x] `npm run build` 成功
- [x] 開発サーバー起動確認 (`npm run dev`)
- [x] メインページ表示確認 (HTTP 200)
- [x] UI コンポーネント表示確認（サイドバー・チャット入力・サンプルプロンプト）

### 8.5 手動確認（ユーザー側で実施 - 環境変数設定後）
- [ ] ANTHROPIC_API_KEY と MONGODB_URI を `.env.local` に設定
- [ ] 基本的なチャット送受信
- [ ] ストリーミング表示
- [ ] 会話履歴の保存・読み込み
- [ ] ダークモード切替
- [ ] モバイル表示確認

---

## Phase 9: デプロイ ✅

### 9.1 デプロイ準備
- [x] 環境変数の本番設定確認 (`.env.example` 作成済み)
- [x] ビルドエラー確認 (`npm run build` 成功)
- [x] `vercel.json` 設定ファイル作成
- [x] `README.md` 作成（セットアップ手順付き）
- [x] `package.json` プロジェクト名修正
- [ ] MongoDB Atlas IP許可設定（ユーザー側で実施: 0.0.0.0/0 を許可）

### 9.2 Vercel デプロイ（ユーザー側で実施）

以下のコマンドでGitリポジトリを初期化してプッシュ:
```bash
git init
git add .
git commit -m "Initial commit: AI Chat application"
git branch -M main
git remote add origin https://github.com/your-username/ai-chat.git
git push -u origin main
```

Vercelでのデプロイ手順:
1. [Vercel](https://vercel.com) にログイン
2. "New Project" → GitHubリポジトリをインポート
3. 環境変数を設定:
   - `ANTHROPIC_API_KEY`: Anthropic APIキー
   - `MONGODB_URI`: MongoDB接続文字列
4. "Deploy" をクリック

- [ ] GitHub リポジトリ作成・プッシュ
- [ ] Vercel プロジェクト作成
- [ ] 環境変数設定
- [ ] デプロイ実行
- [ ] 本番環境動作確認

---

## 補足: ファイル作成順序（推奨）

```
1. プロジェクト初期化・パッケージインストール
2. types/index.ts
3. lib/utils.ts
4. lib/mongodb.ts
5. lib/anthropic.ts
6. models/Conversation.ts
7. app/api/chat/route.ts
8. app/api/conversations/route.ts
9. app/api/conversations/[id]/route.ts
10. components/theme/*
11. components/ui/* (shadcn)
12. components/chat/MarkdownRenderer.tsx
13. components/chat/CodeBlock.tsx
14. components/chat/MessageItem.tsx
15. components/chat/MessageList.tsx
16. components/chat/ChatInput.tsx
17. components/chat/ChatContainer.tsx
18. hooks/useChat.ts
19. hooks/useConversations.ts
20. components/sidebar/*
21. app/layout.tsx (更新)
22. app/page.tsx
```

---

## 進捗管理

| Phase | 状態 | 備考 |
|-------|------|------|
| Phase 1: セットアップ | ✅ 完了 | Next.js 16.1.1 / shadcn/ui 導入済み |
| Phase 2: 基盤構築 | ✅ 完了 | 型定義・MongoDB・Claude API実装済み |
| Phase 3: API Routes | ✅ 完了 | チャット・会話CRUD API実装済み |
| Phase 4: UIコンポーネント | ✅ 完了 | チャット・サイドバー・テーマ実装済み |
| Phase 5: カスタムフック | ✅ 完了 | useChat・useConversations実装済み |
| Phase 6: ページ実装 | ✅ 完了 | メインページ統合完了 |
| Phase 7: 機能統合 | ✅ 完了 | ストリーミング・履歴・UI/UX完了 |
| Phase 8: テスト | ✅ 完了 | Vitest + Testing Library / 38テストパス |
| Phase 9: デプロイ | ✅ 準備完了 | vercel.json・README.md作成済み / ユーザー側でGit push & Vercelデプロイ |

---

## Phase 10: 残タスク・改善項目

コードレビューにより特定された改善項目（38件）を優先度別に整理。

### 10.1 🔴 Critical（即座に対応必要）

#### セキュリティ
- [ ] **ユーザー認証システムの実装** - 現在全ユーザーが全会話にアクセス可能
  - NextAuth.js または Clerk の導入
  - `userId` フィールドをConversationモデルに追加
  - 全APIエンドポイントでユーザー認証チェック

- [ ] **XSS脆弱性の修正** (`components/chat/CodeBlock.tsx`)
  - `dangerouslySetInnerHTML` の使用箇所
  - DOMPurify によるサニタイズ追加

- [ ] **APIレート制限の実装** (`app/api/`)
  - DoS攻撃対策
  - APIコスト管理
  - `lib/rateLimit.ts` の作成

### 10.2 🟠 High Priority（重要）

#### API バリデーション
- [ ] **チャットAPIの入力検証強化** (`app/api/chat/route.ts`)
  - 空メッセージ・空白のみのチェック
  - メッセージ長制限（10,000文字）
  - 配列内の各メッセージの検証

- [ ] **会話API入力検証** (`app/api/conversations/route.ts`, `[id]/route.ts`)
  - タイトル長制限（200文字）
  - 入力値のサニタイズ
  - 型チェック強化

#### Hooks
- [ ] **useConversations のstale closure修正** (`hooks/useConversations.ts:60-73`)
  - `deleteConversation` の依存配列問題
  - `setCurrentConversation` のupdater関数使用

- [ ] **useChat のレスポンス検証** (`hooks/useChat.ts:55`)
  - 会話作成後の `response.ok` チェック
  - `_id` の存在確認

#### UX
- [ ] **会話削除時の確認ダイアログ** (`components/sidebar/ConversationList.tsx`)
  - 誤削除防止
  - shadcn/ui AlertDialog の使用

### 10.3 🟡 Medium Priority（中程度）

#### ストリーミング・リソース管理
- [ ] **AbortController によるストリーミングクリーンアップ** (`hooks/useChat.ts:78-89`)
  - コンポーネントアンマウント時のリソース解放
  - fetchリクエストのキャンセル対応

- [ ] **JSONパースエラーのロギング** (`hooks/useChat.ts:111-113`)
  - 空のcatchブロックにログ追加
  - デバッグ容易性向上

#### データベース
- [ ] **Mongooseスキーマにバリデーション追加** (`models/Conversation.ts`)
  - `content` に `maxlength: 10000`
  - `title` に `maxlength: 200`, `minlength: 1`

- [ ] **データベースインデックス追加** (`models/Conversation.ts`)
  - `userId` フィールド追加時にインデックス作成
  - `{ userId: 1, updatedAt: -1 }` 複合インデックス

#### パフォーマンス
- [ ] **React.memo によるコンポーネント最適化**
  - `MessageList` のメモ化
  - `MessageItem` のメモ化
  - 不要な再レンダリング防止

- [ ] **コールバック依存関係の最適化** (`app/page.tsx:21-27`)
  - `handleConversationCreated` の依存配列見直し

- [ ] **自動スクロールの最適化** (`components/chat/MessageList.tsx:36-38`)
  - 新規メッセージ追加時のみスクロール
  - デバウンス処理の検討

#### アクセシビリティ
- [ ] **ConversationList のキーボードナビゲーション改善** (`components/sidebar/ConversationList.tsx:43-49`)
  - フォーカスインジケーター追加
  - ARIA属性の追加

- [ ] **CodeBlock のアクセシビリティ** (`components/chat/CodeBlock.tsx:37-54`)
  - `aria-label` の追加
  - コピー完了の通知

#### エラーハンドリング
- [ ] **MarkdownRenderer のエラーバウンダリ** (`components/chat/MarkdownRenderer.tsx`)
  - パースエラー時のフォールバックUI

- [ ] **削除中のローディング状態** (`components/sidebar/ConversationList.tsx`)
  - `isDeleting` ステート追加
  - 重複クリック防止

### 10.4 🟢 Low Priority（将来の改善）

#### 型定義
- [ ] **ApiError型の修正** (`types/index.ts:30-33`)
  - `message` プロパティをオプショナルに
  - `ApiResponse<T>` ジェネリック型追加

- [ ] **ConversationInput型の追加** (`types/index.ts`)
  - 作成時用の型定義

#### UX改善
- [ ] **サイドバーの空状態メッセージ改善** (`components/sidebar/ConversationList.tsx:22-27`)
  - ヘルプテキスト追加
  - 「New Chat」ボタンへの誘導

- [ ] **会話リストのスケルトンローダー**
  - 読み込み中の視覚的フィードバック

- [ ] **エラーメッセージの詳細化** (`hooks/useConversations.ts:52-54`)
  - 具体的なエラー原因の表示

#### 機能追加
- [ ] **会話タイトル編集機能**
  - インライン編集UI
  - PATCH APIエンドポイント

- [ ] **メッセージ編集・削除機能**
  - メッセージ単位のCRUD
  - 編集履歴の保存（オプション）

- [ ] **会話検索機能**
  - 全文検索
  - タイトル・メッセージ内容の検索

- [ ] **会話エクスポート機能**
  - JSON/Markdown/PDF形式
  - バックアップ用途

#### パフォーマンス（大規模対応）
- [ ] **会話リストの仮想スクロール** (`components/sidebar/ConversationList.tsx`)
  - react-window または react-virtualized
  - 大量会話時のパフォーマンス改善

#### テスト
- [ ] **E2Eテストの追加**
  - Playwright導入
  - 主要ユーザーフローのテスト

- [ ] **エラーシナリオのテスト追加**
  - ネットワークエラー
  - 不正レスポンス
  - エッジケース

---

## 残タスク集計

| 優先度 | 件数 | 説明 |
|--------|------|------|
| 🔴 Critical | 3 | セキュリティ・認証関連 |
| 🟠 High | 5 | API検証・重要なバグ修正 |
| 🟡 Medium | 11 | パフォーマンス・UX改善 |
| 🟢 Low | 11 | 将来の機能追加・テスト |
| **合計** | **30** | |

---

## 推奨実装順序

1. **認証システム** → 全機能の前提条件
2. **XSS対策・レート制限** → セキュリティ基盤
3. **API入力検証** → データ整合性
4. **確認ダイアログ・エラーハンドリング** → UX改善
5. **パフォーマンス最適化** → スケーラビリティ
6. **追加機能** → 機能拡張
