export default defineAppConfig({
  ui: {
    button: {
      slots: {
        base: "rounded-full cursor-pointer"
      }
    },
    dropdownMenu: {
      slots: {
        itemLabel: "cursor-pointer"
      }
    }
  }
});
