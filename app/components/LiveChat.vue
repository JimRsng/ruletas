<script setup lang="ts">
import type { TabsItem } from "@nuxt/ui";

const { user: broadcaster } = useUserSession();

const { winner, settings, isSpinning, selected: wheelSelected } = storeToRefs(useWheelStore());

const chat = useTwitchChat(broadcaster.value?.login);
const winnerChat = computed(() => chat.value.filter(m => m.userInfo.userName === winner.value?.user.login));

const chatsTab = ref("live");
const chatContainer = useTemplateRef("chatContainer");

watch([chatsTab, () => chat.value.length], () => {
  requestAnimationFrame(() => {
    if (!chatContainer.value) return;
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  });
});

watch([winner, isSpinning], ([winnerValue, isSpinningValue]) => {
  if (!winnerValue || isSpinningValue) return;
  chatsTab.value = "winner";
});

const items = computed<TabsItem[]>(() => [
  { label: "Chat", value: "live", icon: "simple-icons:twitch" },
  { label: "Ganador", value: "winner", icon: "lucide:crown", disabled: !winner.value }
]);

const loading = ref({
  reject: false,
  complete: false
});

const { selected } = storeToRefs(useRewardsStore());
const redemptionsStore = useRedemptionsStore();

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
</script>

<template>
  <div class="bg-elevated rounded-xl space-y-4 p-4">
    <UTabs
      v-model="chatsTab"
      :items="items"
      class="h-full"
      color="secondary"
      :ui="{
        content: 'flex-1',
        list: 'gap-1',
        trigger: 'border border-accented hover:data-[state=inactive]:bg-accented data-[state=active]:bg-secondary data-[state=active]:border-secondary cursor-pointer animate-on-hover',
      }"
    >
      <template #content="{ item }">
        <div class="flex flex-col h-full">
          <div v-if="item.value === 'winner' && winner" class="flex pb-2 px-2">
            <UserDisplay variant="winner" />
          </div>
          <div
            ref="chatContainer"
            class="flex-1 max-h-140 min-h-70 overflow-y-auto wrap-break-word text-sm space-y-2 rounded-xl border-2 border-accented bg-default px-2 py-3"
          >
            <template v-if="item.value === 'live'">
              <div v-if="!chat.length" class="text-muted italic animate-pulse">No hay mensajes aún...</div>
              <div v-for="(message, i) in chat" :key="i">
                <span class="font-semibold" :style="{ color: message.userInfo.color }">
                  <NuxtLink :to="`https://twitch.tv/popout/${broadcaster?.login}/viewercard/${message.userInfo.userName}`" target="_blank" class="hover:underline">
                    {{ message.userInfo.displayName }}
                  </NuxtLink>
                </span>
                <span>: {{ message.text }}</span>
              </div>
            </template>
            <template v-else-if="item.value === 'winner'">
              <div v-if="!winnerChat.length" class="text-muted italic animate-pulse">Esperando mensajes del ganador...</div>
              <div v-for="(message, i) in winnerChat" :key="i">
                <span class="text-xs text-muted font-semibold" :title="message.date.toLocaleString()">
                  [{{ message.date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: false }) }}]
                </span>
                <span class="font-semibold" :style="{ color: message.userInfo.color }">
                  <NuxtLink :to="`https://twitch.tv/popout/${broadcaster?.login}/viewercard/${message.userInfo.userName}`" target="_blank" class="hover:underline">
                    {{ message.userInfo.displayName }}
                  </NuxtLink>
                </span>
                <span>: {{ message.text }}</span>
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
