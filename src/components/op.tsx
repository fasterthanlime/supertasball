import * as React from "react";
import { OpCode } from "../types";
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
    font-size: 18px;
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

    let icon: string;
    switch (op.type) {
      case "motor": {
        icon = "settings";
        break;
      }
      case "goto": {
        icon = "corner-right-down";
        break;
      }
      case "freq": {
        icon = "activity";
        break;
      }
      case "note": {
        icon = "music";
        break;
      }
      default: {
        icon = "chevron-right";
        break;
      }
    }

    return (
      <>
        <Filler />
        {label ? <span className={`icon icon-tag top-left`} /> : null}
        <span className={`icon icon-${icon}`} onClick={this.onEdit} />
        {op.type == "freq" ? (
          <span className="bottom-right">{op.numberValue} Hz</span>
        ) : null}
        {op.type == "goto" ? (
          <span className="bottom-right">{op.name}</span>
        ) : null}
        {op.type == "motor" ? (
          <>
            <span className="top-right">{op.name}</span>
            {this.renderBoolValue("bottom-left", op.boolValue)}
          </>
        ) : null}
        {op.type == "note" ? (
          <>
            <span className="top-right">{op.name}</span>
            <span className="bottom-right">{op.numberValue} Hz</span>
            {this.renderBoolValue("bottom-left", op.boolValue)}
          </>
        ) : null}
        <Filler />
      </>
    );
  }

  renderBoolValue(pos: string, bv: boolean) {
    return (
      <span
        className={`${pos} icon icon-${bv ? "check" : "x"}`}
        onClick={this.onFlipBool}
      />
    );
  }

  onEdit = (ev: React.MouseEvent<HTMLElement>) => {
    const { addr } = this.props;
    this.props.editCellStart({ addr });
  };

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
