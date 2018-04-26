import reducer from "./reducer";
import { UIState } from "../types";
import { actions } from "../actions";
import { getTrackList } from "../track-list";
import { shuffle, keys } from "underscore";

const tracks = getTrackList();

const initialState: UIState = {
  showCode: true,
  floaties: {},
  cellSelection: { start: 0, size: 0 },
  clipboard: { ops: [] },
  pickingMap: false,
  showAchievements: false,
  showHelp: false,
  tracks,
  playlist: shuffle(keys(tracks)),
  playlistIndex: 0,
};

let floatySeed = 0;

export default reducer<UIState>(initialState, on => {
  on(actions.floaty, (state, action) => {
    return {
      ...state,
      floaties: {
        ...state.floaties,
        // this is very anti-redux, do not read
        [floatySeed++]: action.payload,
      },
    };
  });

  on(actions.floatyKill, (state, action) => {
    let floaties = { ...state.floaties };
    delete floaties[action.payload.id];

    return {
      ...state,
      floaties,
    };
  });

  on(actions.setShowCode, (state, action) => {
    return {
      ...state,
      showCode: action.payload.showCode,
    };
  });

  on(actions.setCellSelection, (state, action) => {
    return { ...state, cellSelection: action.payload };
  });

  on(actions.clipboardPut, (state, action) => {
    return { ...state, clipboard: action.payload };
  });

  on(actions.playPinball, (state, action) => {
    return { ...state, pickingMap: true };
  });

  on(actions.cancelPlayingPinball, (state, action) => {
    return { ...state, pickingMap: false };
  });

  on(actions.startPlayingPinball, (state, action) => {
    return { ...state, pickingMap: false };
  });

  on(actions.validateStage, (state, action) => {
    return { ...state, results: null };
  });

  on(actions.showAchievements, (state, action) => {
    return { ...state, showAchievements: true };
  });

  on(actions.hideAchievements, (state, action) => {
    return { ...state, showAchievements: false };
  });

  on(actions.showHelp, (state, action) => {
    return { ...state, showHelp: true };
  });

  on(actions.hideHelp, (state, action) => {
    return { ...state, showHelp: false };
  });

  on(actions.playNext, (state, action) => {
    let playlistIndex = (state.playlistIndex + 1) % state.tracks.length;
    let playlist = state.playlist;
    if (playlistIndex === 0) {
      console.log(`Reached end of playlist, shuffling...`);
      playlist = shuffle(playlist);
    }
    const activeTrack = state.tracks[playlist[playlistIndex]];
    return { ...state, activeTrack, playlistIndex, playlist };
  });

  on(actions.nowPlaying, (state, action) => {
    return { ...state, activeTrack: action.payload.track };
  });
});
