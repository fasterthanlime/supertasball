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

export const Label = styled.div`
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
    const { money, freq, codeSize } = this.props;

    return (
      <ControlsDiv>
        <Label>
          <Icon icon="dollar-sign" /> <Money />
        </Label>
        <Label title={`The CPU executes ${freq} operations per second`}>
          <Icon icon="activity" /> {freq} Hz
        </Label>
        <Label
          title={`Your programs can contain at most ${codeSize} operations`}
        >
          <Icon icon="maximize" /> {codeSize} ops
        </Label>
        <Filler />
        <Button icon="menu" onClick={this.onMenu}>
          Menu
        </Button>
      </ControlsDiv>
    );
  }

  onMenu = () => {
    this.props.setPage({ page: "menu" });
  };
}

interface Props {}

const actionCreators = actionCreatorsList("setPage");

type DerivedProps = {
  money: number;
  freq: number;
  codeSize: number;
} & Dispatchers<typeof actionCreators>;

export default connect<Props>(Controls, {
  actionCreators,
  state: (rs: RootState) => ({
    money: rs.resources.money,
    freq: rs.resources.freq,
    codeSize: rs.resources.codeSize,
  }),
});
