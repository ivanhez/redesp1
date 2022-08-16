// const { client, xml } = require("@xmpp/client");
// const setupRoster = require("@xmpp-plugins/roster");
// const debug = require("@xmpp/debug");

// const xmpp = client({
//   service: "alumchat.fun",
//   username: "ivanh",
//   password: "123",
// });
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

// debug(xmpp, true);

// xmpp.on("error", (err) => {
//   console.error(err);
// });

// // xmpp.on("offline", () => {
// //   console.log("offline");
// // });

// // xmpp.on("stanza", async (stanza) => {
// //   if (stanza.is("iq")) {
// //     // console.log(stanza.toString());
// //     console.log(stanza.attrs.type);
// //   }
// // });

// const roster = setupRoster(xmpp);

// xmpp.on("online", async (address) => {
//   roster.on("set", ({ item, version }) => {
//     console.log(item);
//     console.log(version);
//   });

//   // roster.set({ jid: "gabs@alumchat.fun" }).then(() => {
//   //   console.log("success");
//   // });

//   // roster.remove("gabs@alumchat.fun").then(() => {
//   //   console.log("success");
//   // });

//   xmpp.send(
//     xml(
//       "iq",
//       {from: address, id: "rs1", type: "set" },
//       xml(
//         "query",
//         { xmlns: "jabber:iq:roster" },
//         xml("item", { jid: "gabs@alumchat.fun", subscription : "both"})
//       )
//     )
//   );

//   // xmpp.send(
//   //   xml(
//   //     "iq",
//   //     { to: froms, type: "set" },
//   //     xml(
//   //       "query",
//   //       { xmlns: "jabber:iq:roster" },
//   //       xml("item", { jid: contact + "@alumchat.fun", name: contact })
//   //     )
//   //   )
//   // ).then(() => {
//   //   console.log("\t\t\t\tSUCCESSFULLY ADDED CONTACT : " + contact);
//   // }).catch(console.error);
//   // await roster.set({jid: 'gabs@alumchat.fun'}).then(() => {
//   //   console.log('success')
//   // })

//   roster.get().then((roster) => {
//     if (!roster) {
//       // the roster hasn't changed since last version
//       return;
//     }
//     console.log(roster.items);
//   });

//   // Makes itself available
//   // await xmpp.send(xml("presence"));

//   // const roster = await xmpp.iqCaller.get(xml('query', 'jabber:iq:roster'));
//   // console.log(roster.getChildren('item',  'jabber:iq:roster'));

//   //   await xmpp.send(
//   //   xml(
//   //     "iq",
//   //     {type: "set" },
//   //     xml(
//   //       "enable",
//   //       { xmlns: "urn:xmpp:push:0" , jid: "pubsub.alumchat.fun", node: address.resource },
//   //     )
//   //   )
//   // );

//   //   await xmpp.send(
//   //   xml(
//   //     "iq",
//   //     { from: address.local+"@"+address.domain, type: "set", id: "rs1" },
//   //     xml(
//   //       "query",
//   //       { xmlns: "jabber:iq:roster" },
//   //       xml("item", { jid: "mihc@alumchat.fun"})
//   //     )
//   //   )
//   // );

//   // // Requests roster
//   // await xmpp.send(
//   //   xml("iq", {to:'search.alumchat.fun', type: "get" }, xml("query", { xmlns: "jabber:iq:roster" }))
//   // );

//   // const roster = await xmpp.iqCaller.get(xml("query", "jabber:iq:roster"));
//   // console.log(roster.getChildren("item", "jabber:iq:roster"));

//   // const message = xml(
//   //   "message",
//   //   { type: "chat", to: 'ivanh@alumchat.fun' },
//   //   xml("body", {}, "hello friend")
//   // );
//   // await xmpp.send(message);

//   // const pres = xml(
//   //   "presence",
//   //   { from: address },
//   //   xml("show", {}, "away"),
//   //   xml("status", {}, "AFK"),
//   //   xml("priority", {}, "5")
//   // );
//   // await xmpp.send(pres);

//   // await xmpp.send(
//   //   xml(
//   //     "iq",
//   //     { type: "get", from: address, to: 'pubsub.alumchat.fun', id: "items1" },
//   //     xml(
//   //       "query",
//   //       { xmlns: 'http://jabber.org/protocol/disco#items' }
//   //     )
//   //   )
//   // );

