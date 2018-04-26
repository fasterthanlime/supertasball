// require("./flod/bundle.js");
require("jsxm/xm.js");
require("jsxm/xmeffects.js");
declare var XMPlayer;
XMPlayer.init();

import { sample } from "underscore";
import { Track } from "./types";
declare var neoart;

interface Mod {
  default: string;
}

let done = false;

export function setPlaying(track: Track) {
  XMPlayer.stop();
  if (!track) {
    return;
  }

  var xhr = new XMLHttpRequest();
  xhr.open("GET", track.url);
  xhr.responseType = "arraybuffer";
  xhr.onreadystatechange = () => {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      if (XMPlayer.load(xhr.response)) {
        XMPlayer.play();
      } else {
        console.error("Music failed to load :(");
      }
    }
  };
  xhr.send();
}
