export default defineAppConfig({
  ui: {
    button: {
      slots: {
        base: "rounded-lg cursor-pointer"
      }
    },
    tabs: {
      slots: {
        trigger: "rounded-xl border border-accented hover:data-[state=inactive]:bg-accented data-[state=active]:bg-secondary data-[state=active]:border-secondary cursor-pointer animate-on-hover"
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