//   // await xmpp.send(
//   //   xml(
//   //     "iq",
//   //     { type: "get", to: 'ivanh@alumchat.fun' },
//   //     xml(
//   //       "query",
//   //       { xmlns: 'http://jabber.org/protocol/disco#info' }
//   //     )
//   //   )
//   // );

//   //   await xmpp.send(
//   //     xml(
//   //       "iq",
//   //       { from: address, id: "rs1", type: "set" },
//   //       xml(
//   //         "query",
//   //         { xmlns: "jabber:iq:roster" },
//   //         xml("item", { jid: "ivanh@alumchat.fun" })
//   //       )
//   //     )
//   //   );
// });

// // xmpp.on("online", async (address) => {
// //   await xmpp.send(
// //     xml(
// //       "iq",
// //       { type: "set", id: "unreg1" },
// //       xml(
// //         "query",
// //         { xmlns: "jabber:iq:register" },
// //         xml("remove")
// //       )
// //     )
// //   );
// // });

// // xmpp.on("online", async (address) => {
// //   await xmpp.send(
// //     xml(
// //       "iq",
// //       { type: "set", id: "reg2" },
// //       xml(
// //         "query",
// //         { xmlns: "jabber:iq:register" },
// //         xml("username", {}, "mihc"),
// //         xml("password", {}, "1234")
// //       )
// //     )
// //   );
// // });

// xmpp.start().catch(console.error);

// // menu(
// //   [
// //     { hotkey: "1", title: "ENABLE" },
// //     { hotkey: "2", title: "DISABLE" },
// //     { hotkey: "3", title: "SEND" },
// //     { hotkey: "4", title: "EXIT" },
// //   ],
// //   {
// //     header: "NOTIFICATIONS",
// //     border: true,
// //   }
// // ).then((item) => {
// //   if (item) {
// //     switch (parseInt(item.hotkey)) {
// //       case 1:
// //         xmpp.send(
// //           xml(
// //             "iq",
// //             { type: "set" },
// //             xml("enable", {
// //               xmlns: "urn:xmpp:push:0",
// //               jid: "pubsub.alumchat.fun",
// //               node: address.resource,
// //             })
// //           )
// //         );
// //         xmpp.on("stanza", async (stanza) => {
// //           if (stanza.is("iq")) {
// //             if (stanza.attr.type == "result") {
// //               console.log("\t\t\tENABLED SUCCESSFULLY");
// //               await nmenu(xmpp, froms, address);
// //             }
// //             if (stanza.attr.type == "error") {
// //               console.log("\t\t\tERROR IN ENABLING NOTIFICATIONS");
// //             }
// //           }
// //         });
// //       case 2:
// //         xmpp.send(
// //           xml(
// //             "iq",
// //             { type: "set" },
// //             xml("disable", {
// //               xmlns: "urn:xmpp:push:0",
// //               jid: "pubsub.alumchat.fun",
// //               node: address.resource,
// //             })
// //           )
// //         );
// //         xmpp.on("stanza", async (stanza) => {
// //           if (stanza.is("iq")) {
// //             if (stanza.attr.type == "result") {
// //               console.log("\t\t\tDISABLED SUCCESSFULLY");
// //             }
// //             if (stanza.attr.type == "error") {
// //               console.log("\t\t\tERROR IN DISABLING NOTIFICATIONS");
// //             }
// //           }
// //         });
// //     }
// //   }
// // });

const { client, xml } = require("@xmpp/client");
const setupRoster = require("@xmpp-plugins/roster");
const debug = require("@xmpp/debug");

const xmpp = client({
  service: "alumchat.fun",
  username: "ivanh",
  password: "123",
});
const roster = setupRoster(xmpp);
debug(xmpp, true);
xmpp.on("online", async () => {
  roster.get().then((roster) => {
    if (!roster) {
      // the roster hasn't changed since last version
      return;
    }

    console.log(roster);
  });


  roster.set({jid: 'gabs@alumchat.fun', name: 'gabs'}).then(() => {
    console.log('success')
  })
  
});

xmpp.start().catch(console.error);
