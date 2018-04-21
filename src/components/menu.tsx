import React = require("react");
import { connect, Dispatchers, actionCreatorsList } from "./connect";
import { RootState } from "../types";

import Button from "./button";
import styled from "./styles";

const MenuDiv = styled.div`
  text-align: center;
`;

class Menu extends React.PureComponent<Props & DerivedProps> {
  render() {
    return (
      <MenuDiv>
        <h2>Menu</h2>
        <Button onClick={this.onPlay}>Play now</Button>
      </MenuDiv>
    );
  }

  onPlay = () => {
    this.props.setPage({ page: "game" });
  };
}

interface Props {}

const actionCreators = actionCreatorsList("setPage");

type DerivedProps = {
  page: string;
} & Dispatchers<typeof actionCreators>;

export default connect<Props>(Menu, {
  actionCreators,
  state: (rs: RootState) => ({
    page: rs.page,
  }),
});
