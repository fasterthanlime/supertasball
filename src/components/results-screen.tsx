import * as React from "react";
import styled from "./styles";
import { actionCreatorsList, Dispatchers, connect } from "./connect";
import { SimulationState, RootState, Results } from "../types";

import Pinball from "./pinball";
import IDE from "./ide";
import Icon from "./icon";
import Button from "./button";

const ResultsDiv = styled.div`
  h3 {
    font-size: 28px;
  }

  section {
    font-size: 120%;
    margin: 1em 0;
  }

  ul {
    list-style-type: none;

    .icon-check {
    }

    .icon-x {
      color: rgb(250, 110, 110);
    }
  }
`;

const ButtonsDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;

class ResultsScreen extends React.PureComponent<Props & DerivedProps> {
  render() {
    const { results } = this.props;
    const hitTargets = results.hitGroups.length;
    const missedTargets = results.missedGroups.length;
    const totalTargets = hitTargets + missedTargets;

    return (
      <ResultsDiv>
        <h3>Results</h3>
        <section>
          <Icon icon="award" /> Score: {results.score.toLocaleString()}
        </section>
        <section>
          <Icon icon="crosshair" /> Targets {hitTargets}/{totalTargets}:
          <ul>
            {results.hitGroups.map(g => (
              <li key={g}>
                <Icon icon="check" /> {g}
              </li>
            ))}
          </ul>
          <ul>
            {results.missedGroups.map(g => (
              <li key={g}>
                <Icon icon="x" /> {g}
              </li>
            ))}
          </ul>
        </section>
        <ButtonsDiv>
          <Button icon="refresh-cw" onClick={this.onRetry}>
            Try again!
          </Button>
          <Button icon="check" onClick={this.onValidate}>
            Validate course
          </Button>
        </ButtonsDiv>
      </ResultsDiv>
    );
  }

  onRetry = () => {
    this.props.reset({});
  };

  onValidate = () => {
    const { results } = this.props;
    this.props.validateStage({ results });
  };
}

interface Props {}
const actionCreators = actionCreatorsList("reset", "validateStage");
type DerivedProps = Dispatchers<typeof actionCreators> & {
  results: Results;
};

export default connect<Props>(ResultsScreen, {
  actionCreators,
  state: (rs: RootState) => ({
    results: rs.simulation && rs.simulation.results,
  }),
});
