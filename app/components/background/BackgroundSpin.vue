<template>
  <div
    class="fixed top-[50%] left-[50%] w-[150vmax] h-[150vmax] transform -translate-x-1/2 -translate-y-1/2 animate-spin [animation-duration:120s] -z-1"
    :style="{
      background: `conic-gradient(
          ${wheelPalette[0]}33 0deg 45deg,
          ${wheelPalette[1]}33 45deg 90deg,
          ${wheelPalette[2]}33 90deg 135deg,
          ${wheelPalette[3]}33 135deg 180deg,
          ${wheelPalette[4]}33 180deg 225deg,
          ${wheelPalette[5]}33 225deg 270deg,
          ${wheelPalette[6]}33 270deg 315deg,
          ${wheelPalette[7]}33 315deg 360deg
        )`.replace(/\s{2,}/g, ' '),
    }"
  />
</template>
