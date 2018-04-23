import * as React from "react";
import { RootState } from "../types";
import { connect, Dispatchers, actionCreatorsList } from "./connect";
import Button from "./button";
import { formatMoney } from "../format";
import styled from "./styles";
import { Expense } from "../expenses";

class ExpenseButton extends React.PureComponent<Props & DerivedProps> {
  render() {
    const { expense, money } = this.props;
    const { action, cost, label } = expense;
    let locked = cost > money;

    return (
      <Button onClick={this.onClick} disabled={locked}>
        {label} {formatMoney(cost)}
      </Button>
    );
  }

  onClick = (ev: React.MouseEvent<any>) => {
    this.props.doExpense({
      expense: this.props.expense,
      clientX: ev.clientX,
      clientY: ev.clientY,
    });
  };
}

interface Props {
  expense: Expense;
}

const actionCreators = actionCreatorsList("doExpense");
type DerivedProps = {
  money: number;
} & Dispatchers<typeof actionCreators>;

export default connect<Props>(ExpenseButton, {
  actionCreators,
  state: (rs: RootState) => ({ money: rs.resources.money }),
});
