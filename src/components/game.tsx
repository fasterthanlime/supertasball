import React = require("react");
import { connect, Dispatchers, actionCreatorsList } from "./connect";
import { RootState } from "../types";

import Button from "./button";
import Controls from "./controls";
import Pinball from "./pinball";
import IDE from "./ide";
import styled from "./styles";

const GameArea = styled.div`
  display: flex;
  flex-direction: row;
`;

class Game extends React.PureComponent<Props & DerivedProps> {
  render() {
    return (
      <>
        <Controls />
        <GameArea>
          <Pinball />
          <IDE />
        </GameArea>
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
    page: rs.page,
  }),
});
