import { mount } from "@vue/test-utils";
import Sidebar from "../src/components/Sidebar.vue";
import { createPinia, setActivePinia } from "pinia";

describe("Sidebar.vue", () => {
  beforeEach(() => {
    const pinia = createPinia();
    setActivePinia(pinia);
  });

  it("renders search input", () => {
    const wrapper = mount(Sidebar, {
      props: {
        open: true,
        selectedPlate: null,
        showHistory: false,
      },
      global: {
        plugins: [createPinia()],
      },
    });
    expect(wrapper.find("input.search").exists()).toBe(true);
  });

  it("shows vehicles list", async () => {
    const wrapper = mount(Sidebar, {
      props: {
        open: true,
        selectedPlate: null,
        showHistory: false,
      },
    });

    await wrapper.setData({
      vehicles: [{ id: 1, placa: "ABC-1234", modelo: "Fusca" }],
    });

    expect(wrapper.text()).toContain("ABC-1234");
  });
});
