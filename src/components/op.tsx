import * as React from "react";
import { OpCode } from "../types";
import styled from "./styles";

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
  margin: 4px;
  border: 1px solid #777;
  user-select: none;
  transition: transform 0.2s;

  &.active {
    background-color: #333;
    color: white;
  }

  &.selected {
    box-shadow: 0 0 8px #333;
    transform: rotateZ(5deg);
  }

  &.edited {
    border-color: transparent;
    background-color: rgb(240, 180, 180);
    color: white;
  }

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;

  .icon {
    font-size: 28px;

    &.icon-chevron-right {
      opacity: 0.4;
    }
  }

  .top-left,
  .top-right,
  .bottom-left,
  .bottom-right {
    position: absolute;
    font-size: 11px;
    .icon {
      font-size: 18px;
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

export default class Op extends React.PureComponent<Props> {
  render() {
    const { op, addr, active, edited, selected } = this.props;
    return (
      <OpDiv
        className={`cell ${active && "active"} ${edited &&
          "edited"} ${selected && "selected"}`}
        data-addr={addr}
        onClick={this.props.onClick}
        onDoubleClick={this.props.onDoubleClick}
      >
        {this.renderOpIcon(op)}
      </OpDiv>
    );
  }

  renderOpIcon(op: OpCode): JSX.Element {
    const { type, label } = op;

    let icon: string;
    switch (op.type) {
      case "flip": {
        icon = "navigation";
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
        {icon ? <span className={`icon icon-${icon}`} /> : null}
        {op.type == "freq" ? (
          <span className="bottom-right">{op.numberValue} Hz</span>
        ) : null}
        {op.type == "goto" ? (
          <span className="bottom-right">{op.name}</span>
        ) : null}
        {op.type == "flip" ? (
          <>
            <span className="top-right">{op.name}</span>
            {renderBoolValue("bottom-left", op.boolValue)}
          </>
        ) : null}
        {op.type == "note" ? (
          <>
            <span className="top-right">{op.name}</span>
            <span className="bottom-right">{op.numberValue} Hz</span>
            {renderBoolValue("bottom-left", op.boolValue)}
          </>
        ) : null}
        <Filler />
      </>
    );
  }
}

function renderBoolValue(pos: string, bv: boolean) {
  return <span className={`${pos} icon icon-chevron-${bv ? "up" : "down"}`} />;
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
