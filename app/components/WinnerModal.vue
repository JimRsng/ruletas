<script setup lang="ts">
const open = defineModel<boolean>("open");
const isLoading = ref(false);

const { user } = useUserSession();

const { winner } = storeToRefs(useWheelStore());
const { selected } = storeToRefs(useRewardsStore());
const redemptionsStore = useRedemptionsStore();
const { deduplicated } = storeToRefs(redemptionsStore);

const winnerInfo = computed(() => {
  if (!winner.value) return null;
  return deduplicated.value.find(e => e.user.name === winner.value) || null;
});

const completeWinner = () => {
  if (!winnerInfo.value || !selected.value) return;
  isLoading.value = true;
  redemptionsStore.complete(selected.value.id, winnerInfo.value.id).then(() => {
    open.value = false;
  }).finally(() => {
    isLoading.value = false;
  });
};
</script>

<template>
  <UModal
    v-model:open="open"
    title="Ganador"
    description="Modal del ganador"
    :dismissible="false"
  >
    <template #content>
      <div class="text-center p-6 relative space-y-4">
        <UButton
          icon="lucide:x"
          variant="outline"
          color="neutral"
          class="absolute inset-e-2 top-2 rounded-full"
          size="sm"
          @click="open = false"
        />
        <p class="uppercase tracking-widest text-primary">Ganador</p>
        <div>
          <NuxtLink
            :to="`https://www.twitch.tv/popout/${user?.login}/viewercard/${winnerInfo?.user.login}`"
            target="_blank"
            class="text-5xl hover:underline font-bold"
          >
            {{ winnerInfo?.user.name }}
          </NuxtLink>
          <p v-if="winnerInfo?.inputs.length" class="text-sm text-muted">{{ winnerInfo?.inputs.join(", ") }}</p>
        </div>
        <div>
          <UButton
            type="button"
            label="Cobrar puntos"
            icon="custom:points"
            color="primary"
            variant="outline"
            class="mt-2"
            :loading="isLoading"
            @click="completeWinner"
          />
        </div>
      </div>
    </template>
  </UModal>
</template>
