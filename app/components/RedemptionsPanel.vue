<script setup lang="ts">
const redemptionsStore = useRedemptionsStore();
const { redemptions } = storeToRefs(redemptionsStore);
const { selected } = storeToRefs(useRewardsStore());
const { settings, isSpinning } = storeToRefs(useWheelStore());

const loading = reactive({
  rejections: {} as Record<string, boolean>,
  rejectAll: false,
  completeAll: false
});

const rejectRedemption = (redemptionId: string) => {
  if (!selected.value?.id) return;
  loading.rejections[redemptionId] = true;
  redemptionsStore.reject(selected.value.id, redemptionId).finally(() => {
    loading.rejections[redemptionId] = false;
  });
};

const rejectAllRedemptions = () => {
  if (!selected.value?.id) return;
  loading.rejectAll = true;
  redemptionsStore.rejectAll(selected.value.id).finally(() => {
    loading.rejectAll = false;
  });
};

const completeAllRedemptions = () => {
  if (!selected.value?.id) return;
  loading.completeAll = true;
  redemptionsStore.completeAll(selected.value.id).finally(() => {
    loading.completeAll = false;
  });
};
</script>

<template>
  <!-- Entries List -->
  <div class="space-y-2">
    <div class="flex items-center gap-1">
      <UIcon name="custom:points" size="1.3rem" />
      <h3 class="text-sm font-semibold">Entradas (<span class="text-primary">{{ redemptions.length }}</span>)</h3>
    </div>
    <ul class="bg-default h-100 overflow-y-auto rounded-xl border-2 border-accented">
      <li
        v-for="(redemption, i) of redemptions"
        :key="redemption.id"
        class="px-3 py-2"
        :class="{ 'bg-elevated': i % 2 !== 0 }"
      >
        <div class="flex items-center gap-2">
          <UserDisplay
            :variant="'basic'"
            :user="{
              id: redemption.user.id,
              name: redemption.user.name,
              description: redemption.input,
              login: redemption.user.login,
              subscription: redemption.user.subscription,
            }"
          />
          <UButton
            icon="lucide:x"
            variant="outline"
            color="error"
            size="xs"
            class="ms-auto"
            :loading="loading.rejections[redemption.id]"
            @click="rejectRedemption(redemption.id)"
          />
        </div>
      </li>
    </ul>
  </div>

  <!-- Actions -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-2">
    <UButton
      label="Canjear todo"
      :class="{ 'animate-on-hover': !isSpinning && redemptions.length }"
      color="neutral"
      icon="lucide:check"
      block
      :loading="loading.completeAll"
      :disabled="isSpinning || !redemptions.length"
      @click="completeAllRedemptions"
    />
    <UButton
      label="Reembolsar todo"
      :class="{ 'animate-on-hover': !isSpinning && redemptions.length }"
      color="error"
      icon="lucide:x"
      block
      :loading="loading.rejectAll"
      :disabled="isSpinning || !redemptions.length"
      @click="rejectAllRedemptions"
    />
  </div>

  <!-- Settings -->
  <div class="space-y-2">
    <div>
      <div class="flex items-center gap-1">
        <UIcon name="lucide:settings" size="1.3rem" />
        <h3 class="text-sm font-semibold">Configuración</h3>
      </div>
      <p class="text-xs text-muted">Ajustes aplicados a los participantes de la ruleta</p>
    </div>
    <USwitch
      v-model="settings.disallowDuplicates"
      label="Sin participantes duplicados"
      :disabled="isSpinning"
    />
    <USwitch
      v-model="settings.weighted"
      label="Entradas ponderadas"
      :disabled="isSpinning"
    />
    <USwitch
      v-model="settings.subscribersOnly"
      label="Solo suscriptores"
      :disabled="isSpinning"
    />
    <UCheckboxGroup
      v-model="settings.subscriberTiers"
      orientation="horizontal"
      color="secondary"
      :items="['Tier 1', 'Tier 2', 'Tier 3']"
      class="ms-4"
      :ui="{
        indicator: !settings.subscribersOnly ? 'bg-accented' : '',
      }"
      :disabled="!settings.subscribersOnly || isSpinning"
    />
  </div>
</template>
