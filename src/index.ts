import { client } from "./chat";

async function connectHandler(channel: string) {
  await client.join(channel);
}

document.querySelector("#connect").addEventListener("click", (e) => {
  const channel_element: HTMLInputElement = document.querySelector("#channel");
  if (channel_element.value !== "") {
    connectHandler(channel_element.value);
  }
});
