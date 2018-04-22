import { connect, actionCreatorsList, Dispatchers } from "./connect";
import React = require("react");
import { RootState, OpCode, OpCodeTypes } from "../types";
import styled from "./styles";
import Button from "./button";
import Icon from "./icon";

const CellEditorDiv = styled.div`
  position: fixed;
  top: 0px;
  left: 50%;
  padding: 8px;

  background: white;
  border: 4px solid #444;

  &,
  input,
  select {
    font-size: ${props => props.theme.fontSizes.baseText};
  }

  hr {
    height: 1px;
    width: 100%;
    background-color: #999;
    border: none;
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
    const fields = def.relevantFields;

    return (
      <CellEditorDiv>
        <TitleDiv>
          <select
            value={op.type}
            onChange={this.onTypeChange}
            ref={this.onTypeEl}
          >
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
          {fields.name ? (
            fields.name.choices ? (
              <select value={op.name} onChange={this.onNameChange}>
                <option key="<none>" value="">
                  (pick one)
                </option>
                {Object.keys(fields.name.choices).map(k => {
                  const ch = fields.name.choices[k];
                  return (
                    <option key={ch.value} value={ch.value}>
                      {ch.label}
                    </option>
                  );
                })}
              </select>
            ) : (
              <label>
                <i>{fields.name.freeInput}</i>{" "}
                <input
                  type="text"
                  value={op.name}
                  onChange={this.onNameChange}
                />
              </label>
            )
          ) : null}
          {fields.boolValue ? (
            <label>
              <i className="inline">{fields.boolValue}</i>
              <input
                type="checkbox"
                checked={op.boolValue}
                onChange={this.onBoolValueChange}
              />
            </label>
          ) : null}
          {fields.numberValue ? (
            <label>
              <i>{fields.numberValue}</i>{" "}
              <input
                type="number"
                value={op.numberValue}
                onChange={this.onNumberValueChange}
                step="any"
              />
            </label>
          ) : null}
          <hr />
          <label>
            <Icon icon="tag" />{" "}
            <input
              type="text"
              value={op.label}
              onChange={this.onLabelChange}
              placeholder="label"
            />
          </label>
        </Fields>
      </CellEditorDiv>
    );
  }

  onTypeEl = (typeEl: HTMLElement) => {
    if (typeEl) {
      typeEl.focus();
    }
  };

  onTypeChange = (ev: React.ChangeEvent<HTMLSelectElement>) => {
    this.set({ type: ev.currentTarget.value as any });
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
  onNameChange = (
    ev: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
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

  set(pop: Partial<OpCode>) {
    let { addr, code } = this.props;
    let op = { type: pop.type, ...pop };
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
