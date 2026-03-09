<template>
  <div>
    <NuxtLoadingIndicator :throttle="0" />
    <UTheme :ui="{
      button: { base: 'rounded-full cursor-pointer' },
    }"
    >
      <UApp :toaster="{ duration: 2000 }">
        <NuxtLayout>
          <NuxtPage />
        </NuxtLayout>
      </UApp>
    </UTheme>
  </div>
</template>
