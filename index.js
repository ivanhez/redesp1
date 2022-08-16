process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
process.env["NODE_NO_WARNINGS"] = 1;
const { client, xml } = require("@xmpp/client");
const setupRoster = require("@xmpp-plugins/roster");
const debug = require("@xmpp/debug");
const setupPubSub = require("@xmpp-plugins/pubsub");
const fs = require("fs");
var menu = require("console-menu");
const { stat } = require("fs");
var query = require("cli-interact").question;
var mystatus = "login in";

// funcion para verificar la presencia de usuario
async function checkuser(xmpp, contact) {
  await xmpp
    .send(xml("presence", { to: contact + "@alumchat.fun", type: "probe" }))
    .then(() => {
      xmpp.on("stanza", async (stanza) => {
        let ptype = await stanza.attrs.type;
        switch (ptype) {
          case "available":
            return "(available)";
          case "unavailable":
            return "(unavailable)";
          case "error":
            return "(not subscribed)";
          default:
            return "(online)";
        }
      });
    });
}

// funcion de menu principal para iniciar la conexion
async function main() {
  menu(
    [
      { hotkey: "1", title: "LOGIN" },
      { hotkey: "2", title: "REGISTER" },
      { hotkey: "3", title: "EXIT" },
    ],
    {
      header: "MENU",
      border: true,
    }
  ).then((item) => {
    if (item) {
      switch (parseInt(item.hotkey)) {

        // LOGIN
        case 1:
          var username = query("USERNAME: ");
          var password = query("PASSWORD: ");
          var xmpp = client({
            service: "alumchat.fun",
            username: username,
            password: password,
          });
          // debug(xmpp, true);

          // Se inica la conexion
          xmpp.start().catch(console.error);
          xmpp.on("error", (err) => {
            console.error(err);
          });
          const pubSubPlugin = setupPubSub(xmpp);
          const roster = setupRoster(xmpp);
          pubSubPlugin.on(`item-published:${"pubsub.alumchat.fun"}`, (ev) => {
            console.log("NOTIFICATION: ", ev);
          });

          // Manejo de stanzas
          xmpp.on("stanza", async (stanza) => {
            if (stanza.is("message")) {
              let user = stanza
                .getAttr("from")
                .substring(0, stanza.getAttr("from").indexOf("@"));

              // recibo de mensajes
              if (stanza.getChildText("body") != null) {
                console.log(
                  "\t\t\t\t" + user + ": " + stanza.getChildText("body")
                );
              }

              // manejo de chatstates
              if (stanza.getChild("composing") != null) {
                console.log("\t\t\t\t" + user + " is typing...");
              }
              if (stanza.getChild("paused") != null) {
                console.log("\t\t\t\t" + user + "paused typing...");
              }

              // try recibir archivo
              if (stanza.getChild("data") != null) {
                console.log(
                  "\t\t\t\t" +
                  user +
                  "sent a file\n" +
                  stanza.getChildText("data")
                );
              }
            }

            // manejo de presencia
            if (stanza.is("presence")) {
              let uss = stanza.attrs.from.substring(
                0,
                stanza.attrs.from.indexOf("@")
              );
              if (stanza.getChild("status") != null) {
                console.log(
                  "\t\t\t\t" +
                  uss +
                  " status is " +
                  stanza.getChildText("status")
                );
              }
              let ptype = await stanza.attrs.type;
              switch (ptype) {
                case "available":
                  console.log("\t\t\t\t" + uss + " is available");
                  break;
                case "unavailable":
                  console.log("\t\t\t\t" + uss + " is unavailable");
                  break;
                case "error":
                  console.log("\t\t\t\t" + uss + " is not subscribed");
                  break;
                case "probe":
                  xmpp.send(
                    xml(
                      "presence",
                      { from: froms },
                      xml("show", {}, "chat"),
                      xml("status", {}, mystatus)
                      // xml("priority", {}, npriority)
                    )
                  );
                  break;

                // subscribed automatico
                case "subscribe":
                  xmpp.send(
                    xml("presence", {
                      to: stanza.attrs.from,
                      type: "subscribed",
                    })
                  );
                  break;

                // si no hay type pero hay presencia, se encuentra online
                default:
                  console.log("\t\t\t\t" + uss + " is online");
                  break;
              }
            }
          });
          xmpp.on("online", async (address) => {
            // await xmpp.send(xml("presence"));

            // El usuario hizo login
            console.log("WELCOME " + address.local);
            const froms = address.local + "@" + address.domain;
            await xmpp.send(
              xml(
                "presence",
                { from: froms },
                xml("show", {}, "chat"),
                xml("status", {}, mystatus)
                // xml("priority", {}, npriority)
              )
            );
            cmenu(xmpp, froms, address, roster);
          });
          break;

        // Registro de nuevo usuario
        case 2:
          var xmpp = client({
            service: "alumchat.fun",
            username: "test",
            password: "test",
          });
          var username = query("NEW USERNAME: ");
          var password = query("NEW PASSWORD: ");
          xmpp.on("online", async (address) => {
            xmpp.send(
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
          });
          xmpp.start().catch(console.error);
          return;

        // Salir de la aplicacion
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

async function cmenu(xmpp, froms, address, roster) {

  // menu principal del cliente
  menu(
    [
      { hotkey: "1", title: "CHAT" },
      { hotkey: "2", title: "ROSTER" },
      { hotkey: "3", title: "DISCONNECT" },
      { hotkey: "4", title: "EDIT PRESENCE" },
      { hotkey: "5", title: "SEND NOTIFICATION" },
      { hotkey: "6", title: "ADD CONTACT" },
      { hotkey: "7", title: "CHECK CONTACT" },
      { hotkey: "8", title: "SEND FILE" },
      { hotkey: "9", title: "GROUPCHAT" },
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

        // chat
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

        // ver contactos
        case 2:
          roster.get().then((roster) => {
            console.log("\t\t\t\tCONTACTS:");
            roster.items.forEach((element) => {
              checkuser(xmpp, element.jid.local).then((result) => {
                if (result) {
                  console.log("\t\t\t\t" + element.jid.local + result);
                }
              });
            });
          });
          return cmenu(xmpp, froms, address, roster);

        // desconectarse
        case 3:
          xmpp.disconnect();
          main();
          break;

        // cambiar status de presencia
        case 4:
          // var show = query("SHOW: ");
          mystatus = query("STATUS: ");
          // mypriority = parseInt(query("PRIORITY: "));
          xmpp.send(
            xml(
              "presence",
              { from: froms },
              xml("show", {}, "chat"),
              xml("status", {}, mystatus)
              // xml("priority", {}, npriority)
            )
          );
          return cmenu(xmpp, froms, address, roster);

        // notificacion en pubsub
        case 5:
          var to = query("MESSAGE NOTIFICATION: ");
          async () => {
            pubSubPlugin.publish(message);
          };
          return cmenu(xmpp, froms, address, roster);

        // agregar contacto
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

        // checkear contacto
        case 7:
          var contact = query("CONTACT: ");
          xmpp.send(
            xml("presence", { to: contact + "@alumchat.fun", type: "probe" })
          );
          return cmenu(xmpp, froms, address, roster);

        // mandar archivo
        case 8:
          var to = query("TO: ");
          var file = query("FILE: ");
          fs.stat(file, (err, stats) => {
            if (err) {
              console.log("FILE DOES NOT EXIST");
            } else {
              var fsize = stats.size;
              var bitmap = fs.readFileSync(file);
              xmpp.send(
                xml(
                  "message",
                  { to: to + "@alumchat.fun", from: froms },
                  xml("data", {}, Buffer(bitmap).toString("base64"))
                )
              );
            }
          });
          return cmenu(xmpp, froms, address, roster);

        // groupchat
        case 9:
          break;

        // eliminar contacto
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

// main
main();
// 400 lineas :v