import type { AxiosResponse } from "axios";
jest.mock("axios", () => {
  return {
    get: () => Promise.resolve(5),
  };
});
import {
  FindServer,
  _mapRequest,
  _sortResponses,
  _filterSuccessfulResponses,
  SuccessfulResponse,
} from "../src/FindServer";

const mockServers = [
  { url: "https://google.com", priority: 5 },
  { url: "https://example.com", priority: 4 },
  { url: "https://not-response.com", priority: 3 },
  { url: "https://response-with-400.com", priority: 2 },
];

describe("findServer", () => {
  test("#mapRequest", () => {
    const mappedReq = _mapRequest(mockServers);
    expect(mappedReq.length).toBe(4);
    expect(() => Promise.resolve(mappedReq[0])).not.toThrow();
  });

  test("#filterSuccessfulResponses", () => {
    const responses = [
      ["test", 2, {} as AxiosResponse] as SuccessfulResponse,
      null,
    ];
    const filteredResp = _filterSuccessfulResponses(responses);
    expect(filteredResp.length).toBe(1);
    expect(filteredResp[0][0]).toBe("test");
  });

  test("#sortResponses", () => {
    const successfulResponses: SuccessfulResponse[] = [
      ["test", 5, {} as AxiosResponse],
      ["test", 10, {} as AxiosResponse],
      ["test", 1, {} as AxiosResponse],
    ];
    const sortedResponses = _sortResponses(successfulResponses);
    expect(sortedResponses[0][1]).toBe(1);
    expect(sortedResponses[1][1]).toBe(5);
    expect(sortedResponses[2][1]).toBe(10);
  });

  test("#findServer", async () => {
    const result = await FindServer(mockServers);
    expect(result[0]).toBe("https://response-with-400.com");
  });
});
