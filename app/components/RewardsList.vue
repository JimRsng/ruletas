<script setup lang="ts">
const { data: rewards, refresh: refreshRewards } = await useFetch("/api/rewards", {
  deep: true
});

type Reward = NonNullable<typeof rewards.value>[number];

const items = defineModel<RuletasRedemption[]>("redemptions", { required: true });

const selectedReward = ref<Reward | null>(null);
const redemptionsInterval = ref<number | null>(null);
const intervalMs = import.meta.dev ? 10000 : 2000;

const selectReward = (reward: Reward) => {
  if (isModalOpen.value) {
    isModalOpen.value = false;
  }

  selectedReward.value = reward;
};

const clearRedemptionsInterval = () => {
  if (redemptionsInterval.value) {
    console.info("Stopping listening to redemptions...");
    clearInterval(redemptionsInterval.value);
    redemptionsInterval.value = null;
  }
};

const fetchRedemptions = () => {
  if (!selectedReward.value) return;

  $fetch(`/api/rewards/${selectedReward.value.id}/redemptions`).then((data) => {
    if (data.length > 0) {
      items.value = data;
    }
  }).catch(() => {});
};

watch(selectedReward, (reward, oldReward) => {
  if (!reward) return;

  if (reward.active) {
    console.info("Listening to redemptions...");
    fetchRedemptions();
    redemptionsInterval.value = window.setInterval(fetchRedemptions, intervalMs);
  }
  else {
    clearRedemptionsInterval();
  }

  if (!oldReward || reward.id !== oldReward.id) return;

  $fetch(`/api/rewards/${reward.id}`, {
    method: "PATCH",
    body: {
      active: reward.active,
      cost: reward.cost
    }
  });
}, { deep: true });

const isModalOpen = ref(false);
const isCreate = ref(false);
const isCreating = ref(false);
const isDeleting = ref(false);

const form = useFormState({
  title: "",
  description: "",
  cost: 100,
  color: "#000000",
  active: false
});

const createReward = async () => {
  isCreating.value = true;
  $fetch("/api/rewards", {
    method: "POST",
    body: form.value
  }).then(async () => {
    await refreshRewards();
    form.reset();
  }).finally(() => {
    isCreating.value = false;
    isCreate.value = false;
  });
};

const deleteReward = async (reward: Reward) => {
  if (!confirm("¿Estás seguro de que quieres eliminar esta recompensa?")) return;
  isDeleting.value = true;
  $fetch(`/api/rewards/${reward.id}`, {
    method: "DELETE"
  }).then(async () => {
    await refreshRewards();
    if (selectedReward.value?.id === reward.id) {
      selectedReward.value = null;
    }
  }).finally(() => {
    isDeleting.value = false;
  });
};

onUnmounted(() => {
  clearRedemptionsInterval();
});
</script>

<template>
  <div v-if="selectedReward" class="p-4 bg-elevated rounded-xl flex gap-4 items-center relative">
    <div class="flex flex-col items-center justify-center rounded-xl" :style="{ backgroundColor: selectedReward.color }">
      <Icon name="custom:points" size="1.4rem" class="my-2" />
      <UInputNumber
        v-model="selectedReward.cost"
        class="max-w-20"
        size="sm"
        :ui="{ base: 'rounded-xl rounded-t-none text-center' }"
        :format-options="{
          style: 'decimal',
        }"
        :increment="false"
        :decrement="false"
      />
    </div>
    <div>
      <h3 class="text-lg font-semibold">{{ selectedReward.title }}</h3>
      <p class="text-muted text-sm">{{ selectedReward.description }}</p>
    </div>
    <USwitch v-model="selectedReward.active" class="ms-auto" label="Activo" />
    <UButton icon="lucide:refresh-ccw" class="rounded-full absolute -top-2 -inset-e-2 shadow" size="sm" @click="isModalOpen = true" />
  </div>
  <UModal
    v-model:open="isModalOpen"
    title="Recompensas"
    description="Selecciona una recompensa de Twitch para usar la ruleta"
    :close="{
      variant: 'outline',
      color: 'neutral',
      class: 'rounded-full',
    }"
  >
    <UButton
      v-if="!selectedReward"
      label="Selecciona una recompensa de Twitch para usar la ruleta"
      variant="ghost"
      color="neutral"
      class="p-4 rounded-xl cursor-pointer border-2 border-default text-muted hover:text-default animate-on-hover"
      block
    />
    <template #body>
      <div class="flex flex-col gap-2">
        <TransitionGroup name="slide">
          <div
            v-for="reward of rewards"
            :key="reward.id"
            class="p-4 border border-default rounded-lg cursor-pointer hover:bg-elevated hover:border-primary"
            @click="selectReward(reward)"
          >
            <div class="flex gap-4 items-center">
              <div class="flex items-center justify-center rounded-xl h-16 w-18 relative" :style="{ backgroundColor: reward.color }">
                <Icon name="custom:points" size="1.4rem" />
                <span class="text-xs bg-default/80 absolute bottom-1 px-2 rounded-xl">{{ formatNumber(reward.cost) }}</span>
              </div>
              <div>
                <h3 class="text-lg font-semibold">{{ reward.title }}</h3>
                <p class="text-muted text-sm">{{ reward.description }}</p>
              </div>
              <UButton icon="lucide:trash" color="error" class="ms-auto" size="sm" :loading="isDeleting" :disabled="isDeleting" @click.stop="deleteReward(reward)" />
            </div>
          </div>
        </TransitionGroup>
        <div v-if="!isCreate" class="p-4 border-2 border-dashed border-default rounded-lg text-center cursor-pointer hover:bg-elevated hover:border-primary " @click="isCreate = true">
          <Icon name="lucide:plus" size="1.4rem" class="mx-auto mb-2" />
          <p>Crear recompensa</p>
        </div>
        <form v-else class="border border-dashed border-default rounded-lg p-4 flex flex-col gap-3" @submit.prevent="createReward">
          <h3 class="font-semibold">Crear recompensa</h3>
          <UFormField label="Título" required>
            <UInput v-model="form.title" placeholder="Título" class="w-full" required />
          </UFormField>
          <UFormField label="Descripción">
            <UInput v-model="form.description" placeholder="Descripción" class="w-full" />
          </UFormField>
          <div class="flex gap-2 items-center">
            <UFormField label="Costo" required>
              <UInputNumber
                v-model="form.cost"
                :min="1"
                placeholder="Costo"
                class="flex-1"
                :ui="{ base: 'text-start' }"
                :format-options="{ style: 'decimal' }"
                decrement-icon="custom:points"
                :increment="false"
                :decrement="{
                  color: 'neutral',
                  disabled: true,
                  ui: { base: 'cursor-auto!' },
                }"
              />
            </UFormField>
            <UFormField label="Color" required>
              <label class="cursor-pointer" title="Color">
                <span class="block size-9 rounded-lg border border-default" :style="{ backgroundColor: form.color }" />
                <input v-model="form.color" type="color" class="sr-only">
              </label>
            </UFormField>
          </div>
          <div class="grid md:grid-cols-2 gap-2">
            <UButton type="button" label="Cancelar" class="uppercase" color="error" block :disabled="isCreating" @click="isCreate = false" />
            <UButton type="submit" label="Crear" class="uppercase" :loading="isCreating" :disabled="isCreating" block />
          </div>
        </form>
      </div>
    </template>
  </UModal>
</template>
