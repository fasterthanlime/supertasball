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
    let hitTargets = 0;
    let totalTargets = 0;

    for (const k of Object.keys(results.groups)) {
      const g = results.groups[k];
      hitTargets += g.hit;
      totalTargets += g.total;
    }

    return (
      <ResultsDiv>
        <h3>Results</h3>
        <pre>{JSON.stringify(results, null, 2)}</pre>
        <section>
          <Icon icon="award" /> Score: {results.score.toLocaleString()}
        </section>
        <section>
          <Icon icon="crosshair" /> Combos: {hitTargets}/{totalTargets}
          <ul>
            {Object.keys(results.groups).map(k => {
              const g = results.groups[k];
              return (
                <li key={k}>
                  <Icon icon={g.hit >= g.total ? "check" : "x"} /> {k} {g.hit}/{
                    g.total
                  }
                </li>
              );
            })}
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
