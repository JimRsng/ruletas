<script setup lang="ts">
import type { TabsItem } from "@nuxt/ui";

const { user } = useUserSession();

const { winner, isSpinning, selected: wheelSelected } = storeToRefs(useWheelStore());

const chat = useTwitchChat(user.value?.login);
const winnerChat = ref(chat.value.filter(m => m.login === winner.value?.user.login));

const chatsTab = ref("live");
const chatContainer = useTemplateRef("chatContainer");

watch([chatsTab, () => chat.value.length], () => {
  requestAnimationFrame(() => {
    if (!chatContainer.value) return;
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  });
});

watch(winner, (value) => {
  if (!value) return;
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
  redemptionsStore.complete(selected.value.id, winner.value.id).then(() => {
    wheelSelected.value = null;
  }).finally(() => {
    loading.value.complete = false;
  });
};

const rejectWinner = () => {
  if (!winner.value || !selected.value) return;
  loading.value.reject = true;
  redemptionsStore.reject(selected.value.id, winner.value.id).then(() => {
    wheelSelected.value = null;
  }).finally(() => {
    loading.value.reject = false;
  });
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
        list: 'lg:gap-1',
        trigger: 'border border-accented hover:data-[state=inactive]:bg-accented data-[state=active]:bg-secondary data-[state=active]:border-secondary cursor-pointer',
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
              <div v-for="(message, i) in chat" :key="i">
                <span class="font-semibold" :style="{ color: message.color }">{{ message.displayName }}</span>
                <span v-if="message.isAction" :style="{ color: message.color }">&nbsp;{{ message.text }}</span>
                <span v-else>:&nbsp;{{ message.text }}</span>
              </div>
            </template>
            <template v-else-if="item.value === 'winner'">
              <div v-for="(message, i) in winnerChat" :key="i">
                <span class="font-semibold" :style="{ color: message.color }">{{ message.displayName }}</span>
                <span v-if="message.isAction" :style="{ color: message.color }">&nbsp;{{ message.text }}</span>
                <span v-else>:&nbsp;{{ message.text }}</span>
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
