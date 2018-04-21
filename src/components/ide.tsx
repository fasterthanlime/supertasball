import React = require("react");
import { connect, Dispatchers, actionCreatorsList } from "./connect";
import { RootState, OpCode } from "../types";
import styled from "./styles";

import Op from "./op";

const IDEDiv = styled.div``;

class IDE extends React.PureComponent<Props & DerivedProps> {
  render() {
    const { pc, code } = this.props;
    let ops = [];
    for (let addr = 0; addr < this.props.code.length; addr++) {
      const op = code[addr];
      let active = addr == pc;
      ops.push(<Op op={op} addr={addr} pc={pc} />);
    }

    return <IDEDiv>{ops}</IDEDiv>;
  }
}

interface Props {}

const actionCreators = actionCreatorsList("setPage");

type DerivedProps = {
  pc: number;
  code: OpCode[];
} & Dispatchers<typeof actionCreators>;

export default connect<Props>(IDE, {
  actionCreators,
  state: (rs: RootState) => ({
    pc: rs.simulation.pc,
    code: rs.simulation.code,
  }),
});
