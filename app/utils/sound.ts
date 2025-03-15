import { Howl } from "howler";

export const correct = new Howl({
  src: ["/sounds/correct.wav"],
  volume: 1,
});

export const wrong = new Howl({
  src: ["/sounds/wrong.wav"],
  volume: 1,
});

export const uiClick = new Howl({
  src: ["/sounds/ui-click.wav"],
  volume: 1,
});

export const victory = new Howl({
  src: ["/sounds/victory.wav"],
  volume: 1,
});
