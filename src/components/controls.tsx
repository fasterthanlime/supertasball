import React = require("react");
import { connect, Dispatchers, actionCreatorsList } from "./connect";
import { RootState } from "../types";
import Button from "./button";
import Icon from "./icon";
import Money from "./money";
import styled from "./styles";

const ControlsDiv = styled.div`
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

class Controls extends React.PureComponent<Props & DerivedProps> {
  render() {
    const { money, freq, numColumns, numRows, ticks } = this.props;

    return (
      <ControlsDiv>
        <Label>
          <Icon icon="dollar-sign" /> <Money />
        </Label>
        <Label>
          <Icon icon="activity" /> {freq} Hz
        </Label>
        <Label>
          <Icon icon="maximize" /> {numColumns}x{numRows}
        </Label>
        <Label>
          <Icon icon="clock" /> {ticks}
        </Label>
        <Filler />
        <Button icon="menu" onClick={this.onMenu}>
          Menu
        </Button>
        <Button icon="refresh-cw" onClick={this.onRefresh} />
        {this.renderPlayPause()}
      </ControlsDiv>
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

  onMenu = () => {
    this.props.setPage({ page: "menu" });
  };
}

interface Props {}

const actionCreators = actionCreatorsList("setPage", "setPaused", "refresh");

type DerivedProps = {
  money: number;
  freq: number;
  numColumns: number;
  numRows: number;
  paused: number;
  ticks: number;
} & Dispatchers<typeof actionCreators>;

export default connect<Props>(Controls, {
  actionCreators,
  state: (rs: RootState) => ({
    money: rs.money,
    freq: rs.freq,
    numColumns: rs.numCols,
    numRows: rs.numRows,
    paused: rs.paused,
    ticks: rs.ticks,
  }),
});
