/// <reference types="vite/client" />

// Declare MP3 file module for importing sound files
declare module "*.mp3" {
  const src: string;
  export default src;
}
