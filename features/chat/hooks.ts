export const useChat = () => ({
  messages: [] as any[],
  isLoading: false,
  sendMessage: (_message: string) => {},
  reset: () => {},
  input: "",
  handleInputChange: () => {},
  handleSubmit: () => {},
});