import React = require("react");
import { connect, Dispatchers, actionCreatorsList } from "./connect";
import { RootState, SimulationState } from "../types";

import Button from "./button";
import Controls from "./controls";
import Simulation from "./controls";
import Clicker from "./clicker";
import styled from "./styles";

class Game extends React.PureComponent<Props & DerivedProps> {
  render() {
    const { simulation } = this.props;
    return (
      <>
        <Controls />
        {simulation ? <Simulation /> : <Clicker />}
      </>
    );
  }

  onMenu = () => {
    this.props.setPage({ page: "menu" });
  };
}

interface Props {}

const actionCreators = actionCreatorsList("setPage");

type DerivedProps = {
  simulation: SimulationState;
} & Dispatchers<typeof actionCreators>;

export default connect<Props>(Game, {
  actionCreators,
  state: (rs: RootState) => ({
    simulation: rs.simulation,
  }),
});
