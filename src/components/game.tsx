import React = require("react");
import { connect, Dispatchers, actionCreatorsList } from "./connect";
import { RootState, SimulationState } from "../types";

import Button from "./button";
import Controls from "./controls";
import Footer from "./footer";
import Simulation from "./simulation";
import Clicker from "./clicker";
import MapPicker from "./map-picker";
import Achievements from "./achievements";
import styled from "./styles";

class Game extends React.PureComponent<Props & DerivedProps> {
  render() {
    const { showAchievements } = this.props;
    return (
      <>
        <Controls />
        {showAchievements ? <Achievements /> : null}
        {this.renderMain()}
        <Footer />
      </>
    );
  }

  renderMain(): JSX.Element {
    const { simulation, pickingMap } = this.props;
    if (simulation) {
      return <Simulation />;
    }
    if (pickingMap) {
      return <MapPicker />;
    }
    return <Clicker />;
  }
}

interface Props {}

const actionCreators = actionCreatorsList();

type DerivedProps = {
  simulation: SimulationState;
  pickingMap: boolean;
  showAchievements: boolean;
} & Dispatchers<typeof actionCreators>;

export default connect<Props>(Game, {
  actionCreators,
  state: (rs: RootState) => ({
    simulation: rs.simulation,
    pickingMap: rs.ui.pickingMap,
    showAchievements: rs.ui.showAchievements,
  }),
});
