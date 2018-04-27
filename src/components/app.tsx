import * as React from "react";
import { connect, actionCreatorsList, Dispatchers } from "./connect";
import { RootState } from "../types";

import ReactHintFactory = require("react-hint");
const ReactHint = ReactHintFactory(React);

import Game from "./game";
import FloatiesContainer from "./floaties-container";
import styled from "./styles";

const AppDiv = styled.div`
  max-width: 1200px;
  min-height: 600px;

  margin: 0 auto;
  background: white;

  position: relative;

  font-size: ${props => props.theme.fontSizes.baseText};

  code {
    font-family: monospace;
    font-weight: normal !important;
  }
`;

class App extends React.PureComponent<Props & DerivedProps> {
  render() {
    return (
      <AppDiv>
        <Game />
        <FloatiesContainer />
        <ReactHint events />
      </AppDiv>
    );
  }
}

interface Props {}

const actionCreators = actionCreatorsList();

type DerivedProps = {} & Dispatchers<typeof actionCreators>;

export default connect<Props>(App, {
  actionCreators,
});
