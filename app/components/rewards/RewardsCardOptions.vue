<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";

const props = defineProps<{
  reward: RuletasReward;
}>();

const rewardsStore = useRewardsStore();
const { selected } = storeToRefs(rewardsStore);
const redemptionsStore = useRedemptionsStore();
const wheelStore = useWheelStore();

const loading = ref({
  delete: false,
  edit: false
});

const isEditModalOpen = ref(false);

const { id: rewardId, ...editData } = props.reward;
const form = useFormState(editData);

const editReward = async () => {
  loading.value.edit = true;
  rewardsStore.edit(rewardId, form.value).then(() => {
    isEditModalOpen.value = false;
  }).catch(() => {}).finally(() => {
    loading.value.edit = false;
  });
};

const deleteReward = async () => {
  loading.value.delete = true;
  rewardsStore.remove(rewardId).then(() => {
    if (selected.value?.id === rewardId) {
      redemptionsStore.clearInterval();
      rewardsStore.clearSelected();
    }
    wheelStore.storage.remove(rewardId);
  }).catch(() => {}).finally(() => {
    loading.value.delete = false;
  });
};

const options = computed<DropdownMenuItem[]>(() => [
  {
    label: "Editar",
    icon: "lucide:pencil",
    color: "neutral",
    onSelect: () => isEditModalOpen.value = true
  },
  {
    label: "Eliminar",
    icon: "lucide:trash",
    color: "error",
    onSelect: async (e) => {
      e.preventDefault();
      await deleteReward();
    },
    loading: loading.value.delete,
    disabled: loading.value.delete
  }
]);

const updateForm = () => {
  const { id, ...data } = props.reward;
  form.value = data;
};

const emit = defineEmits<{
  dropdownOpen: [boolean];
}>();
</script>

<template>
  <div>
    <UDropdownMenu :items="options" :content="{ align: 'end', side: 'bottom', sideOffset: 8 }" :modal="false" arrow @update:open="emit('dropdownOpen', $event)">
      <UButton
        icon="tabler:dots-vertical"
        variant="outline"
        color="neutral"
        size="sm"
        @click.stop
      />
    </UDropdownMenu>
    <UModal
      v-model:open="isEditModalOpen"
      title="Editar recompensa"
      description="Modifica los detalles de la recompensa seleccionada"
      :close="{
        variant: 'outline',
        color: 'primary',
        class: 'rounded-full',
      }"
    >
      <template #body>
        <RewardsForm
          v-model="form"
          :title="'Editar recompensa'"
          :submit-label="'Guardar cambios'"
          :loading="loading.edit"
          @submit.prevent="editReward"
          @vue:unmounted="updateForm"
        />
      </template>
    </UModal>
  </div>
</template>
