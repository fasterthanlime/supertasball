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
        <Button icon="refresh-cw" onClick={this.onRefresh} />
        {this.renderPlayPause()}
      </SimControlsDiv>
    );
  }

  onRefresh = () => {
    this.props.refresh({});
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

const actionCreators = actionCreatorsList("setPaused", "refresh");

type DerivedProps = {
  paused: number;
} & Dispatchers<typeof actionCreators>;

export default connect<Props>(SimControls, {
  actionCreators,
  state: (rs: RootState) => ({
    paused: rs.simulation.paused,
  }),
});
