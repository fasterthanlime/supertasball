import React = require("react");
import { connect, Dispatchers, actionCreatorsList } from "./connect";
import { RootState } from "../types";
import Button from "./button";
import styled from "./styles";

const PinballDiv = styled.div`
  display: flex;
  flex-direction: row;

  width: 400px;
  height: 800px;

  background: green;
`;

class Game extends React.PureComponent<Props & DerivedProps> {
  render() {
    return <PinballDiv>Pinball's here</PinballDiv>;
  }
}

interface Props {}

const actionCreators = actionCreatorsList();

type DerivedProps = {} & Dispatchers<typeof actionCreators>;

export default connect<Props>(Game, {
  actionCreators,
  state: (rs: RootState) => ({}),
});
