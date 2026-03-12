<script setup lang="ts">
const redemptionsStore = useRedemptionsStore();
const { redemptions } = storeToRefs(redemptionsStore);
const { selected } = storeToRefs(useRewardsStore());
const wheelStore = useWheelStore();
const { settings, isSpinning } = storeToRefs(wheelStore);

const loading = reactive({
  rejectAll: false,
  completeAll: false
});

const filters = ref({
  search: ""
});

const filteredRedemptions = computed(() => {
  return redemptions.value.filter(r => r.user.name.toLowerCase().includes(filters.value.search.toLowerCase()));
});

const rejectAllRedemptions = () => {
  if (!selected.value?.id) return;
  loading.rejectAll = true;
  redemptionsStore.rejectAll(selected.value.id).catch(() => {}).finally(() => {
    loading.rejectAll = false;
  });
};

const completeAllRedemptions = () => {
  if (!selected.value?.id) return;
  loading.completeAll = true;
  redemptionsStore.completeAll(selected.value.id).catch(() => {}).finally(() => {
    loading.completeAll = false;
  });
};

const isListening = computed(() => {
  return selected.value?.active && !selected.value.paused;
});

watch(settings, () => {
  if (!selected.value?.id) return;
  wheelStore.storage.save(selected.value.id);
}, { deep: true });

watch(selected, () => {
  if (!selected.value?.id) return;
  wheelStore.storage.restore(selected.value.id);
});
</script>

<template>
  <!-- Entries List -->
  <div class="space-y-2">
    <div class="flex items-center gap-1">
      <UIcon name="custom:points" size="1.3rem" />
      <h3 class="text-sm font-semibold">Entradas (<span class="text-primary">{{ redemptions.length }}</span>)</h3>
      <UPopover mode="hover" :content="{ side: 'top' }" arrow>
        <UButton variant="link" class="ms-auto p-0 cursor-help">
          <UChip
            :class="{ 'animate-pulse': isListening }"
            :color="selected ? isListening ? 'primary' : 'error' : 'neutral'"
            :ui="{
              base: 'drop-shadow-md ' + (selected ? isListening ? 'drop-shadow-primary/30' : 'drop-shadow-error/30' : 'bg-accented'),
            }"
            standalone
            inset
          />
        </UButton>
        <template #content>
          <div class="p-3 text-sm">
            <p v-if="!selected">No has seleccionado una recompensa</p>
            <p v-else-if="isListening">Esperando entradas...</p>
            <p v-else>La recompensa está pausada o inactiva</p>
          </div>
        </template>
      </UPopover>
    </div>
    <div class="bg-default h-100 overflow-y-auto rounded-xl border-2 border-accented relative">
      <UInput
        v-model="filters.search"
        icon="lucide:search"
        placeholder="Buscar..."
        class="w-full sticky top-0 right-0 left-0 z-1 shadow-md"
        variant="none"
        size="sm"
        :ui="{ base: 'bg-elevated focus:bg-accented hover:bg-accented rounded-none' }"
        :disabled="isSpinning || !selected"
      />
      <ul>
        <li
          v-for="(redemption, i) of filteredRedemptions"
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
            <RedemptionsOptions :redemption="redemption" class="ms-auto" />
          </div>
        </li>
      </ul>
    </div>
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
      v-model="settings.subscribersOnly"
      label="Solo suscriptores"
      :disabled="isSpinning"
    />
    <Transition name="fade" mode="out-in">
      <UCheckboxGroup
        v-if="settings.subscribersOnly"
        v-model="settings.subscriberTiers"
        orientation="horizontal"
        color="secondary"
        :items="[
          { label: 'Tier 1', value: '1' },
          { label: 'Tier 2', value: '2' },
          { label: 'Tier 3', value: '3' },
        ]"
        class="ms-11"
        :ui="{
          indicator: !settings.subscribersOnly ? 'bg-accented' : '',
        }"
        size="sm"
        :disabled="!settings.subscribersOnly || isSpinning"
      />
    </Transition>
    <USwitch
      v-model="settings.disallowDuplicates"
      label="Sin participantes duplicados"
      :disabled="isSpinning"
      @change="settings.weighted = !settings.disallowDuplicates && settings.weighted"
    />
    <USwitch
      v-model="settings.weighted"
      label="Entradas ponderadas"
      :disabled="isSpinning || settings.disallowDuplicates"
    />
  </div>
</template>
