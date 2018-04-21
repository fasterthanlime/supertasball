import React = require("react");
import { connect } from "./connect";
import { RootState } from "../types";

class Money extends React.PureComponent<Props & DerivedProps, State> {
  running: boolean;

  constructor(props: Money["props"], context) {
    super(props, context);
    this.state = {
      money: 0,
    };
    this.running = true;
  }

  componentDidMount() {
    requestAnimationFrame(this.onFrame);
  }

  componentWillUnmount() {
    this.running = false;
  }

  onFrame = () => {
    if (!this.running) {
      return;
    }

    let diff = Math.abs(this.state.money - this.props.money);
    let money = this.props.money;
    if (diff > 1) {
      money = this.state.money * 0.7 + this.props.money * 0.3;
    }
    this.setState({ money });
    requestAnimationFrame(this.onFrame);
  };

  render() {
    return <>{Math.floor(this.state.money).toLocaleString()}</>;
  }
}

interface Props {}
interface DerivedProps {
  money: number;
}

interface State {
  money: number;
}

export default connect<Props>(Money, {
  state: (rs: RootState) => ({ money: rs.money }),
});
