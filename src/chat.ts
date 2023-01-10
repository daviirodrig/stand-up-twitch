import tmi = require("tmi.js");
import { emotes } from "./emotes";

export const client = new tmi.Client({});

client.connect();

client.on("message", (channel, tags, message, self) => {
  for (var action of Object.keys(emotes)) {
    if (emotes[action].some((v) => message.includes(v))) {
      console.count(action);
    }
  }
});
