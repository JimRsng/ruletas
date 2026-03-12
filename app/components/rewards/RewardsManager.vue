<script setup lang="ts">
const rewardsStore = useRewardsStore();
const redemptionsStore = useRedemptionsStore();
const { rewards } = storeToRefs(rewardsStore);

const isAdd = ref(false);
const isLoading = ref(false);

const emits = defineEmits<{
  select: [id: string];
}>();

const selectReward = (id: string) => {
  redemptionsStore.clear();
  rewardsStore.select(id);
  emits("select", id);
};

const form = useFormState({
  title: "",
  description: "",
  cost: 10000,
  color: "#000000",
  input: true
});

const createReward = async () => {
  isLoading.value = true;
  rewardsStore.create(form.value).then(() => {
    form.reset();
    isAdd.value = false;
  }).catch(() => {}).finally(() => {
    isLoading.value = false;
  });
};
</script>

<template>
  <TransitionGroup name="slide">
    <RewardsCard
      v-for="reward of rewards"
      :key="reward.id"
      :reward="reward"
      @click="selectReward(reward.id)"
    />
  </TransitionGroup>
  <div
    v-if="!isAdd"
    class="p-4 border-2 border-dashed border-default rounded-xl text-center cursor-pointer hover:bg-elevated hover:border-primary group scale-on-hover"
    @click="isAdd = true"
  >
    <UButton
      icon="lucide:plus"
      variant="outline"
      color="primary"
      class="mb-2 group-hover:scale-[1.1] transition-transform group-hover:bg-primary/10"
    />
    <p>Crear recompensa</p>
  </div>
  <RewardsForm
    v-else
    v-model="form"
    :title="'Crear recompensa'"
    :submit-label="'Crear'"
    :loading="isLoading"
    cancellable
    @cancel="isAdd = false"
    @submit.prevent="createReward"
  />
</template>
