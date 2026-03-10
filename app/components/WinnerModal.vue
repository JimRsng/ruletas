<script setup lang="ts">
const open = defineModel<boolean>("open");

const { user } = useUserSession();

const { winner } = storeToRefs(useWheelStore());
</script>

<template>
  <UModal
    v-model:open="open"
    title="Ganador"
    description="Modal del ganador"
  >
    <template #content>
      <div class="text-center p-6 relative space-y-4">
        <UButton
          icon="lucide:x"
          variant="outline"
          color="neutral"
          class="absolute inset-e-2 top-2"
          size="sm"
          @click="open = false"
        />
        <p class="uppercase tracking-widest text-primary">Ganador</p>
        <div>
          <NuxtLink
            :to="`https://www.twitch.tv/popout/${user?.login}/viewercard/${winner?.user.login}`"
            target="_blank"
            class="text-5xl hover:underline font-bold"
          >
            {{ winner?.user.name }}
          </NuxtLink>
          <p v-if="winner?.inputs.length" class="text-sm text-muted">{{ winner?.inputs.join(", ") }}</p>
        </div>
      </div>
    </template>
  </UModal>
</template>
