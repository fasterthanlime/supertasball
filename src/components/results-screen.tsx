import * as React from "react";
import styled from "./styles";
import { actionCreatorsList, Dispatchers, connect } from "./connect";
import { SimulationState, RootState, Results } from "../types";

import Pinball from "./pinball";
import IDE from "./ide";
import Icon from "./icon";
import Button from "./button";
import { formatMoney } from "../format";
import { getCashReward } from "../score-utils";

const ResultsDiv = styled.div`
  position: absolute;
  top: 40px;
  left: 40px;
  right: 40px;

  z-index: 400;
  background: #fffeff;

  padding: 0 20px;
  padding-bottom: 40px;

  border: 1px dashed #444;
  overflow: hidden;

  h3 {
    font-size: 24px;
  }

  section {
    margin: 1em 0;

    i {
      font-style: normal;
      color: rgb(100, 220, 60);
      font-weight: bold;

      &.zero {
        color: rgb(220, 70, 60);
      }

      &.partial {
        color: rgb(220, 144, 60);
      }
    }
  }

  hr {
    width: 100%;
    height: 1px;
    margin: 8px 0;
    background: #444;
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

const Filler = styled.div`
  flex-grow: 1;
`;

class ResultsScreen extends React.PureComponent<Props & DerivedProps> {
  render() {
    const { results } = this.props;
    let hitGroups = 0;
    let totalGroups = 0;
    let totalGroupPoints = 0;
    let cashReward = getCashReward(results);
    if (cashReward < 0) {
      cashReward = 0;
    }

    for (const k of Object.keys(results.groups)) {
      const g = results.groups[k];
      if (g.hit >= g.total) {
        totalGroupPoints += g.comboPoints;
        hitGroups++;
      }
      totalGroupPoints += g.singlePoints * g.hit;
      totalGroups++;
    }

    return (
      <ResultsDiv>
        <h3>Results</h3>
        <section>
          <Icon icon="crosshair" /> Combos:{" "}
          <i
            className={
              hitGroups == 0 ? "zero" : hitGroups < totalGroups ? "partial" : ""
            }
          >
            {totalGroupPoints} points
          </i>{" "}
          ({hitGroups}/{totalGroups} combos)
          <ul>
            {Object.keys(results.groups).map(k => {
              const g = results.groups[k];
              let groupPoints =
                g.singlePoints * g.hit +
                g.comboPoints * (g.hit >= g.total ? 1 : 0);
              return (
                <li key={k}>
                  <Icon icon={g.hit >= g.total ? "check" : "x"} />
                  {k}:{" "}
                  <i
                    className={
                      g.hit == 0 ? "zero" : g.hit < g.total ? "partial" : ""
                    }
                  >
                    {groupPoints} points
                  </i>{" "}
                  ({g.hit}/{g.total})
                </li>
              );
            })}
          </ul>
        </section>
        {results.timeScorePenalty > 0 ? (
          <section>
            <Icon icon="clock" /> Time penalty:{" "}
            <i className="red">
              -{results.timeScorePenalty.toLocaleString()} points
            </i>
          </section>
        ) : null}
        <hr />
        <section>
          <Icon icon="award" /> Total:{" "}
          <i className={results.score < 0.01 ? "zero" : ""}>
            {results.score.toLocaleString()} points
          </i>
        </section>
        <section>
          <Icon icon="dollar-sign" /> Cash reward:{" "}
          <i>{formatMoney(cashReward)}</i>
        </section>
        <ButtonsDiv>
          {results.dirty ? (
            <>
              <Button icon="refresh-cw" onClick={this.onRetry}>
                Try again
              </Button>
              <Filler />
              <Button icon="play" onClick={this.onRetryWithPlay}>
                Play from beginning
              </Button>
              <p>(To qualify for cash reward)</p>
            </>
          ) : (
            <>
              <Button icon="refresh-cw" onClick={this.onRetry}>
                Try again
              </Button>
              <Filler />
              <Button icon="check" onClick={this.onValidate}>
                Validate course
              </Button>
            </>
          )}
        </ButtonsDiv>
      </ResultsDiv>
    );
  }

  onRetry = () => {
    this.props.reset({});
  };

  onRetryWithPlay = () => {
    this.props.reset({ play: true });
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
