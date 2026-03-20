export class LLMError extends Error {
  constructor(message?: string) {
    super(message ?? "LLM processing error");
    this.name = "LLMError";
  }
}