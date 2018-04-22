import React = require("react");
import { connect, Dispatchers, actionCreatorsList } from "./connect";
import { RootState, OpCode, EditedCell } from "../types";
import styled from "./styles";

import SimControls from "./sim-controls";
import Op from "./op";
import CellEditor from "./cell-editor";

const IDEDiv = styled.div`
  width: 100%;
  position: relative;

  &:focus {
    outline: none;
  }
`;

const Ops = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: start;
`;

const Filler = styled.div`
  flex-grow: 1;
`;

class IDE extends React.PureComponent<Props & DerivedProps> {
  render() {
    const { showCode, editedCell } = this.props;
    return (
      <IDEDiv tabIndex={0} onKeyDown={this.onKeyDown}>
        <SimControls />
        {showCode ? this.renderOps() : <p>Code hidden</p>}
        {editedCell ? <CellEditor addr={editedCell.addr} /> : null}
      </IDEDiv>
    );
  }

  renderOps(): JSX.Element {
    const { pc, code, editedCell } = this.props;
    let ops = [];
    for (let addr = 0; addr < this.props.code.length; addr++) {
      const op = code[addr];
      let active = addr == pc;
      ops.push(
        <Op
          key={addr}
          op={op}
          addr={addr}
          active={addr == pc}
          edited={editedCell && addr == editedCell.addr}
          onClick={this.onOpClick}
        />,
      );
    }
    ops.push(<Filler key="filler" />);
    return <Ops>{ops}</Ops>;
  }

  onOpClick = (ev: React.MouseEvent<HTMLElement>) => {
    const addr = ev.currentTarget.dataset.addr;
    if (addr) {
      this.props.editCellStart({ addr: parseInt(addr, 10) });
    }
  };

  onKeyDown = (ev: React.KeyboardEvent<HTMLElement>) => {
    if (ev.key == "Escape") {
      this.props.editCellStop({});
    }
  };
}

interface Props {}

const actionCreators = actionCreatorsList(
  "setPage",
  "floaty",
  "editCellStart",
  "editCellStop",
);

type DerivedProps = {
  pc: number;
  code: OpCode[];
  showCode: boolean;
  editedCell: EditedCell;
} & Dispatchers<typeof actionCreators>;

export default connect<Props>(IDE, {
  actionCreators,
  state: (rs: RootState) => ({
    pc: rs.simulation.pc,
    code: rs.simulation.code,
    showCode: rs.ui.showCode,
    editedCell: rs.ui.editedCell,
  }),
});
