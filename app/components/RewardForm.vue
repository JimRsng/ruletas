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
}>({ required: true });

const emit = defineEmits<{
  submit: [event: SubmitEvent];
  cancel: [];
}>();

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
        <UPopover>
          <UButton color="neutral" variant="outline" class="rounded-lg">
            <template #leading>
              <span :style="{ backgroundColor: form.color }" class="h-5 w-12 rounded-md" />
            </template>
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
    </div>
    <UButton type="submit" :label="submitLabel" variant="subtle" :loading="loading" block />
  </form>
</template>
