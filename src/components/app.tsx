import * as React from "react";
import { connect, actionCreatorsList, Dispatchers } from "./connect";
import { RootState } from "../types";

import Menu from "./menu";
import Game from "./game";
import styled from "./styles";

const AppDiv = styled.div`
  width: 1200px;
  min-height: 600px;

  margin: 0 auto;
  padding: 30px;
  background: white;

  font-size: ${props => props.theme.fontSizes.baseText};
  font-family: "Comfortaa", cursive;
`;

class App extends React.Component<Props & DerivedProps> {
  render() {
    return <AppDiv>{this.renderPage()}</AppDiv>;
  }

  renderPage(): JSX.Element {
    const { page } = this.props;
    if (page === "menu") {
      return <Menu />;
    }

    return <Game />;
  }
}

interface Props {}

const actionCreators = actionCreatorsList("setPage");

type DerivedProps = {
  page: string;
} & Dispatchers<typeof actionCreators>;

export default connect<Props>(App, {
  actionCreators,
  state: (rs: RootState) => ({
    page: rs.page
  })
});
