import { ChatClient, type ChatMessage } from "@twurple/chat";

export const useTwitchChat = (channel?: string) => {
  const messages = ref<ChatMessage[]>([]);

  if (!channel) return messages;

  let chat: ChatClient;

  onMounted(() => {
    chat = new ChatClient({
      channels: [channel],
      rejoinChannelsOnReconnect: true
    });

    chat.connect();

    chat.onMessage((_, user, text, data) => {
      messages.value.push(data);
    });
  });

  onUnmounted(() => {
    chat.quit();
  });

  return messages;
};
