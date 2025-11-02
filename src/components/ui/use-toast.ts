export function useToast() {
  return {
    toast: (msg: { title: string; description?: string }) =>
      alert(`${msg.title}\n${msg.description ?? ""}`),
  };
}
