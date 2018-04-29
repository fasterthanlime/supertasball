import React = require("react");
import { connect, Dispatchers, actionCreatorsList } from "./connect";
import { RootState, Unlocked } from "../types";
import Button from "./button";
import Icon from "./icon";
import Money from "./money";
import MusicPlayer from "./music-player";
import styled from "./styles";

const ControlsDiv = styled.div`
  display: flex;
  flex-direction: row;

  align-items: center;
  margin-bottom: 5px;

  border-bottom: 1px solid #777;
  margin-bottom: 10px;
  padding: 10px 0;

  a,
  a:visited {
    color: rgb(120, 120, 240);
    font-size: 120%;
    text-decoration: none;
  }
`;

export const Label = styled.div`
  margin: 0 8px;
  font-weight: bold;
  width: 120px;

  &.achievements {
    cursor: pointer;
  }
`;

const Filler = styled.div`
  flex-grow: 1;
`;

class Controls extends React.PureComponent<Props & DerivedProps> {
  render() {
    const { money, freq, codeSize, unlocked } = this.props;

    return (
      <ControlsDiv>
        <Label>
          <Icon icon="dollar-sign" /> <Money />
        </Label>
        <Label
          data-rh-at="bottom"
          data-rh={`The CPU can execute up to ${freq} operations per second`}
        >
          <Icon icon="activity" /> {freq} Hz
        </Label>
        <Label
          data-rh-at="bottom"
          data-rh={`Your programs can contain at most ${codeSize} operations`}
        >
          <Icon icon="cpu" /> {codeSize} ops
        </Label>
        <Label
          className="achievements"
          data-rh-at="bottom"
          data-rh={`You have ${Object.keys(unlocked).length} achievements`}
          onClick={this.onShowAchievements}
        >
          <Icon icon="award" /> {Object.keys(unlocked).length}
        </Label>
        <Filler />
        <MusicPlayer />
      </ControlsDiv>
    );
  }

  onShowAchievements = () => {
    this.props.showAchievements({});
  };
}

interface Props {}

const actionCreators = actionCreatorsList("showAchievements");

type DerivedProps = {
  money: number;
  freq: number;
  codeSize: number;
  unlocked: Unlocked;
} & Dispatchers<typeof actionCreators>;

export default connect<Props>(Controls, {
  actionCreators,
  state: (rs: RootState) => ({
    money: rs.resources.money,
    freq: rs.resources.freq,
    codeSize: rs.resources.codeSize,
    unlocked: rs.resources.unlocked,
  }),
});
