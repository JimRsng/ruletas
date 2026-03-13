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
    },
    popover: {
      slots: {
        content: "py-2 px-3 text-sm max-w-sm"
      }
    }
  }
});
