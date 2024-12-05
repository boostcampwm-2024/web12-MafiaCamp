export interface ChatResponse {
  from: string;
  to: string;
  message: string;
}

export interface Chat extends ChatResponse {
  isMafiaOnly: boolean;
}
