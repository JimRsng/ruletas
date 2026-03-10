const messages = ref<TwitchParsedMessage[]>([]);

export const useTwitchChat = (channel?: string) => {
  if (!channel) return messages;
  let ws: WebSocket;
  onMounted(() => {
    ws = new WebSocket("wss://irc-ws.chat.twitch.tv:443");

    ws.onopen = () => {
      const anon = "justinfan" + Math.floor(Math.random() * 100000);

      ws.send("CAP REQ :twitch.tv/tags twitch.tv/commands twitch.tv/membership");
      ws.send("PASS SCHMOOPIIE");
      ws.send(`NICK ${anon}`);
      ws.send(`JOIN #${channel}`);
    };

    ws.onmessage = (event) => {
      const chunk = String(event.data || "");
      const lines = chunk.split("\r\n").filter(Boolean);

      for (const line of lines) {
        if (line.startsWith("PING")) {
          ws.send("PONG :tmi.twitch.tv");
          continue;
        }

        const parsed = parseTwitchIrcMessage(line);

        if (parsed?.command === "PRIVMSG" && parsed.text) {
          messages.value.push(parsed);
        }
      }
    };
  });

  onUnmounted(() => {
    ws.close();
  });

  return messages;
};
