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
          <ExpenseButton expense={expenses.PlayPinball} />
          <ExpenseButton expense={expenses.BuyMoreROM} />
          <ExpenseButton expense={expenses.BuyFasterCPU} />
        </Column>
      </Columns>
    );
  }
}

interface Props {}

const actionCreators = actionCreatorsList();
type DerivedProps = Dispatchers<typeof actionCreators> & {};

export default connect<Props>(Clicker, { actionCreators });
