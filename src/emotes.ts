const laugh_action = {
  type: "laugh",
  range: 6,
};

const gasp_action = {
  type: "gasp",
  range: 6,
};

const clap_action = {
  type: "clap",
  range: 1,
};

export const emotes = [
  {
    text: ["OMEGALUL", "KEKW"],
    action: laugh_action,
  },
  {
    text: ["D:"],
    action: gasp_action,
  },
  {
    text: ["Clap"],
    action: clap_action,
  },
];
