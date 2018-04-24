require("./flod/bundle.js");
import { sample } from "underscore";
import { Track } from "./types";
declare var neoart;

interface Mod {
  default: string;
}

let done = false;
let player: any;

export function setPlaying(track: Track) {
  if (player) {
    player.stop();
    player = null;
  }

  if (!track) {
    return;
  }

  var xhr = new XMLHttpRequest();
  xhr.open("GET", track.url);
  xhr.responseType = "arraybuffer";
  xhr.onreadystatechange = () => {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      neoart.FileLoader.player = null;
      player = neoart.FileLoader.load(xhr.response);
      player.play();
    }
  };
  xhr.send();
}
