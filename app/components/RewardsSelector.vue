<script setup lang="ts">
const { data } = await useFetch("/api/rewards", {
  key: "rewards"
});

const rewardsStore = useRewardsStore();
const { rewards, selected } = storeToRefs(rewardsStore);
const redemptionsStore = useRedemptionsStore();
const { isSpinning } = storeToRefs(useWheelStore());

rewardsStore.setup(data.value || []);

const loading = ref({
  create: false,
  edit: false
});

const isModalOpen = ref(false);
const isCreate = ref(false);

const form = useFormState({
  title: "",
  description: "",
  cost: 10000,
  color: "#000000",
  active: true,
  paused: true
});

const selectReward = (id: string) => {
  if (isModalOpen.value) {
    isModalOpen.value = false;
  }

  redemptionsStore.clear();
  rewardsStore.select(id);
};

const createReward = async () => {
  loading.value.create = true;
  rewardsStore.create(form.value).then(() => {
    form.reset();
  }).finally(() => {
    loading.value.create = false;
    isCreate.value = false;
  });
};

watch(selected, async (reward, oldReward) => {
  if (!reward) return;

  if (reward.active && !reward.paused) {
    redemptionsStore.createInterval(reward.id);
  }
  else {
    redemptionsStore.clearInterval();
  }

  if (!oldReward || reward.id !== oldReward.id) return;

  loading.value.edit = true;
  rewardsStore.edit(reward.id, {
    active: reward.active,
    paused: reward.paused,
    cost: reward.cost
  }).catch(() => {
    redemptionsStore.clearInterval();
  }).finally(() => {
    loading.value.edit = false;
  });
}, { deep: true });

onUnmounted(() => {
  redemptionsStore.clearInterval();
});
</script>

<template>
  <div v-if="selected" class="p-4 bg-elevated rounded-xl flex flex-col lg:flex-row gap-4 items-center relative">
    <div class="flex flex-col items-center justify-center rounded-xl" :style="{ backgroundColor: selected.color }">
      <Icon name="custom:points" size="1.4rem" class="my-2 text-neutral-200" />
      <UInputNumber
        v-model="selected.cost"
        class="max-w-20"
        size="sm"
        :ui="{ base: 'rounded-xl rounded-t-none text-center bg-default/50' }"
        :format-options="{
          style: 'decimal',
        }"
        :increment="false"
        :decrement="false"
        :disabled="loading.edit || isSpinning"
      />
    </div>
    <div class="text-center lg:text-start">
      <h3 class="text-lg font-semibold">{{ selected.title }}</h3>
      <p class="text-muted text-sm">{{ selected.description }}</p>
    </div>
    <div class="flex flex-col lg:ms-auto gap-2">
      <USwitch v-model="selected.active" label="Activo" :loading="loading.edit" :disabled="isSpinning" />
      <USwitch v-model="selected.paused" label="Pausado" color="secondary" :loading="loading.edit" :disabled="isSpinning" />
    </div>
    <UButton
      icon="lucide:arrow-left-right"
      class="absolute -top-2 -inset-e-2"
      size="sm"
      :disabled="isSpinning"
      @click="isModalOpen = true"
    />
  </div>
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
      variant="ghost"
      color="neutral"
      class="p-4 rounded-xl border-2 border-default text-muted hover:text-default animate-on-hover"
      block
    />
    <template #body>
      <div class="flex flex-col gap-2">
        <TransitionGroup name="slide">
          <RewardCard
            v-for="reward of rewards"
            :key="reward.id"
            :reward="reward"
            @click="selectReward(reward.id)"
          />
        </TransitionGroup>
        <div v-if="!isCreate" class="p-4 border-2 border-dashed border-default rounded-xl text-center cursor-pointer hover:bg-elevated hover:border-primary group scale-on-hover" @click="isCreate = true">
          <UButton
            icon="lucide:plus"
            variant="outline"
            color="primary"
            class="mb-2 group-hover:scale-[1.1] transition-transform group-hover:bg-primary/10"
          />
          <p>Crear recompensa</p>
        </div>
        <RewardForm
          v-else
          v-model="form"
          :title="'Crear recompensa'"
          :submit-label="'Crear'"
          :loading="loading.create"
          cancellable
          @cancel="isCreate = false"
          @submit.prevent="createReward"
        />
      </div>
    </template>
  </UModal>
</template>
