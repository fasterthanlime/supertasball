import { connect, actionCreatorsList, Dispatchers } from "./connect";
import React = require("react");
import { RootState, OpCode } from "../types";
import styled from "./styles";
import Button from "./button";

const CellEditorDiv = styled.div`
  position: absolute;
  top: 80px;
  left: 20px;
  right: 20px;

  background: white;
  border: 4px solid #444;
`;

const TitleDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Filler = styled.div`
  flex-grow: 1;
`;

class CellEditor extends React.Component<Props & DerivedProps> {
  render() {
    const { addr, code } = this.props;
    const op = code[addr];
    return (
      <CellEditorDiv>
        <TitleDiv>
          Edit cell @ {addr}
          <Filler />
          <Button icon="x" onClick={this.onClose} />
        </TitleDiv>
        <p>An editor lurks here</p>
        <pre>{JSON.stringify(op, null, 2)}</pre>
      </CellEditorDiv>
    );
  }

  onClose = () => {
    this.props.editCellStop({});
  };
}

interface Props {
  addr: number;
}

const actionCreators = actionCreatorsList("editCellStop");

type DerivedProps = {
  code: OpCode[];
} & Dispatchers<typeof actionCreators>;

export default connect<Props>(CellEditor, {
  actionCreators,
  state: (rs: RootState) => ({
    code: rs.simulation.code,
  }),
});
