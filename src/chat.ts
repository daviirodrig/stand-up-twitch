import * as tmi from "tmi.js";
import {
  clap_action,
  gasp_action,
  getClapTriggers,
  getGaspTriggers,
  getLaughTriggers,
  laugh_action,
} from "./emotes";

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
  // Define the actions and their corresponding trigger getters
  const actions = [
    { action: laugh_action, getTriggers: getLaughTriggers },
    { action: gasp_action, getTriggers: getGaspTriggers },
    { action: clap_action, getTriggers: getClapTriggers },
  ];

  for (const { action, getTriggers } of actions) {
    const triggers = getTriggers(); // Get current triggers from localStorage
    if (triggers.some((trigger) => message.includes(trigger))) {
      // Check if the limit for this action type has been reached
      if (
        now_playing.filter((x) => x.type === action.type).length >= action.limit
      ) {
        console.log(`Limit reached for ${action.type}`);
        continue; // Skip to the next action type if limit reached
      }

      console.log(`Playing sound for ${action.type}`);

      const file = `https://cdn.justdavi.dev/${action.type}${getRandomInt(
        action.range
      )}.mp3`;
      const volumeElement: HTMLInputElement = document.querySelector("#volume");
      const audio = new Audio(file);
      audio.volume = Number(volumeElement.value) / 100;

      audio.oncanplay = async (e) => {
        const target = e.target as HTMLAudioElement;
        await target.play();
        const info = {
          type: action.type,
          audio: target,
        };
        now_playing.push(info);
      };

      audio.onended = (e) => {
        const target = e.target as HTMLAudioElement;
        now_playing = now_playing.filter((i) => i.audio !== target);
      };

      // Since a match was found and processed, no need to check other actions
      return;
    }
  }
});
