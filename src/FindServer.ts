import axios, { AxiosResponse } from "axios";

export type Server = {
  url: string;
  priority: number;
};

export type SuccessfulResponse = [string, number, AxiosResponse<any, any>];

export const mapRequest = (servers: Server[]) => {
  return servers.map(async (server): Promise<SuccessfulResponse | null> => {
    try {
      const resp = await axios.get(server.url, { timeout: 5000 });
      return [server.url, server.priority, resp];
    } catch (err) {
      return null;
    }
  });
};

export const filterSuccessfulResponses = (
  responses: (SuccessfulResponse | null)[]
) => {
  return responses.filter((resp): resp is SuccessfulResponse =>
    Array.isArray(resp)
  );
};

export const sortResponses = (successfulResponses: SuccessfulResponse[]) => {
  return successfulResponses.sort((a, b) => a[1] - b[1]);
};

export const FindServer = async (servers: Server[]) => {
  const mappedReq = mapRequest(servers);
  const responses = await Promise.all(mappedReq);
  const filteredResp = filterSuccessfulResponses(responses);
  const sortedResp = sortResponses(filteredResp);
  return sortedResp[0];
};
