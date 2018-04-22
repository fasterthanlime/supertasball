import * as React from "react";
import { OpCode, OpCodeTypes } from "../types";
import styled from "./styles";
import { actionCreatorsList, Dispatchers, connect } from "./connect";
let opSide = 80;

const Filler = styled.div`
  flex-grow: 1;
`;

const OpDiv = styled.div`
  width: ${opSide}px;
  height: ${opSide}px;
  color: black;
  background-color: white;
  position: relative;
  border-bottom: 8px solid #777;
  user-select: none;
  transition: transform 0.2s;

  &.active {
    background-color: #333;
    color: white;
  }

  &.edited {
    border-color: rgb(240, 180, 180);
  }

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;

  .icon {
    font-size: 20px;
  }

  .top-left,
  .top-right,
  .bottom-left,
  .bottom-right {
    position: absolute;
    font-size: 15px;

    &.icon,
    .icon {
      font-size: 24px;
    }
  }

  .top-left {
    left: 2px;
    top: 2px;
  }
  .top-right {
    right: 2px;
    top: 2px;
  }
  .bottom-left {
    left: 2px;
    bottom: 2px;
  }
  .bottom-right {
    right: 2px;
    bottom: 2px;
  }
`;

class Op extends React.PureComponent<Props & DerivedProps> {
  render() {
    const { op, addr, active, edited, selected } = this.props;
    return (
      <OpDiv
        className={`cell ${active && "active"} ${edited &&
          "edited"} ${selected && "selected"}`}
        data-addr={addr}
        onClick={this.props.onClick}
      >
        {this.renderOpIcon(op)}
      </OpDiv>
    );
  }

  renderOpIcon(op: OpCode): JSX.Element {
    const { type, label } = op;
    const def = OpCodeTypes[type];
    const fields = def.relevantFields;

    return (
      <>
        <Filler />
        {label ? <span className={`icon icon-tag top-left`} /> : null}
        <span className={`icon icon-${def.icon}`} data-rh={def.label} />

        {fields.numberValue ? (
          <span className="top-right" data-rh={fields.numberValue.label}>
            {op.numberValue} {fields.numberValue.unit}
          </span>
        ) : null}
        {fields.name ? (
          <span className="bottom-right" data-rh={fields.name.label}>
            {op.name || "∅"}
          </span>
        ) : null}
        {fields.boolValue
          ? this.renderBoolValue("bottom-left", op.boolValue, fields.boolValue)
          : null}
        <Filler />
      </>
    );
  }

  renderBoolValue(pos: string, bv: boolean, title: string) {
    return (
      <span
        data-rh={title}
        style={{ color: bv ? "#5cbf5c" : "#de9494" }}
        className={`${pos} icon icon-${bv ? "check" : "x"}`}
        onClick={this.onFlipBool}
      />
    );
  }

  onFlipBool = (ev: React.MouseEvent<any>) => {
    const { addr, op } = this.props;
    this.props.commitCell({
      addr,
      op: {
        ...op,
        boolValue: !op.boolValue,
      },
    });
  };
}

interface Props {
  addr: number;
  active?: boolean;
  edited?: boolean;
  selected?: boolean;
  op: OpCode;
  onClick: (ev: React.MouseEvent<HTMLElement>) => void;
  onDoubleClick: (ev: React.MouseEvent<HTMLElement>) => void;
}

const actionCreators = actionCreatorsList("commitCell", "editCellStart");

type DerivedProps = {} & Dispatchers<typeof actionCreators>;

export default connect<Props>(Op, {
  actionCreators,
});
