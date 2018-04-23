import * as React from "react";
import { OpCode, OpCodeTypes } from "../types";
import styled from "./styles";
import { actionCreatorsList, Dispatchers, connect } from "./connect";
let opSide = 80;

import { ContextMenuTrigger, ContextMenu } from "react-contextmenu";

const Filler = styled.div`
  flex-grow: 1;
`;

const OpDiv = styled.div`
  width: ${opSide}px;
  height: ${opSide}px;
  color: black;
  background-color: white;
  position: relative;
  border-bottom: 6px solid #777;
  user-select: none;
  transition: transform 0.2s;
  margin: 2px;

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
    font-size: 30px;

    &:hover {
      cursor: pointer;
    }
  }

  .top-left,
  .top-right,
  .bottom-left,
  .bottom-right {
    position: absolute;
    font-size: 13px;

    &.icon,
    .icon {
      font-size: 24px;
    }
  }

  .label {
    position: absolute;
    bottom: -14px;
    left: 0;
    right: 0;
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
      <ContextMenuTrigger
        id="cell-type-menu"
        collect={props => {
          this.props.setCellSelection({ start: addr, size: 1 });
          return { ...props, addr, op };
        }}
      >
        <OpDiv
          innerRef={this.onEl}
          className={`cell ${active && "active"} ${edited &&
            "edited"} ${selected && "selected"}`}
          data-addr={addr}
          onClick={this.props.onClick}
        >
          {this.renderOpIcon(op)}
        </OpDiv>
      </ContextMenuTrigger>
    );
  }

  el: HTMLElement;
  onEl = (el: HTMLElement) => {
    this.el = el;
    this.handleScroll();
  };

  renderOpIcon(op: OpCode): JSX.Element {
    const { addr } = this.props;
    const { type, label } = op;
    const def = OpCodeTypes[type];
    const fields = def.relevantFields;

    return (
      <>
        <Filler />
        {label ? <span className="top-left">{label}</span> : null}

        <span className={`icon icon-${def.icon}`} data-rh={def.label} />

        {fields.numberValue ? (
          <span
            className="top-right"
            data-rh={fields.numberValue.label}
            onContextMenu={ev => {
              ev.preventDefault();
              ev.stopPropagation();
              const input = window.prompt(
                fields.numberValue.label + ` ${fields.numberValue.unit}`,
                "" + op.numberValue,
              );
              if (input !== null) {
                let numberValue = parseInt(input, 10);
                if (!isNaN(numberValue)) {
                  this.props.cellSetNumberValue({ addr, numberValue });
                }
              }
            }}
          >
            {op.numberValue} {fields.numberValue.unit}
          </span>
        ) : null}
        {this.renderName(op)}
        {fields.boolValue
          ? this.renderBoolValue("bottom-left", op.boolValue, fields.boolValue)
          : null}
        <Filler />
      </>
    );
  }

  renderName(op: OpCode): JSX.Element {
    const { addr } = this.props;
    const { type } = op;
    const def = OpCodeTypes[type];
    const fields = def.relevantFields;
    if (!fields.name) {
      return null;
    }

    let label = op.name;
    if (fields.name.choices) {
      for (const ch of fields.name.choices) {
        if (ch.value == op.name) {
          label = ch.label;
        }
      }
    }

    let inner = (
      <span className="bottom-right" data-rh={fields.name.label}>
        {label || "∅"}
      </span>
    );

    if (fields.name.choices) {
      return (
        <ContextMenuTrigger
          id="name-menu"
          collect={props => ({ ...props, def, addr })}
        >
          {inner}
        </ContextMenuTrigger>
      );
    } else {
      return (
        <span
          onContextMenu={ev => {
            ev.preventDefault();
            ev.stopPropagation();
            let name = window.prompt(fields.name.label, op.name);
            if (name) {
              this.props.cellSetName({ addr, name });
            }
          }}
        >
          {inner}
        </span>
      );
    }
  }

  renderBoolValue(pos: string, bv: boolean, title: string) {
    return (
      <span
        data-rh={title}
        style={{ color: bv ? "#5cbf5c" : "#de9494" }}
        className={`${pos} icon icon-${bv ? "check" : "x"}`}
        onContextMenu={this.onFlipBool}
      />
    );
  }

  onFlipBool = (ev: React.MouseEvent<any>) => {
    ev.preventDefault();
    ev.stopPropagation();
    const { addr, op } = this.props;
    this.props.commitCell({
      addr,
      op: {
        ...op,
        boolValue: !op.boolValue,
      },
    });
  };

  componentDidUpdate(prevProps: Op["props"], prevState: any) {
    // I'll do explicit bool comparisons IF I WANT TO
    if (prevProps.active == false && this.props.active == true) {
      this.handleScroll();
    }
  }

  handleScroll() {
    if (this.props.active && this.el) {
      this.el.scrollIntoView({ behavior: "instant", block: "nearest" });
    }
  }
}

interface Props {
  addr: number;
  active?: boolean;
  edited?: boolean;
  selected?: boolean;
  op: OpCode;
  onClick: (ev: React.MouseEvent<HTMLElement>) => void;
}

const actionCreators = actionCreatorsList(
  "commitCell",
  "cellSetName",
  "cellSetNumberValue",
  "setCellSelection",
);

type DerivedProps = {} & Dispatchers<typeof actionCreators>;

export default connect<Props>(Op, {
  actionCreators,
});
