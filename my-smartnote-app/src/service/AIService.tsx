import httpRequest from "@/utils/httpRequest";

export interface SummarizeResponse {
  summary: string;
}

export interface SuggestResponse {
  suggestions: string[];
}

export const AiService = {
  summarize: async (content: string): Promise<string> => {
    const response = await httpRequest.post<SummarizeResponse>(
      "/ai/summarize",
      { content }
    );
    return response.data.summary;
  },

  suggest: async (content: string): Promise<string[]> => {
    const response = await httpRequest.post<SuggestResponse>("/ai/suggest", {
      content,
    });
    return response.data.suggestions;
  },
};
