import React = require("react");
import { connect, Dispatchers, actionCreatorsList } from "./connect";
import { RootState } from "../types";
import Button from "./button";
import Icon from "./icon";
import Money from "./money";
import styled from "./styles";

const SimControlsDiv = styled.div`
  display: flex;
  flex-direction: row;

  align-items: center;
  margin-bottom: 10px;
`;

const Label = styled.div`
  margin: 0 8px;
  font-weight: bold;
  width: 120px;

  font-size: ${props => props.theme.fontSizes.larger};
`;

const Filler = styled.div`
  flex-grow: 1;
`;

class SimControls extends React.PureComponent<Props & DerivedProps> {
  render() {
    return (
      <SimControlsDiv>
        <Button large icon="skip-back" onClick={this.onReset}>
          Reset
        </Button>
        <Button large icon="chevron-right" onClick={this.onStepForward} />
        {this.renderPlayPause()}
        <Filler />
        <Label>
          <Icon icon="clock" /> 0x{this.props.pc.toString(16)}
        </Label>
        <Button large icon="log-out" onClick={this.onExitSimulation}>
          Exit arcade
        </Button>
      </SimControlsDiv>
    );
  }

  onExitSimulation = () => {
    if (window.confirm("Are you sure you want to exit the arcade?")) {
      this.props.exitSimulation({});
    }
  };

  onReset = () => {
    this.props.reset({});
  };

  onStepForward = () => {
    this.props.stepForward({});
  };

  renderPlayPause(): JSX.Element {
    if (this.props.paused) {
      return <Button large icon="play" onClick={this.onPlay} />;
    } else {
      return <Button large icon="pause" onClick={this.onPause} />;
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
  "exitSimulation",
  "setPaused",
  "reset",
  "stepForward",
);

type DerivedProps = {
  paused: number;
  pc: number;
} & Dispatchers<typeof actionCreators>;

export default connect<Props>(SimControls, {
  actionCreators,
  state: (rs: RootState) => ({
    paused: rs.simulation.paused,
    pc: rs.simulation.pc,
  }),
});
