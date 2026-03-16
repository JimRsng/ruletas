<script setup lang="ts">
import type { TabsItem } from "@nuxt/ui";
import type { ChatMessage } from "@twurple/chat";

const { user: broadcaster } = useUserSession();

const { winner, settings, isSpinning, selected: wheelSelected } = storeToRefs(useWheelStore());
const { selected } = storeToRefs(useRewardsStore());
const redemptionsStore = useRedemptionsStore();

const loading = ref({
  reject: false,
  complete: false
});

const winnerTime = ref(0);
const winnerMessages = ref<ChatMessage[]>([]);

const chat = useTwitchChat(broadcaster.value?.login, {
  onMessage: (data) => {
    if (!winner.value) return;
    if (data.userInfo.userName === winner.value.user.login && data.date.getTime() >= winnerTime.value) {
      winnerMessages.value.push(data);
    }
  }
});

const winnerChat = computed(() => winnerMessages.value.slice(-100));

const isCountUpStart = computed(() => !!winner.value && !isSpinning.value);
const isCountUpStop = computed(() => winnerChat.value.length > 0);
const countUp = useCountUp(isCountUpStart, isCountUpStop);

const chatContainer = useTemplateRef("chatContainer");

const completeWinner = () => {
  if (!winner.value || !selected.value) return;
  loading.value.complete = true;
  if (settings.value.weighted) {
    redemptionsStore.completeAll(selected.value.id, winner.value.user.id).then(() => {
      wheelSelected.value = null;
    }).catch(() => {}).finally(() => {
      loading.value.complete = false;
    });
  }
  else {
    redemptionsStore.complete(selected.value.id, winner.value.id).then(() => {
      wheelSelected.value = null;
    }).catch(() => {}).finally(() => {
      loading.value.complete = false;
    });
  }
};

const rejectWinner = () => {
  if (!winner.value || !selected.value) return;
  loading.value.reject = true;
  if (settings.value.weighted) {
    redemptionsStore.rejectAll(selected.value.id, winner.value.user.id).then(() => {
      wheelSelected.value = null;
    }).catch(() => {}).finally(() => {
      loading.value.reject = false;
    });
  }
  else {
    redemptionsStore.reject(selected.value.id, winner.value.id).then(() => {
      wheelSelected.value = null;
    }).catch(() => {}).finally(() => {
      loading.value.reject = false;
    });
  }
};

const chatsTab = ref("live");
const items = computed<TabsItem[]>(() => [
  { label: "Chat", value: "live", icon: "simple-icons:twitch" },
  { label: "Ganador", value: "winner", icon: "lucide:crown", disabled: !winner.value }
]);

useChatScroll(chatContainer, [chatsTab, chat]);

watch([winner, isSpinning], () => {
  if (!winner.value || isSpinning.value) return;
  winnerTime.value = Date.now();
  winnerMessages.value = [];
  chatsTab.value = "winner";
});

watch(selected, () => {
  if (chatsTab.value === "live") return;
  chatsTab.value = "live";
});

watch(wheelSelected, () => {
  if (wheelSelected.value) return;
  chatsTab.value = "live";
});
</script>

<template>
  <div class="h-full flex flex-col">
    <UTabs
      v-model="chatsTab"
      :items="items"
      class="h-full"
      color="secondary"
      :ui="{
        content: 'flex-1 min-h-0',
        list: 'gap-1 p-0',
      }"
    >
      <template #content="{ item }">
        <div class="flex flex-col h-full">
          <div v-if="item.value === 'winner' && winner" class="flex py-2 gap-2 items-center">
            <UserDisplay variant="winner" class="flex-1" />
            <div class="text-sm tabular-nums border-2 border-accented py-1 px-2 rounded-lg bg-default">
              <span :class="isCountUpStop ? 'text-primary' : 'animate-pulse'">{{ formatTimer(countUp) }}</span>
            </div>
          </div>
          <div
            ref="chatContainer"
            class="flex-1 overflow-y-auto wrap-break-word text-sm space-y-2 rounded-xl border-2 border-accented bg-default px-2 py-3"
          >
            <template v-if="item.value === 'live'">
              <div v-if="!chat.length" class="text-muted italic animate-pulse">No hay mensajes aún...</div>
              <div v-for="(message, i) in chat" :key="i">
                <span class="font-semibold" :style="{ color: message.userInfo.color }">
                  <ChatBadges :badges="message.userInfo.badges" />
                  <NuxtLink :to="`https://twitch.tv/popout/${broadcaster?.login}/viewercard/${message.userInfo.userName}`" target="_blank" class="hover:underline">
                    {{ message.userInfo.displayName }}
                  </NuxtLink>
                </span>
                <span>: <ChatEmotes :text="message.text" /></span>
              </div>
            </template>
            <template v-else-if="item.value === 'winner'">
              <div v-if="!winnerChat.length" class="text-muted italic animate-pulse">Esperando mensajes del ganador...</div>
              <div v-for="(message, i) in winnerChat" :key="i">
                <span class="text-xs text-muted font-semibold" :title="message.date.toLocaleString()">
                  [{{ message.date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: false }) }}]
                </span>
                <span class="font-semibold" :style="{ color: message.userInfo.color }">
                  <ChatBadges :badges="message.userInfo.badges" />
                  <NuxtLink :to="`https://twitch.tv/popout/${broadcaster?.login}/viewercard/${message.userInfo.userName}`" target="_blank" class="hover:underline">
                    {{ message.userInfo.displayName }}
                  </NuxtLink>
                </span>
                <span>: <ChatEmotes :text="message.text" /></span>
              </div>
            </template>
          </div>
          <div v-if="item.value === 'winner' && winner" class="grid grid-cols-2 gap-2">
            <UButton
              type="button"
              label="Cobrar"
              icon="lucide:check"
              color="neutral"
              class="mt-2"
              :class="{ 'animate-on-hover': !isSpinning }"
              block
              :loading="loading.complete"
              @click="completeWinner"
            />
            <UButton
              type="button"
              label="Reembolsar"
              icon="lucide:x"
              color="error"
              class="mt-2"
              :class="{ 'animate-on-hover': !isSpinning }"
              block
              :loading="loading.reject"
              @click="rejectWinner"
            />
          </div>
        </div>
      </template>
    </UTabs>
  </div>
</template>
