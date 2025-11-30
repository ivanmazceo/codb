export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  isStreaming?: boolean;
}

export interface BackgroundBlob {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  animationDelay: string;
}

export enum AppMode {
  FOCUS = 'FOCUS',
  SPLIT = 'SPLIT'
}