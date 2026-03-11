<script setup lang="ts">
defineProps<{
  reward: RuletasReward;
}>();

const isHovered = ref(false);
const isDropdownOpen = ref(false);
const isActive = computed(() => isHovered.value || isDropdownOpen.value);
</script>

<template>
  <div
    class="p-4 border border-default rounded-xl cursor-pointer transition-all duration-160"
    :class="{ 'bg-elevated border-primary -translate-y-px shadow-[0_4px_1px_rgba(0,0,0,0.35)]': isActive }"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <div class="flex gap-4 items-center">
      <div class="flex items-center justify-center rounded-xl h-16 w-18 relative shrink-0" :style="{ backgroundColor: reward.color }">
        <Icon name="custom:points" size="1.4rem" class="text-neutral-200" />
        <span class="text-xs bg-default/80 absolute bottom-1 px-2 rounded-xl">{{ formatNumber(reward.cost) }}</span>
      </div>
      <div>
        <h3 class="text-lg font-semibold">{{ reward.title }}</h3>
        <p class="text-muted text-sm">{{ reward.description }}</p>
      </div>
      <RewardsCardOptions :reward="reward" class="ms-auto" @dropdown-open="isDropdownOpen = $event" />
    </div>
  </div>
</template>
