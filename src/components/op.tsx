import * as React from "react";
import { OpCode } from "../types";
import styled from "./styles";

let opSide = 60;

const Filler = styled.div`
  flex-grow: 1;
`;

const OpDiv = styled.div`
  width: ${opSide}px;
  height: ${opSide}px;
  margin: 2px;
  color: black;
  background-color: white;
  border: 1px solid #333;
  position: relative;

  &.active {
    border-color: transparent;
    background-color: #333;
    color: white;
  }

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;

  .icon {
    font-size: 24px;

    &.icon-chevron-right {
      opacity: 0.4;
    }

    &.top-left {
      font-size: 18px;
      position: absolute;
      left: 2px;
      top: 2px;
    }
  }
`;

export default class Op extends React.PureComponent<Props> {
  render() {
    const { op, addr, pc } = this.props;
    const active = addr === pc;
    return (
      <OpDiv
        className={`cell ${active && "active"}`}
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
        <Filler />
      </>
    );
  }
}

interface Props {
  addr: number;
  pc: number;
  op: OpCode;
  onClick: (ev: React.MouseEvent<HTMLElement>) => void;
}
