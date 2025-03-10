# ReactTemplate
Vite+Reactのテンプレート。Tailwind CSSも使える。  
Reactの基本、カスタムフック、コンテキストあたりも入れてある。

## 使い方
1. `npm install`で依存関係をインストールする
2. `npm run dev`で開発サーバーを起動する
3. `npm run build`でビルドする
  
- あとはご自由に編集してください。
  - `App.tsx`を編集していくことになります
  - 不要なファイルは消してください

## いろいろ
- 環境変数の使用 (https://zenn.dev/longbridge/articles/575190b038f805)
    1. `.env`に環境変数を記述する
    2. `vite-env.d.ts`に型定義を記述する
    3. `import.meta.env.{環境変数名}`で環境変数を使用する
       - `VITE_`から始まる環境変数のみ、公開される
- httpsでサーバーを起動する場合
  - https://zenn.dev/miyatom/articles/f0c8161d237d4c

## このテンプレートの作成方法
1. Vite+Reactの環境構築 (https://www.zenryoku-kun.com/new-post/vite)
    ```bash
    npm create vite@latest
    → React
    → TypeScript + SWC
    ```
2. Tailwind CSSの導入 (https://qiita.com/enumura1/items/71d4b4f75123cf5135fa)
    ```bash
    npm install -D tailwindcss postcss autoprefixer
    npx tailwindcss init -p
    ```
    ```js
    // tailwind.config.js
    + content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
    ```
    ```css
    <!-- /src/index.css -->
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
    ```