import * as React from "react";
import { OpCode } from "../types";
import styled from "./styles";

let opSide = 85;

const Filler = styled.div`
  flex-grow: 1;
`;

const OpDiv = styled.div`
  width: ${opSide}px;
  height: ${opSide}px;
  margin: 3px;
  border: 3px solid #555;
  opacity: 0.4;

  &.active {
    border-color: rgb(250, 40, 40);
    opacity: 1;
  }

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  color: #555;

  .icon {
    font-size: 24px;
  }

  i {
    width: 100%;
    font-style: normal;
    background: black;
    color: white;
    padding: 4px;
    text-align: center;

    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;

    .icon {
      font-size: 18px;
    }
  }
`;

export default class Op extends React.PureComponent<Props> {
  render() {
    const { op, addr, pc } = this.props;
    const active = addr === pc;
    return (
      <OpDiv className={`cell ${active && "active"}`} key={`addr-${addr}`}>
        {this.renderOpIcon(op)}
      </OpDiv>
    );
  }

  renderOpIcon(op: OpCode): JSX.Element {
    let icon: string;
    let showBoolValue = false;
    let showName = false;
    switch (op.type) {
      case "writeFlipper": {
        showName = true;
        showBoolValue = true;
        icon = "navigation";
        break;
      }
    }

    if (!icon) {
      return null;
    }
    return (
      <>
        <Filler />
        <span className={`icon icon-${icon}`} />
        <Filler />
        <i>
          {showName ? op.name + " " : null}
          {showBoolValue ? (
            op.boolValue ? (
              <span className={`icon icon-arrow-up`} />
            ) : (
              <span className={`icon icon-arrow-down`} />
            )
          ) : null}
        </i>
      </>
    );
  }
}

interface Props {
  addr: number;
  pc: number;
  op: OpCode;
}
