import axios, { AxiosResponse } from "axios";

const servers = [
  {
    url: "https://does-not-work.perfume.new",
    priority: 1,
  },
  {
    url: "https://gitlab.com",
    priority: 4,
  },
  {
    url: "http://app.scnt.me",
    priority: 3,
  },
  {
    url: "https://offline.scentronix.com",
    priority: 2,
  },
];

export type Server = {
  url: string;
  priority: number;
};

export type SuccessfulResponse = [string, number, AxiosResponse<any, any>];

class FindServer {
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

  filterSuccessfulRequest() {
    this.successfulResponses = this.responses.filter(
      (resp): resp is SuccessfulResponse => Array.isArray(resp)
    );
  }

  sortRequests() {
    this.sortedResponses = this.successfulResponses.sort((a, b) => a[1] - b[1]);
  }

  async run() {
    this.mapRequest();
    await this.sendRequest();
    this.filterSuccessfulRequest();
    this.sortRequests();
    return this.sortedResponses[0];
  }
}

const findServer = new FindServer(servers);
findServer.run().then((resp) => console.log(resp));
