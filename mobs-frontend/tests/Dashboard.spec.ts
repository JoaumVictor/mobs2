// tests/Dashboard.spec.ts
import { mount } from "@vue/test-utils";
import Dashboard from "../src/views/DashboardView.vue";
import { useSidebarStore } from "../src/stores/useSidebarStore";
import { createPinia, setActivePinia } from "pinia";

vi.mock("../src/stores/useSidebarStore", () => ({
  useSidebarStore: () => ({
    allReady: true,
    loadingMessage: "",
    verifyApis: vi.fn(),
    fetchVehicles: vi.fn(),
  }),
}));

describe("Dashboard.vue", () => {
  beforeEach(() => {
    const pinia = createPinia();
    setActivePinia(pinia);
  });

  it("renders GoogleMap when ready", () => {
    const wrapper = mount(Dashboard, {
      global: {
        plugins: [createPinia()],
      },
    });
    expect(wrapper.findComponent({ name: "GoogleMap" }).exists()).toBe(true);
  });
});
