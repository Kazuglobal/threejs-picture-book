import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    open: true, // 開発サーバー起動時にブラウザを自動で開く
  },
  build: {
    outDir: 'dist', // ビルド出力先
    minify: true, // コードの圧縮を有効化
  },
  base: './' // 相対パスでのビルドを有効化（GitHub Pagesなどで使用可能）
});