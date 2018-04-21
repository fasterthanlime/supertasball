import React = require("react");
import { connect, Dispatchers, actionCreatorsList } from "./connect";
import { RootState } from "../types";

import Button from "./button";
import Controls from "./controls";
import Simulation from "./controls";
import styled from "./styles";

class Game extends React.PureComponent<Props & DerivedProps> {
  render() {
    return (
      <>
        <Controls />
        <Simulation />
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
  page: string;
} & Dispatchers<typeof actionCreators>;

export default connect<Props>(Game, {
  actionCreators,
  state: (rs: RootState) => ({
    page: rs.ui.page,
  }),
});
