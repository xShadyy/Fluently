import { Howl } from "howler";

export const correct = new Howl({
  src: ["/sounds/correct.mp3"],
  volume: 1,
});

export const wrong = new Howl({
  src: ["/sounds/wrong.mp3"],
  volume: 1,
});

export const uiClick = new Howl({
  src: ["/sounds/ui-click.wav"],
  volume: 1,
});

export const completed = new Howl({
  src: ["/sounds/completed.mp3"],
  volume: 1,
});
