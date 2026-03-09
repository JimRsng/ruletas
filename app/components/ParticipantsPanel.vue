<script setup lang="ts">
const toast = useToast();

const { selected } = storeToRefs(useRewardsStore());
const { redemptions, deduplicated } = storeToRefs(useRedemptionsStore());
const { settings, isSpinning, winner } = storeToRefs(useWheelStore());

const emits = defineEmits<{
  winner: [name: string];
}>();

const participants = computed(() => {
  const entries = settings.value.disallowDuplicates ? deduplicated.value : redemptions.value;

  return entries.filter((e) => {
    if (settings.value.subscribersOnly) {
      if (!e.user.subscription) return false;
      const requiredTiers = settings.value.subscriberTiers.map(t => t.replace("Tier ", ""));
      const tier = e.user.subscription.tier.replace("000", "");
      return requiredTiers.includes(tier);
    }

    return true;
  }).map(e => e.user.name);
});

const canSpingGuard = () => {
  if (selected.value?.active) {
    toast.add({ description: "Desactiva la recompensa para poder girar la ruleta", color: "error" });
  }

  return !isSpinning.value && redemptions.value.length >= 2 && !selected.value?.active;
};
</script>

<template>
  <div class="flex items-center gap-1">
    <UIcon name="simple-icons:twitch" size="1.3rem" />
    <h3 class="text-sm font-semibold">Participantes (<span class="text-primary">{{ participants.length }}</span>)</h3>
  </div>

  <SpinWheel
    ref="wheelRef"
    v-model="winner"
    v-model:spinning="isSpinning"
    :entries="participants"
    :palette="settings.palette"
    :idle-spin="true"
    :spin-guard="canSpingGuard"
    @select="emits('winner', $event)"
  />
</template>
