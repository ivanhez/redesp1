process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
process.env["NODE_NO_WARNINGS"] = 1;
const { client, xml } = require("@xmpp/client");
const debug = require("@xmpp/debug");
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

          xmpp.on("stanza", async (stanza) => {
            if (stanza.is("message")) {
              if (stanza.getChildText("body") != null) {
                let user = stanza.getAttr("from").substring(0, stanza.getAttr("from").indexOf("@"));
                console.log(
                  "\t\t\t" +
                    user +
                    ": " +
                    stanza.getChildText("body")
                );
              }
            }
            
          });

          xmpp.on("online", async (address) => {
            await xmpp.send(xml("presence"));
            console.log("WELCOME: " + address.local);
            const froms = address.local + "@" + address.domain;
            cmenu(xmpp, froms);
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
          debug(xmpp, true);
          xmpp.on("error", (err) => {
            console.error(err);
          });
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
                console.log("REGISTERED NEW USER SUCCESSFULLY");
                await xmpp.stop();
              }
              if (stanza.attr.type == "error") {
                console.log("ERROR REGISTERING NEW USER");
                await xmpp.stop();
              }
            }
            return main();
          });
          break;
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

function cmenu(xmpp, froms) {
  menu(
    [
      { hotkey: "1", title: "CHAT" },
      { hotkey: "2", title: "ROSTER", selected: true },
      { hotkey: "4", title: "EDIT PRESENCE" },
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
          return cmenu(xmpp, froms);
        case 2:
          break;
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
          return cmenu(xmpp, froms);
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
