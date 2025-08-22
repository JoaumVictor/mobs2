import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { getVehicles } from "../src/services/vehicleService";

describe("VehicleService", () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.restore();
  });

  it("fetches vehicles", async () => {
    const vehicles = [{ id: 1, placa: "ABC-1234", modelo: "Fusca" }];
    mock.onGet("/vehicles").reply(200, vehicles);

    const result = await getVehicles();
    expect(result).toEqual(vehicles);
  }, 10000);
});
