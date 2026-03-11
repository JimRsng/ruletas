<template>
  <div>
    <NuxtLoadingIndicator :throttle="0" />
    <UApp :toaster="{ duration: 2000 }">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </UApp>
  </div>
</template>
