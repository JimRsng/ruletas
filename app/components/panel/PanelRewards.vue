<script setup lang="ts">
const { data } = await useFetch("/api/rewards", {
  key: "rewards"
});

const rewardsStore = useRewardsStore();
const { selected } = storeToRefs(rewardsStore);
const redemptionsStore = useRedemptionsStore();
const { isSpinning } = storeToRefs(useWheelStore());

rewardsStore.setup(data.value || []);

const isLoading = ref(false);
const isModalOpen = ref(false);

watch(selected, async (reward, oldReward) => {
  if (!reward || isModalOpen.value) return;

  if (reward.active && !reward.paused) {
    redemptionsStore.createInterval(reward.id);
  }
  else {
    redemptionsStore.clearInterval();
  }

  if (!oldReward || reward.id !== oldReward.id) return;

  isLoading.value = true;
  rewardsStore.edit(reward.id, {
    active: reward.active,
    paused: reward.paused,
    cost: reward.cost
  }).catch(() => {
    redemptionsStore.clearInterval();
  }).finally(() => {
    isLoading.value = false;
  });
}, { deep: true });

onUnmounted(() => {
  redemptionsStore.clearInterval();
});
</script>

<template>
  <Transition name="slide" mode="out-in">
    <div v-if="selected" class="flex flex-col lg:flex-row gap-4 items-center relative p-4 bg-elevated rounded-xl shadow">
      <div class="flex flex-col items-center justify-center rounded-xl" :style="{ backgroundColor: selected.color }">
        <Icon name="custom:points" size="1.4rem" class="my-2 text-neutral-200" />
        <UInputNumber
          v-model="selected.cost"
          class="max-w-20"
          size="sm"
          :ui="{ base: 'rounded-xl rounded-t-none text-center dark:bg-default/50 light:bg-default/80' }"
          :format-options="{
            style: 'decimal',
          }"
          :increment="false"
          :decrement="false"
          :disabled="isLoading || isSpinning"
        />
      </div>
      <div class="text-center lg:text-start">
        <h3 class="text-lg font-semibold">{{ selected.title }}</h3>
        <p class="text-muted text-sm">{{ selected.description }}</p>
      </div>
      <div class="flex flex-col lg:ms-auto gap-2">
        <USwitch v-model="selected.active" label="Activo" :loading="isLoading" :disabled="isSpinning" />
        <USwitch v-model="selected.paused" label="Pausado" color="secondary" :loading="isLoading" :disabled="isSpinning" />
      </div>
      <UButton
        :icon="isLoading ? 'lucide:loader-circle' : 'lucide:arrow-left-right'"
        class="absolute -top-2 -inset-e-2 rounded-full"
        :class="{ 'animate-spin': isLoading }"
        size="sm"
        :disabled="isSpinning"
        @click="isModalOpen = true"
      />
    </div>
  </Transition>
  <UModal
    v-model:open="isModalOpen"
    title="Recompensas"
    description="Crea o administra recompensas de Twitch para la ruleta"
    :close="{
      variant: 'outline',
      color: 'primary',
      class: 'rounded-full',
    }"
  >
    <UButton
      v-if="!selected"
      label="Crea o administra recompensas de Twitch para la ruleta"
      variant="subtle"
      color="neutral"
      :ui="{ base: 'ring-0 border-none' }"
      class="text-muted hover:text-default p-4 animate-on-hover rounded-xl shadow"
      block
    />
    <template #body>
      <div class="flex flex-col gap-2">
        <RewardsManager @select="isModalOpen = false" />
      </div>
    </template>
  </UModal>
</template>
