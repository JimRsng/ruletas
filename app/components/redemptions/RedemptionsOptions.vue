<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";

const { user: broadcaster } = useUserSession();

const props = defineProps<{
  redemption: RuletasRedemption;
}>();

const { selected } = storeToRefs(useRewardsStore());
const redemptionsStore = useRedemptionsStore();

const loading = ref({
  complete: false,
  completeAll: false,
  reject: false,
  rejectAll: false
});

const completeRedemption = async (action: "current" | "all") => {
  if (!selected.value?.id) return;
  if (action === "current") {
    // Complete current redemption
    loading.value.complete = true;
    redemptionsStore.complete(selected.value.id, props.redemption.id).catch(() => {}).finally(() => {
      loading.value.complete = false;
    });
  }
  else if (action === "all") {
    // Complete all user's redemptions
    loading.value.completeAll = true;
    redemptionsStore.completeAll(selected.value.id, props.redemption.user.id).catch(() => {}).finally(() => {
      loading.value.completeAll = false;
    });
  }
};

const rejectRedemption = async (action: "current" | "all") => {
  if (!selected.value?.id) return;
  if (action === "current") {
    // Reject current redemption
    loading.value.reject = true;
    redemptionsStore.reject(selected.value.id, props.redemption.id).catch(() => {}).finally(() => {
      loading.value.reject = false;
    });
  }
  else if (action === "all") {
    // Reject all user's redemptions
    loading.value.rejectAll = true;
    redemptionsStore.rejectAll(selected.value.id, props.redemption.user.id).catch(() => {}).finally(() => {
      loading.value.rejectAll = false;
    });
  }
};

const options = computed<DropdownMenuItem[][]>(() => [
  [
    {
      label: "Ver usuario",
      icon: "lucide:user",
      color: "neutral",
      to: `https://twitch.tv/popout/${broadcaster.value?.login}/viewercard/${props.redemption.user.login}`,
      target: "_blank"
    }
  ],
  [
    {
      label: "Completar",
      icon: "lucide:check",
      color: "success",
      onSelect: async (e) => {
        e.preventDefault();
        await completeRedemption("current");
      },
      loading: loading.value.complete,
      disabled: loading.value.complete
    },
    {
      label: "Completar todas",
      icon: "lucide:user-check",
      color: "success",
      onSelect: async (e) => {
        e.preventDefault();
        await completeRedemption("all");
      },
      loading: loading.value.completeAll,
      disabled: loading.value.completeAll
    }
  ],
  [
    {
      label: "Reembolsar",
      icon: "lucide:x",
      color: "error",
      onSelect: async (e) => {
        e.preventDefault();
        await rejectRedemption("current");
      },
      loading: loading.value.reject,
      disabled: loading.value.reject
    },
    {
      label: "Reembolsar todas",
      icon: "lucide:user-x",
      color: "error",
      onSelect: async (e) => {
        e.preventDefault();
        await rejectRedemption("all");
      },
      loading: loading.value.rejectAll,
      disabled: loading.value.rejectAll
    }
  ]
]);
</script>

<template>
  <UDropdownMenu :items="options" :modal="false" arrow>
    <UButton
      icon="tabler:dots-vertical"
      variant="outline"
      color="neutral"
      size="sm"
      class="rounded-full"
      @click.stop
    />
  </UDropdownMenu>
</template>
