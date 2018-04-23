import * as React from "react";
import { connect, actionCreatorsList, Dispatchers } from "./connect";
import { formatMoney } from "../format";
import styled from "./styles";

import Button from "./button";
import Icon from "./icon";
import ActivityButton from "./activity-button";
import ExpenseButton from "./expense-button";
import { activities } from "../activities";
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

class Clicker extends React.PureComponent<Props & DerivedProps> {
  render() {
    return (
      <Columns>
        <Column>
          <h3>Earn money</h3>
          <ActivityButton activity={activities.PlayDice} />
          <ActivityButton activity={activities.MineSatoshi} />
          <ActivityButton activity={activities.WashWindow} />
          <ActivityButton activity={activities.MowLawn} />
          <ActivityButton activity={activities.StealCar} />
        </Column>
        <Column>
          <h3>Spend money</h3>
          {this.renderExpenses()}
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
}

interface Props {}

const actionCreators = actionCreatorsList();
type DerivedProps = Dispatchers<typeof actionCreators> & {
  unlocked: Unlocked;
};

export default connect<Props>(Clicker, {
  actionCreators,
  state: (rs: RootState) => ({
    unlocked: rs.resources.unlocked,
  }),
});
