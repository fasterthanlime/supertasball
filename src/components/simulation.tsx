import * as React from "react";
import styled from "./styles";
import { actionCreatorsList, Dispatchers, connect } from "./connect";
import { SimulationState } from "../types";

import Pinball from "./pinball";
import IDE from "./ide";

const SimulationDiv = styled.div`
  display: flex;
  flex-direction: row;
`;

class Simulation extends React.PureComponent<Props & DerivedProps> {
  render() {
    return (
      <SimulationDiv>
        <Pinball />
        <IDE />
      </SimulationDiv>
    );
  }
}

interface Props {}
const actionCreators = actionCreatorsList();
type DerivedProps = Dispatchers<typeof actionCreators> & {
  simulation: SimulationState;
};

export default connect<Props>(Simulation, { actionCreators });
