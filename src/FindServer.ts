import axios, { AxiosResponse } from "axios";

export type Server = {
  url: string;
  priority: number;
};

export type SuccessfulResponse = [string, number, AxiosResponse<any, any>];

export class FindServer {
  servers: Server[];
  requests: Promise<SuccessfulResponse>[];
  responses: (SuccessfulResponse | null)[];
  successfulResponses: SuccessfulResponse[];
  sortedResponses: SuccessfulResponse[];

  constructor(servers: Server[]) {
    this.servers = servers;
  }

  mapRequest() {
    this.requests = this.servers.map(
      async (server): Promise<SuccessfulResponse | null> => {
        try {
          const resp = await axios.get(server.url, { timeout: 5000 });
          return [server.url, server.priority, resp];
        } catch (err) {
          return null;
        }
      }
    );
  }

  async sendRequest() {
    this.responses = await Promise.all(this.requests);
  }

  filterSuccessfulResponse() {
    this.successfulResponses = this.responses.filter(
      (resp): resp is SuccessfulResponse => Array.isArray(resp)
    );
  }

  sortResponses() {
    this.sortedResponses = this.successfulResponses.sort((a, b) => a[1] - b[1]);
  }

  async run() {
    this.mapRequest();
    await this.sendRequest();
    this.filterSuccessfulResponse();
    this.sortResponses();
    return this.sortedResponses[0];
  }
}
