import React = require("react");
import { connect, Dispatchers, actionCreatorsList } from "./connect";
import { RootState, Unlocked, Track } from "../types";
import styled from "./styles";

import Icon from "./icon";
import Button from "./button";
import { sample } from "underscore";

const MusicPlayerDiv = styled.div`
  display: flex;
  flex-direction: row;

  align-items: center;
`;

const Spacer = styled.div`
  width: 0.2em;
`;

class MusicPlayer extends React.PureComponent<Props & DerivedProps> {
  render() {
    return <MusicPlayerDiv>{this.renderActiveTrack()}</MusicPlayerDiv>;
  }

  renderActiveTrack(): JSX.Element {
    const { activeTrack } = this.props;
    return (
      <>
        <Spacer />
        {activeTrack ? (
          <>
            <Icon icon="music" />
            <Spacer />
            <strong>{activeTrack.title}</strong>
            <Spacer />by<Spacer />
            <strong>{activeTrack.artist}</strong>
            <Spacer />
            <Button icon="volume-x" onClick={this.onMute} />
            <Button icon="skip-forward" onClick={this.onNextTrack} />
          </>
        ) : (
          <>
            No music
            <Spacer />
            <Button icon="volume-2" onClick={this.onNextTrack} />
          </>
        )}
      </>
    );
  }

  onMute = () => {
    this.props.nowPlaying({ track: null });
  };

  onNextTrack = () => {
    const track = sample<Track>(this.props.tracks);
    this.props.playNext({});
  };
}

interface Props {}

const actionCreators = actionCreatorsList("nowPlaying", "playNext");

type DerivedProps = {
  activeTrack: Track;
  tracks: Track[];
} & Dispatchers<typeof actionCreators>;

export default connect<Props>(MusicPlayer, {
  actionCreators,
  state: (rs: RootState) => ({
    activeTrack: rs.ui.activeTrack,
    tracks: rs.ui.tracks,
  }),
});
