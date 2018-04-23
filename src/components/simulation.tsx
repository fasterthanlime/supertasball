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
    const { results } = this.props;
    return <SimulationDiv>{this.renderMain()}</SimulationDiv>;
  }

  renderMain(): JSX.Element {
    const { results } = this.props;
    if (results) {
      return <ResultsScreen />;
    }
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
type DerivedProps = Dispatchers<typeof actionCreators> & {
  results: Results;
};

export default connect<Props>(Simulation, {
  actionCreators,
  state: (rs: RootState) => ({
    results: rs.simulation && rs.simulation.results,
    pickingMap: rs.ui.pickingMap,
  }),
});
