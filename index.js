process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
const { client, xml } = require("@xmpp/client");
const debug = require("@xmpp/debug");
var menu = require('console-menu');
var query = require('cli-interact').question;

menu([
  { hotkey: '1', title: 'LOGIN' },
  { hotkey: '2', title: 'REGISTER' },
  // { hotkey: '3', title: 'Three' },
  { separator: true },
  // { hotkey: '?', title: 'Help' },
], {
  header: 'MENU',
  border: true,
}).then(item => {
  if (item) {
    switch (parseInt(item.hotkey)) {
      case 1:
        var username = query('USERNAME: ');
        var password = query('PASSWORD: ');
        var xmpp = client({
          service: "alumchat.fun",
          username: username,
          password: password,
        });
        debug(xmpp, true);

        xmpp.on("error", (err) => {
          console.error(err);
        });

        xmpp.on("offline", () => {
          console.log("offline");
        });

        xmpp.on("stanza", async (stanza) => {
          if (stanza.is("message")) {
            await xmpp.send(xml("presence", { type: "unavailable" }));
            await xmpp.stop();
          }
        });

        xmpp.on("online", async (address) => {
          // Makes itself available
          await xmpp.send(xml("presence"));

          // Sends a chat message to itself
          // const message = xml(
          //   "message",
          //   { type: "chat", to: address },
          //   xml("body", {}, "hello world")
          // );
          // await xmpp.send(message);
          cmenu(xmpp);
        });
        xmpp.start().catch(console.error);
        break;

      case 2:
        var xmpp = client({
          service: "alumchat.fun",
          username: 'test',
          password: 'test',
        });
        var username = query('NEW USERNAME: ');
        var password = query('NEW PASSWORD: ');
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

        break;
      default:
        console.log("ERROR");
        break;
    }
  } else {
    console.log('EXIT');
  }
});


function delUser(xmpp) {

  //   <iq type='set' id='unreg1'>
  //   <query xmlns='jabber:iq:register'>
  //     <remove/>
  //   </query>
  // </iq>
  xmpp.send(
    xml(
      "iq",
      { type: "set", id: "unreg1" },
      xml(
        "query",
        { xmlns: "jabber:iq:register" },
        xml("remove/")
      )
    )
  );
}

function cmenu(xmpp) {
  menu([
    { hotkey: '1', title: 'CHAT' },
    { hotkey: '2', title: 'ROSTER', selected: true },
    { hotkey: '3', title: 'EXIT' },
    { separator: true },
    { hotkey: '0', title: 'DELETE USER' },
  ], {
    header: 'NODECHAT',
    border: true,
  }).then(item => {
    if (item) {
      switch (parseInt(item.hotkey)) {
        case 2:
          break;
        case 3:
          xmpp.disconnect();
          break;
        case 0:
          delUser(xmpp);
          break;
      }
    } else {
      return
    }
  });
}





