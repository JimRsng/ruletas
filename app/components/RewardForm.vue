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
        <label class="cursor-pointer" title="Color">
          <span class="block size-9 rounded-xl border border-default" :style="{ backgroundColor: form.color }" />
          <input v-model="form.color" type="color" class="sr-only">
        </label>
      </UFormField>
    </div>
    <UButton type="submit" :label="submitLabel" variant="subtle" :loading="loading" block />
  </form>
</template>
