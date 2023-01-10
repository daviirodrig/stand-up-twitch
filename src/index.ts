import { client } from "./chat";

async function connectHandler(channel: string) {
  await client.join(channel);
}

document.querySelector("#connect").addEventListener("click", (e) => {
  const channel_element: HTMLInputElement = document.querySelector("#channel");
  connectHandler(channel_element.value);
});
