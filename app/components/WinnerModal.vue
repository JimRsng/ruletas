<script setup lang="ts">
import { useReward } from "vue-rewards";

const open = defineModel<boolean>("open");

const { user: broadcaster } = useUserSession();
const { winner } = storeToRefs(useWheelStore());

const { reward: confettiReward } = useReward("confetti", "confetti", {
  startVelocity: 10,
  elementCount: 200,
  spread: 60,
  decay: 0.988,
  lifetime: 1000
});

watch(open, () => {
  if (!open.value) return;
  nextTick(() => {
    confettiReward();
  });
});
</script>

<template>
  <UModal
    v-model:open="open"
    title="Ganador"
    description="Modal del ganador"
  >
    <template #content>
      <div class="relative">
        <div id="confetti" class="-bottom-10 w-full fixed text-center" />
        <div id="winner-modal" class="text-center py-9 relative space-y-2">
          <UButton
            icon="lucide:x"
            variant="outline"
            color="neutral"
            class="absolute right-2 top-2"
            size="sm"
            @click="open = false"
          />
          <UButton class="cursor-pointer uppercase tracking-widest p-0 animate-pulse" variant="link" @click="confettiReward()">Ganador</UButton>
          <div>
            <NuxtLink
              :to="`https://www.twitch.tv/popout/${broadcaster?.login}/viewercard/${winner?.user.login}`"
              target="_blank"
              class="text-5xl hover:underline font-bold"
            >
              {{ winner?.user.name }}
            </NuxtLink>
            <p v-if="winner?.inputs.length" class="text-sm text-muted">{{ winner?.inputs.filter(Boolean).join(", ") }}</p>
          </div>
        </div>
      </div>
    </template>
  </UModal>
</template>
