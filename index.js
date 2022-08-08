const { client, xml } = require("@xmpp/client");
const debug = require("@xmpp/debug");
const xmpp = client({
  service: "alumchat.fun",
  username: 'ivanh96',
  password: '123',
});
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

debug(xmpp, true);

xmpp.on("error", (err) => {
  console.error(err);
});

xmpp.on("offline", () => {
  console.log("offline");
});

// xmpp.on("stanza", async (stanza) => {
//   if (stanza.is("message")) {
//     await xmpp.send(xml("presence", { type: "unavailable" }));
//     await xmpp.stop();
//   }
// });

// xmpp.on("online", async (address) => {
//   // Makes itself available
//   await xmpp.send(xml("presence"));

//   // Sends a chat message to itself
//   const message = xml(
//     "message",
//     { type: "chat", to: address },
//     xml("body", {}, "hello world")
//   );
//   await xmpp.send(message);
// });

// xmpp.on("online", async (address) => {
//   await xmpp.send(
//     xml(
//       "iq",
//       { type: "set", id: "reg2" },
//       xml(
//         "query",
//         { xmlns: "jabber:iq:register" },
//         xml("username", {}, "ivanh"),
//         xml("password", {}, "123")
//       )
//     )
//   );
// });
// xmpp.send(
//     xml("iq",{ type: "get", id: "reg1", to: "alumchat.fun" },
//       xml("query", { xmlns: "jabber:iq:register" })
//     )
//   );
xmpp.start().catch(console.error);
