import * as React from "react";
import { connect, actionCreatorsList, Dispatchers } from "./connect";
import { formatMoney } from "../format";
import styled from "./styles";

import Button from "./button";
import Icon from "./icon";
import ExpenseButton from "./expense-button";
import { expenses } from "../expenses";
import { RootState, Unlocked } from "../types";

const Columns = styled.div`
  display: flex;
  flex-direction: row;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin: 0 1em;
`;

class Lobby extends React.PureComponent<Props & DerivedProps> {
  render() {
    return (
      <Columns>
        <Column>
          <h3>Upgrades</h3>
          {this.renderExpenses()}
        </Column>
        <Column>
          <h3>Pinball</h3>
          <Button onClick={this.onPlay} icon="play">
            Play pinball
          </Button>
          <h3>Help</h3>
          <Button
            icon="video"
            onClick={() =>
              window.open(
                "https://www.youtube.com/watch?v=c2lE4DDl5P0&yt:cc=on",
              )
            }
          >
            Watch a video tutorial
          </Button>
        </Column>
      </Columns>
    );
  }

  renderExpenses(): JSX.Element {
    const { unlocked } = this.props;
    return (
      <>
        {expenses.map((ex, i) => {
          if (ex.requires) {
            for (const req of ex.requires) {
              if (!unlocked[req]) {
                return null;
              }
            }
          }
          if (ex.unlock) {
            if (unlocked[ex.unlock]) {
              return null;
            }
          }
          return <ExpenseButton key={`expense-${i}`} expense={ex} />;
        })}
      </>
    );
  }

  onPlay = () => {
    this.props.playPinball({});
  };
}

interface Props {}

const actionCreators = actionCreatorsList("playPinball");
type DerivedProps = Dispatchers<typeof actionCreators> & {
  unlocked: Unlocked;
};

export default connect<Props>(Lobby, {
  actionCreators,
  state: (rs: RootState) => ({
    unlocked: rs.resources.unlocked,
  }),
});
