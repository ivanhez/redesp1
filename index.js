const { client, xml } = require("@xmpp/client");
const setupRoster = require("@xmpp-plugins/roster");
const debug = require("@xmpp/debug");

const xmpp = client({
  service: "alumchat.fun",
  username: "mihc",
  password: "1234",
});
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

debug(xmpp, true);

xmpp.on("error", (err) => {
  console.error(err);
});

// xmpp.on("offline", () => {
//   console.log("offline");
// });

// xmpp.on("stanza", async (stanza) => {
//   if (stanza.is("iq")) {
//     // console.log(stanza.toString());
//     console.log(stanza.attrs.type);
//   }
// });

xmpp.on("online", async (address) => {
  // Makes itself available
  // await xmpp.send(xml("presence"));

  

  //   await xmpp.send(
  //   xml(
  //     "iq",
  //     { from: address, type: "set" },
  //     xml(
  //       "query",
  //       { xmlns: "jabber:iq:roster" },
  //       xml("item", { jid: "ivanh@alumchat.fun", name: "ivanh" })
  //     )
  //   )
  // );

  // // Requests roster
  // await xmpp.send(
  //   xml("iq", {to:'search.alumchat.fun', type: "get" }, xml("query", { xmlns: "jabber:iq:roster" }))
  // );

  // const roster = await xmpp.iqCaller.get(xml("query", "jabber:iq:roster"));
  // console.log(roster.getChildren("item", "jabber:iq:roster"));

  // const message = xml(
  //   "message",
  //   { type: "chat", to: 'ivanh@alumchat.fun' },
  //   xml("body", {}, "hello friend")
  // );
  // await xmpp.send(message);

  // const pres = xml(
  //   "presence",
  //   { from: address },
  //   xml("show", {}, "away"),
  //   xml("status", {}, "AFK"),
  //   xml("priority", {}, "5")
  // );
  // await xmpp.send(pres);

  await xmpp.send(
    xml(
      "iq",
      { type: "get", from: address, to: 'alumchat.fun', id: "items1" },
      xml(
        "query",
        { xmlns: 'http://jabber.org/protocol/disco#items' }
      )
    )
  );

  // await xmpp.send(
  //   xml(
  //     "iq",
  //     { type: "get", to: 'ivanh@alumchat.fun' },
  //     xml(
  //       "query",
  //       { xmlns: 'http://jabber.org/protocol/disco#info' }
  //     )
  //   )
  // );

//   await xmpp.send(
//     xml(
//       "iq",
//       { from: address, id: "rs1", type: "set" },
//       xml(
//         "query",
//         { xmlns: "jabber:iq:roster" },
//         xml("item", { jid: "ivanh@alumchat.fun" })
//       )
//     )
//   );
});

// xmpp.on("online", async (address) => {
//   await xmpp.send(
//     xml(
//       "iq",
//       { type: "set", id: "unreg1" },
//       xml(
//         "query",
//         { xmlns: "jabber:iq:register" },
//         xml("remove")
//       )
//     )
//   );
// });

// xmpp.on("online", async (address) => {
//   await xmpp.send(
//     xml(
//       "iq",
//       { type: "set", id: "reg2" },
//       xml(
//         "query",
//         { xmlns: "jabber:iq:register" },
//         xml("username", {}, "mihc"),
//         xml("password", {}, "1234")
//       )
//     )
//   );
// });

xmpp.start().catch(console.error);
