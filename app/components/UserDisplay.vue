<script setup lang="ts">
const props = defineProps<{
  variant: "basic" | "winner";
  user?: {
    id: string;
    description?: string;
    name: string;
    login: string;
    subscription?: {
      tier: string;
    } | null;
  };
}>();

const { user: broadcaster } = useUserSession();
const { winner } = storeToRefs(useWheelStore());

type UserAdditionalData = {
  image: string;
};

const data = ref<UserAdditionalData | null>(null);

if (props.variant === "winner") {
  const winnerId = computed(() => winner.value?.user.id);

  const fetchData = async (id: string) => {
    const cachedData = useCachedData<UserAdditionalData>(`user:${id}`);

    if (cachedData) {
      data.value = cachedData;
      return;
    }

    $fetch(`/api/user/${id}`).then((response) => {
      useCachedData(`user:${id}`, () => response);
      data.value = response;
    });
  };

  if (winnerId.value) {
    await fetchData(winnerId.value);
  }

  watch(winnerId, async (id) => {
    data.value = null;
    if (!id) return;
    await fetchData(id);
  });
}
</script>

<template>
  <div v-if="user && variant === 'basic'">
    <UUser :description="user.description" :ui="{ description: 'wrap-anywhere' }">
      <template #name>
        <div class="flex gap-2 items-center">
          <NuxtLink :to="`https://twitch.tv/popout/${broadcaster?.login}/viewercard/${user.login}`" target="_blank" class="hover:underline wrap-anywhere">
            {{ user.name }}
          </NuxtLink>
          <div v-if="user.subscription" :title="`Suscriptor Tier ${user.subscription.tier.replace('000', '')}`">
            <Icon
              name="lucide:star"
              :class="{
                'dark:text-purple-400 light:text-purple-500': user.subscription.tier === '1000',
                'dark:text-slate-400 light:text-slate-400': user.subscription.tier === '2000',
                'dark:text-amber-400 light:text-amber-400': user.subscription.tier === '3000',
              }"
            />
          </div>
        </div>
      </template>
    </UUser>
  </div>
  <div v-else-if="variant === 'winner' && winner && broadcaster">
    <UUser
      :avatar="{
        src: data?.image,
        loading: 'lazy',
        icon: 'simple-icons:twitch',
        ui: {
          root: 'bg-secondary',
          icon: 'text-inverted',
        },
      }"
      :description="winner.inputs.filter(Boolean).join(', ')"
      size="lg"
      :ui="{
        avatar: 'size-14',
        description: 'wrap-anywhere',
      }"
    >
      <template #name>
        <div class="flex gap-2 items-center">
          <NuxtLink :to="`https://twitch.tv/popout/${broadcaster.login}/viewercard/${winner.user.login}`" target="_blank" class="hover:underline wrap-anywhere">
            {{ winner.user.name }}
          </NuxtLink>
          <div v-if="winner.user.subscription" :title="`Suscriptor Tier ${winner.user.subscription.tier.replace('000', '')}`">
            <Icon
              name="lucide:star"
              :class="{
                'dark:text-purple-400 light:text-purple-500': winner.user.subscription.tier === '1000',
                'dark:text-slate-400 light:text-slate-400': winner.user.subscription.tier === '2000',
                'dark:text-amber-400 light:text-amber-400': winner.user.subscription.tier === '3000',
              }"
            />
          </div>
        </div>
      </template>
    </UUser>
  </div>
</template>
