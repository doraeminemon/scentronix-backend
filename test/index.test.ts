import { FindServer } from "../src/FindServer";

describe("FindServer", () => {
  test("can initiate with servers", () => {
    const server = new FindServer([]);
    console.log("hello");
    expect(server).not.toBeNull();
  });
});
