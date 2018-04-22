import { connect, actionCreatorsList, Dispatchers } from "./connect";
import React = require("react");
import { RootState, OpCode, OpCodeTypes } from "../types";
import styled from "./styles";
import Button from "./button";

const CellEditorDiv = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  padding: 8px;

  background: white;
  border: 4px solid #444;

  &,
  input,
  select {
    font-size: ${props => props.theme.fontSizes.baseText};
  }
`;

const Fields = styled.div`
  display: flex;
  flex-direction: column;

  label {
    i {
      display: block;

      &.inline {
        display: inline-block;
        margin-right: 1em;
      }
      font-style: normal;
      font-size: 80%;
      color: #444;
    }

    display: block;
    margin: 2px 8px;
  }
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
    const def = OpCodeTypes[op.type];
    return (
      <CellEditorDiv>
        <TitleDiv>
          <select value={op.type} onChange={this.onTypeChange}>
            {Object.keys(OpCodeTypes).map(k => {
              return (
                <option key={k} value={k}>
                  {OpCodeTypes[k].label}
                </option>
              );
            })}
          </select>
          <Filler />
          <Button icon="x" onClick={this.onClose} />
        </TitleDiv>
        <Fields>
          <label>
            <i>label</i>{" "}
            <input type="text" value={op.label} onChange={this.onLabelChange} />
          </label>
          {def.relevantFields.name ? (
            <label>
              <i>{def.relevantFields.name}</i>{" "}
              <input type="text" value={op.name} onChange={this.onNameChange} />
            </label>
          ) : null}
          {def.relevantFields.boolValue ? (
            <label>
              <i className="inline">{def.relevantFields.boolValue}</i>
              <input
                type="checkbox"
                checked={op.boolValue}
                onChange={this.onBoolValueChange}
              />
            </label>
          ) : null}
          {def.relevantFields.numberValue ? (
            <label>
              <i>{def.relevantFields.numberValue}</i>{" "}
              <input
                type="number"
                value={op.numberValue}
                onChange={this.onNumberValueChange}
              />
            </label>
          ) : null}
        </Fields>
      </CellEditorDiv>
    );
  }

  onTypeChange = (ev: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(`type => ${ev.currentTarget.value}`);
    this.merge({ type: ev.currentTarget.value as any });
  };
  onLabelChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    this.merge({ label: ev.currentTarget.value });
  };
  onBoolValueChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    this.merge({ boolValue: ev.currentTarget.checked });
  };
  onNumberValueChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    this.merge({ numberValue: parseInt(ev.currentTarget.value, 10) });
  };
  onNameChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    this.merge({ name: ev.currentTarget.value });
  };

  onClose = () => {
    this.props.editCellStop({});
  };

  merge(pop: Partial<OpCode>) {
    let { addr, code } = this.props;
    let op = {
      ...code[addr],
      ...pop,
    };
    this.props.commitCell({ addr, op });
  }
}

interface Props {
  addr: number;
}

interface State {
  op: OpCode;
}

const actionCreators = actionCreatorsList("editCellStop", "commitCell");

type DerivedProps = {
  code: OpCode[];
} & Dispatchers<typeof actionCreators>;

export default connect<Props>(CellEditor, {
  actionCreators,
  state: (rs: RootState) => ({
    code: rs.simulation.code,
  }),
});
