export interface GenerateRequest {
  topic: string;
  style?: string;
}

export interface GenerateResponse {
  video: {
    videoUrl: string;
  };
}
