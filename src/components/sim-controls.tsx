import React = require("react");
import { connect, Dispatchers, actionCreatorsList } from "./connect";
import { RootState, gameModeDefs, GameMode } from "../types";
import Button from "./button";
import Icon from "./icon";
import Money from "./money";
import styled from "./styles";
import { ContextMenuTrigger } from "react-contextmenu";
import { MapName, mapDefs } from "../map-defs";

const SimControlsDiv = styled.div`
  position: relative;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;

  align-items: center;
  margin-bottom: 10px;
`;

const Label = styled.div`
  margin: 0 8px;
  font-weight: bold;
  min-width: 80px;

  font-size: ${props => props.theme.fontSizes.baseText};
  flex-shrink: 0;
`;

const Filler = styled.div`
  flex-grow: 1;
`;

class SimControls extends React.PureComponent<Props & DerivedProps> {
  render() {
    return (
      <SimControlsDiv>
        <Row>
          <Button icon="arrow-up-circle" onClick={this.onReset} />
          <Button icon="chevron-down" onClick={this.onStepForward} />
          {this.renderPlayPause()}
          &nbsp; &nbsp; &nbsp; &nbsp;
          <Label>
            <Icon icon="save" />{" "}
            <code>
              {this.props.saveStateTicks === null
                ? "No save"
                : this.formatTicks(this.props.saveStateTicks)}
            </code>
          </Label>
          <Button
            icon="book"
            data-rh="Save state (F7)"
            onClick={this.onSaveState}
          />
          <Button
            icon="book-open"
            data-rh="Load state (F8)"
            onClick={this.onLoadState}
          />
          <Filler />
          <ContextMenuTrigger id="editor-menu" holdToDisplay={0}>
            <Button icon="menu">Menu</Button>
          </ContextMenuTrigger>
        </Row>
        <Row>
          <Label>
            <Icon icon="clock" />{" "}
            <code>{this.formatTicks(this.props.ticks)}</code>
          </Label>
          <Label>
            <Icon icon="film" /> <code>Frame {this.props.ticks}</code>
          </Label>
          <Label>
            <Icon icon="cpu" /> <code>{formatAddress(this.props.pc)}</code>
          </Label>
          <Label>
            <Icon icon="activity" /> <code>{this.props.freq} Hz</code>
          </Label>
          <Filler />
          <Label
            data-rh-at="bottom"
            data-rh={gameModeDefs[this.props.gameMode].description}
          >
            <Icon icon="crosshair" /> {gameModeDefs[this.props.gameMode].name}
          </Label>
          <Label>
            <Icon icon="map" /> {mapDefs[this.props.mapName].name}
          </Label>
        </Row>
      </SimControlsDiv>
    );
  }

  _date = new Date();
  formatTicks(ticks: number): string {
    this._date.setUTCDate(0);
    this._date.setUTCFullYear(0);
    this._date.setUTCHours(0);
    this._date.setUTCMinutes(0);
    this._date.setUTCSeconds(0);
    this._date.setUTCMilliseconds(ticks * 1000 / 60);
    return this._date.toISOString().substr(11, 11);
  }

  onToggleShowCode = () => {
    this.props.setShowCode({ showCode: !this.props.showCode });
  };

  onReset = () => {
    this.props.reset({});
  };

  onStepForward = () => {
    this.props.stepForward({});
  };

  onSaveState = () => {
    this.props.saveState({});
  };
  onLoadState = () => {
    this.props.loadState({});
  };

  renderPlayPause(): JSX.Element {
    if (this.props.paused) {
      return <Button icon="play" onClick={this.onPlay} />;
    } else {
      return <Button icon="pause" onClick={this.onPause} />;
    }
  }

  onPlay = () => {
    this.props.setPaused({ paused: false });
  };

  onPause = () => {
    this.props.setPaused({ paused: true });
  };
}

interface Props {}

const actionCreators = actionCreatorsList(
  "setPaused",
  "reset",
  "stepForward",
  "setShowCode",
  "saveState",
  "loadState",
);

type DerivedProps = {
  paused: number;
  pc: number;
  freq: number;
  ticks: number;
  showCode: boolean;
  gameMode: GameMode;
  mapName: MapName;
  saveStateTicks: number;
} & Dispatchers<typeof actionCreators>;

export default connect<Props>(SimControls, {
  actionCreators,
  state: (rs: RootState) => ({
    gameMode: rs.simulation.params.gameMode,
    mapName: rs.simulation.params.mapName,
    paused: rs.simulation.paused,
    pc: rs.simulation.machineState.pc,
    freq: rs.simulation.machineState.freq,
    ticks: rs.simulation.machineState.ticks,
    showCode: rs.ui.showCode,
    saveStateTicks: rs.simulation.savedMachinedState
      ? rs.simulation.savedMachinedState.ticks
      : null,
  }),
});

export function formatAddress(addr: number): JSX.Element {
  let s = "0000000" + addr.toString(16);
  return <>0x{s.substr(s.length - 4)}</>;
}
