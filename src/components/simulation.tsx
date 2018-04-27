import * as React from "react";
import styled from "./styles";
import { actionCreatorsList, Dispatchers, connect } from "./connect";
import { SimulationState, RootState, Results } from "../types";

import Pinball from "./pinball";
import IDE from "./ide";
import ResultsScreen from "./results-screen";

const SimulationDiv = styled.div`
  display: flex;
  flex-direction: row;
`;

class Simulation extends React.PureComponent<Props & DerivedProps> {
  render() {
    return <SimulationDiv>{this.renderMain()}</SimulationDiv>;
  }

  renderMain(): JSX.Element {
    return this.renderPinball();
  }

  renderPinball(): JSX.Element {
    return (
      <>
        <Pinball />
        <IDE />
      </>
    );
  }
}

interface Props {}
const actionCreators = actionCreatorsList();
type DerivedProps = Dispatchers<typeof actionCreators> & {};

export default connect<Props>(Simulation, { actionCreators });
