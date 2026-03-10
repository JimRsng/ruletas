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
  deletions: {} as Record<string, boolean>,
  edit: false
});

const isModalOpen = ref(false);
const isCreate = ref(false);

const form = useFormState({
  title: "",
  description: "",
  cost: 100,
  color: "#000000",
  active: true,
  paused: false
});

const selectReward = (id: string) => {
  if (isModalOpen.value) {
    isModalOpen.value = false;
  }

  redemptionsStore.clear();
  rewardsStore.select(id);
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

const createReward = async () => {
  loading.value.create = true;
  rewardsStore.create(form.value).then(() => {
    form.reset();
  }).finally(() => {
    loading.value.create = false;
    isCreate.value = false;
  });
};

const deleteReward = async (reward: RuletasReward) => {
  loading.value.deletions[reward.id] = true;
  rewardsStore.remove(reward.id).then(() => {
    if (selected.value?.id === reward.id) {
      redemptionsStore.clearInterval();
      rewardsStore.clearSelected();
    }
  }).finally(() => {
    loading.value.deletions[reward.id] = false;
  });
};

onUnmounted(() => {
  redemptionsStore.clearInterval();
});
</script>

<template>
  <div v-if="selected" class="p-4 bg-elevated rounded-xl flex flex-col lg:flex-row gap-4 items-center relative">
    <div class="flex flex-col items-center justify-center rounded-xl" :style="{ backgroundColor: selected.color }">
      <Icon name="custom:points" size="1.4rem" class="my-2" />
      <UInputNumber
        v-model="selected.cost"
        class="max-w-20"
        size="sm"
        :ui="{ base: 'rounded-xl rounded-t-none text-center' }"
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
      class="absolute -top-2 -inset-e-2 shadow"
      size="sm"
      :disabled="isSpinning"
      @click="isModalOpen = true"
    />
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
      v-if="!selected"
      label="Selecciona una recompensa de Twitch para usar la ruleta"
      variant="ghost"
      color="neutral"
      class="p-4 rounded-xl border-2 border-default text-muted hover:text-default animate-on-hover"
      block
    />
    <template #body>
      <div class="flex flex-col gap-2">
        <TransitionGroup name="slide">
          <div
            v-for="reward of rewards"
            :key="reward.id"
            class="p-4 border border-default rounded-xl hover:bg-elevated hover:border-primary"
            @click="selectReward(reward.id)"
          >
            <div class="flex gap-4 items-center">
              <div class="flex items-center justify-center rounded-xl h-16 w-18 relative shrink-0" :style="{ backgroundColor: reward.color }">
                <Icon name="custom:points" size="1.4rem" />
                <span class="text-xs bg-default/80 absolute bottom-1 px-2 rounded-xl">{{ formatNumber(reward.cost) }}</span>
              </div>
              <div>
                <h3 class="text-lg font-semibold">{{ reward.title }}</h3>
                <p class="text-muted text-sm">{{ reward.description }}</p>
              </div>
              <UButton
                icon="lucide:trash"
                variant="outline"
                color="error"
                size="sm"
                class="ms-auto"
                :loading="loading.deletions[reward.id]"
                :disabled="isSpinning"
                @click.stop="deleteReward(reward)"
              />
            </div>
          </div>
        </TransitionGroup>
        <div v-if="!isCreate" class="p-4 border-2 border-dashed border-default rounded-xl text-center cursor-pointer hover:bg-elevated hover:border-primary group" @click="isCreate = true">
          <UButton
            icon="lucide:plus"
            variant="outline"
            color="primary"
            class="mb-2 group-hover:scale-[1.1] transition-transform group-hover:bg-primary/10"
          />
          <p>Crear recompensa</p>
        </div>
        <form v-else class="border-2 border-dashed border-default rounded-xl p-4 flex flex-col gap-3" @submit.prevent="createReward">
          <h3 class="font-semibold">Crear recompensa</h3>
          <UFormField label="Título" required>
            <UInput v-model="form.title" placeholder="Título" class="w-full" required />
          </UFormField>
          <UFormField label="Descripción">
            <UInput v-model="form.description" placeholder="Descripción" class="w-full" />
          </UFormField>
          <div class="flex gap-2 items-center">
            <UFormField label="Precio" required>
              <UInputNumber
                v-model="form.cost"
                :min="1"
                placeholder="Precio"
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
                <span class="block size-9 rounded-xl border border-default" :style="{ backgroundColor: form.color }" />
                <input v-model="form.color" type="color" class="sr-only">
              </label>
            </UFormField>
          </div>
          <div class="grid md:grid-cols-2 gap-2">
            <UButton type="button" label="Cancelar" variant="subtle" color="error" block @click="isCreate = false" />
            <UButton type="submit" label="Crear" variant="subtle" :loading="loading.create" block />
          </div>
        </form>
      </div>
    </template>
  </UModal>
</template>
