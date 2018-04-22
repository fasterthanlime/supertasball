import * as React from "react";
import { Activity } from "../types";
import { connect, Dispatchers, actionCreatorsList } from "./connect";
import Button from "./button";
import { formatMoney } from "../format";

type ButtonPhase = "initial" | "rolling";

class ActivityButton extends React.PureComponent<Props & DerivedProps, State> {
  constructor(props, context) {
    super(props, context);
    this.state = {
      phase: "initial",
      progress: 0,
    };
  }

  render() {
    const { activity } = this.props;
    const { action, reward, label, badReward, badRewardChance } = activity;

    return (
      <Button onClick={this.onClick} progress={this.state.progress}>
        {label} {formatMoney(reward)}
        {badRewardChance > 0 ? <>or {formatMoney(badReward)}</> : null}
      </Button>
    );
  }

  onClick = (ev: React.MouseEvent<any>) => {
    if (this.state.phase !== "initial") {
      return;
    }

    const { activity } = this.props;
    this.setState({ phase: "rolling" });
    let { clientX, clientY } = ev;

    let commit = () => {
      this.props.doActivity({
        activity: this.props.activity,
        clientX,
        clientY,
      });
      this.setState({ phase: "initial", progress: 0 });
    };
    if (!activity.delay) {
      commit();
      return;
    }

    let start: number;
    let updateFrame = (timestamp: number) => {
      if (!start) {
        start = timestamp;
      }
      let elapsed = timestamp - start;
      if (elapsed > activity.delay) {
        commit();
      } else {
        this.setState({ progress: elapsed / activity.delay });
        requestAnimationFrame(updateFrame);
      }
    };
    requestAnimationFrame(updateFrame);
  };
}

interface State {
  phase: ButtonPhase;
  progress: number;
}

interface Props {
  activity: Activity;
}

const actionCreators = actionCreatorsList("doActivity");
type DerivedProps = {} & Dispatchers<typeof actionCreators>;

export default connect<Props>(ActivityButton, { actionCreators });
