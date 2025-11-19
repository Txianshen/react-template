/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_API_TIMEOUT: string;
  readonly VITE_WS_URL: string;
  readonly VITE_APP_TITLE: string; // document.title 使用
  readonly VITE_APP_NAME: string; // 主页标题使用
  readonly VITE_APP_VERSION: string;
  readonly VITE_APP_ENV: string;
  readonly VITE_DEBUG: string;
  readonly VITE_ENABLE_LOG: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
