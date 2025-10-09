/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_USE_DIRECT_API: string
  readonly VITE_GEMINI_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
