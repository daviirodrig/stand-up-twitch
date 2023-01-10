import * as tmi from "tmi.js";
import { emotes } from "./emotes";

export const client = new tmi.Client({});

client.connect();

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max) + 1;
}

client.on("join", () => {
  document.querySelector("#status").innerHTML = "Connected!"
});

client.on("connected", () => {
  const btnElement: HTMLButtonElement = document.querySelector("#connect");
  btnElement.disabled = false;
});

client.on("message", async (channel, tags, message, self) => {
  for (const emote of emotes) {
    if (emote.text.some((v: string) => message.includes(v))) {
      const file = `https://cdn.davi.gq/${emote.action.type}${getRandomInt(emote.action.range)}.mp3`;
      const volumeElement: HTMLInputElement = document.querySelector("#volume");
      const audio = new Audio(file);
      audio.volume = Number(volumeElement.value) / 100;
      await audio.play();
    }
  }
});
