import * as tmi from "tmi.js";
import { emotes } from "./emotes";

export const client = new tmi.Client({});

let now_playing = [];

client.connect();

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max) + 1;
}

client.on("join", () => {
  document.querySelector("#status").innerHTML = "Connected!";
});

client.on("connected", () => {
  const btnElement: HTMLButtonElement = document.querySelector("#connect");
  btnElement.disabled = false;
});

client.on("message", async (channel, tags, message, self) => {
  for (const emote of emotes) {
    if (emote.text.some((v: string) => message.includes(v))) {
      console.log(now_playing)
      if (
        now_playing.filter((x) => x.type === emote.action.type).length >=
        emote.action.limit
      ) {
        return;
      }

      const file = `https://cdn.justdavi.dev/${emote.action.type}${getRandomInt(
        emote.action.range
      )}.mp3`;
      const volumeElement: HTMLInputElement = document.querySelector("#volume");
      const audio = new Audio(file);
      audio.volume = Number(volumeElement.value) / 100;

      audio.oncanplay = async (e) => {
        const target = e.target as HTMLAudioElement;
        await target.play();
        const info = {
          type: emote.action.type,
          audio: target,
        };
        now_playing.push(info);
      };

      audio.onended = (e) => {
        const target = e.target as HTMLAudioElement;
        now_playing = now_playing.filter((i) => i.audio !== target);
      };
    }
  }
});
