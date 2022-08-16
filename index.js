process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
process.env["NODE_NO_WARNINGS"] = 1;
const { client, xml } = require("@xmpp/client");
const setupRoster = require("@xmpp-plugins/roster");
const debug = require("@xmpp/debug");
const setupPubSub = require("@xmpp-plugins/pubsub");

var menu = require("console-menu");
const { stat } = require("fs");
var query = require("cli-interact").question;

async function main() {
  menu(
    [
      { hotkey: "1", title: "LOGIN" },
      { hotkey: "2", title: "REGISTER" },
      { hotkey: "3", title: "EXIT" },
      // { separator: true },
      // { hotkey: '?', title: 'Help' },
    ],
    {
      header: "MENU",
      border: true,
    }
  ).then((item) => {
    if (item) {
      switch (parseInt(item.hotkey)) {
        case 1:
          var username = query("USERNAME: ");
          var password = query("PASSWORD: ");
          var xmpp = client({
            service: "alumchat.fun",
            username: username,
            password: password,
          });
          // debug(xmpp, true);
          xmpp.start().catch(console.error);
          xmpp.on("error", (err) => {
            console.error(err);
          });

          // xmpp.on("offline", () => {
          //   console.log("offline");
          // });
          const pubSubPlugin = setupPubSub(xmpp);
          const roster = setupRoster(xmpp);
          pubSubPlugin.on(`item-published:${"pubsub.alumchat.fun"}`, (ev) => {
            console.log("NOTIFICATION: ", ev);
          });

          xmpp.on("stanza", async (stanza) => {
            if (stanza.is("message")) {
              let user = stanza
                .getAttr("from")
                .substring(0, stanza.getAttr("from").indexOf("@"));
              if (stanza.getChildText("body") != null) {
                console.log(
                  "\t\t\t\t" + user + ": " + stanza.getChildText("body")
                );
              }
              if (stanza.getChild("composing") != null) {
                console.log("\t\t\t\t" + user + " is typing...");
              }
              if (stanza.getChild("paused") != null) {
                console.log("\t\t\t\t" + user + "paused typing...");
              }
            }
            if (stanza.attrs.type == "subscribe") {
              xmpp.send(
                xml("presence", { to: stanza.attrs.from, type: "subscribed" })
              );
            }
            if (stanza.is("presence")) {
              let uss = stanza.attrs.from.substring(
                0,
                stanza.attrs.from.indexOf("@")
              );
              console.log("\t\t\t\t" + uss + " is online");
              switch (stanza.attrs.type) {
                case "available":
                  console.log("\t\t\t\t" + uss + " is available");
                  break;
                case "unavailable":
                  console.log("\t\t\t\t" + uss + " is offline");
                  break;
                case "error":
                  console.log("\t\t\t\t" + uss + " is not subscribed");
              }
            }
          });

          xmpp.on("online", async (address) => {
            await xmpp.send(xml("presence"));
            console.log("WELCOME " + address.local);
            const froms = address.local + "@" + address.domain;
            cmenu(xmpp, froms, address, roster);
          });
          break;
        case 2:
          var xmpp = client({
            service: "alumchat.fun",
            username: "test",
            password: "test",
          });
          var username = query("NEW USERNAME: ");
          var password = query("NEW PASSWORD: ");
          xmpp.on("online", async (address) => {
            await xmpp.send(
              xml(
                "iq",
                { type: "set", id: "reg2" },
                xml(
                  "query",
                  { xmlns: "jabber:iq:register" },
                  xml("username", {}, username),
                  xml("password", {}, password)
                )
              )
            );
          });
          xmpp.start().catch(console.error);
          xmpp.on("stanza", async (stanza) => {
            if (stanza.is("iq")) {
              if (stanza.attr.type == "result") {
                console.log("\t\t\t\tREGISTERED NEW USER SUCCESSFULLY");
                xmpp.disconnect();
              }
              if (stanza.attr.type == "error") {
                console.log("\t\t\t\tERROR REGISTERING NEW USER");
                xmpp.disconnect();
              }
            }
          });
          return;
        case 3:
          console.log("EXITING");
          process.exit();
        default:
          console.log("ERROR");
          break;
      }
    } else {
      console.log("EXIT");
    }
  });
}

function cmenu(xmpp, froms, address, roster) {
  menu(
    [
      { hotkey: "1", title: "CHAT" },
      { hotkey: "2", title: "ROSTER" },
      { hotkey: "4", title: "EDIT PRESENCE" },
      { hotkey: "5", title: "SEND NOTIFICATION" },
      { hotkey: "6", title: "ADD CONTACT" },
      { hotkey: "7", title: "CHECK CONTACT" },
      { hotkey: "3", title: "DISCONNECT" },
      { separator: true },
      { hotkey: "0", title: "DELETE USER" },
    ],
    {
      header: "NODECHAT",
      border: true,
    }
  ).then((item) => {
    if (item) {
      switch (parseInt(item.hotkey)) {
        case 1:
          var to = query("TO: ");
          var message = query("MESSAGE: ");
          xmpp.send(
            xml(
              "message",
              { type: "chat", to: to + "@alumchat.fun" },
              xml("body", {}, message)
            )
          );
          console.log(
            "\t\t\t\t" + froms.substring(0, froms.indexOf("@")) + ": " + message
          );
          return cmenu(xmpp, froms, address, roster);
        case 2:
          roster.get().then((roster) => {
            if (!roster) {
              // the roster hasn't changed since last version
              return;
            }
            console.log("\t\t\t\tCONTACTS:");
            console.log(
              "\t\t\t\t" + roster.items.map((item) => item.jid.local)
            );
          });

          return cmenu(xmpp, froms, address, roster);
        case 3:
          xmpp.disconnect();
          main();
          break;
        case 4:
          // var show = query("SHOW: ");
          var status = query("STATUS: ");
          var priority = parseInt(query("PRIORITY: "));
          xmpp.send(
            xml(
              "presence",
              { from: froms },
              xml("show", {}, "chat"),
              xml("status", {}, status),
              xml("priority", {}, priority)
            )
          );
          return cmenu(xmpp, froms, address, roster);
        case 5:
          var to = query("MESSAGE NOTIFICATION: ");
          async () => {
            pubSubPlugin.publish(message);
          };
          return cmenu(xmpp, froms, address, roster);
        case 6:
          var contact = query("CONTACT: ");
          xmpp
            .send(
              xml("presence", {
                to: contact + "@alumchat.fun",
                type: "subscribe",
              })
            )
            .then(() => {
              xmpp
                .send(
                  xml(
                    "iq",
                    { from: froms, type: "set", id: "roster_2" },
                    xml(
                      "query",
                      { xmlns: "jabber:iq:roster" },
                      xml("item", { jid: contact + "@alumchat.fun" })
                    )
                  )
                )
                .then(() => {
                  console.log(
                    "\t\t\t\tSUCCESSFULLY ADDED CONTACT : " + contact
                  );
                })
                .catch(console.error);
            })
            .catch(console.error);
          return cmenu(xmpp, froms, address, roster);
        case 7:
          var contact = query("CONTACT: ");
          xmpp.send(
            xml("presence", { to: contact + "@alumchat.fun", type: "probe" })
          );
          return cmenu(xmpp, froms, address, roster);
        case 0:
          xmpp.send(
            xml(
              "iq",
              { type: "set", id: "unreg1" },
              xml("query", { xmlns: "jabber:iq:register" }, xml("remove"))
            )
          );
          return main();
      }
    } else {
      return;
    }
  });
}
main();
