import axios from "axios";

async function findServer() {
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
  const requests = servers.map(async (server) => {
    try {
      const resp = await axios.get(server.url);
      return [server.url, server.priority, resp];
    } catch (err) {
      return null;
    }
  });
  const responses = await Promise.all(requests);
  const onlySuccesses = responses.filter((resp): resp is any[] =>
    Array.isArray(resp)
  );
  const finalAnswer = onlySuccesses.sort((a, b) => a[1] - b[1])[0];
  return finalAnswer;
}

findServer().then((resp) => console.log(resp));
