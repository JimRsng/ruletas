<script setup lang="ts">
defineProps<{
  title: string;
  submitLabel: string;
  loading?: boolean;
  cancellable?: boolean;
}>();

const form = defineModel<{
  title: string;
  description?: string;
  cost: number;
  color: string;
  input: boolean;
}>({ required: true });

const emit = defineEmits<{
  submit: [event: SubmitEvent];
  cancel: [];
}>();

const maxLength = {
  title: 45,
  description: 200
};

const colorRef = computed(() => form.value.color);
</script>

<template>
  <form class="border-2 border-dashed border-default rounded-xl p-4 flex flex-col gap-3 relative" @submit.prevent="emit('submit', $event)">
    <h3 class="font-semibold">{{ title }}</h3>
    <UButton
      v-if="cancellable"
      class="absolute top-4 inset-e-4"
      icon="lucide:x"
      type="button"
      variant="outline"
      color="neutral"
      size="sm"
      @click="emit('cancel')"
    />
    <UFormField label="Título" required>
      <UInput v-model.trim="form.title" placeholder="Título" class="w-full" :maxlength="maxLength.title" required />
      <template #hint>
        <div class="text-xs text-muted tabular-nums pointer-events-none" aria-live="polite" role="status">
          {{ form.title?.length }}/{{ maxLength.title }}
        </div>
      </template>
    </UFormField>
    <UFormField label="Descripción">
      <UTextarea v-model.trim="form.description" placeholder="Descripción" class="w-full" :maxlength="maxLength.description" />
      <template #hint>
        <div class="text-xs text-muted tabular-nums pointer-events-none" aria-live="polite" role="status">
          {{ form.description?.length }}/{{ maxLength.description }}
        </div>
      </template>
    </UFormField>
    <div class="flex gap-4 items-center">
      <UFormField label="Precio" required>
        <UInputNumber
          v-model="form.cost"
          :min="1"
          placeholder="Precio"
          class="flex-1 max-w-35"
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
        <UPopover>
          <UButton color="neutral" variant="outline" :style="{ backgroundColor: form.color }" class="overflow-hidden rounded-lg px-0">
            <div class="h-5 w-12" />
          </UButton>

          <template #content>
            <div class="p-2">
              <UColorPicker v-model="form.color" default-value="#000000" />
              <UInput
                :value="colorRef"
                placeholder="Color hex"
                class="mt-2 w-full"
                @change="form.color = ($event.target as HTMLInputElement).value"
              />
            </div>
          </template>
        </UPopover>
      </UFormField>
      <UFormField label="Requiere texto">
        <USwitch v-model="form.input" class="py-1.5" />
      </UFormField>
    </div>
    <UButton type="submit" :label="submitLabel" variant="subtle" :loading="loading" block />
  </form>
</template>
