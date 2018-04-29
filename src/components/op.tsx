import * as React from "react";
import { OpCode, OpCodeTypes } from "../types";
import styled from "./styles";
import { actionCreatorsList, Dispatchers, connect } from "./connect";
let opHeight = 32;

import { ContextMenuTrigger, ContextMenu } from "react-contextmenu";
import { formatAddress } from "./sim-controls";
import classNames = require("classnames");

const OpDiv = styled.div`
  height: ${opHeight}px;
  line-height: ${opHeight}px;
  font-size: 16px;
  background-color: white;
  border: 1px solid transparent;
  user-select: none;

  background-color: #444;
  color: white;

  &:hover {
    background-color: #333;
  }

  & > div {
    display: inline-block;
    margin: 0 2px;
  }

  div.addr,
  div.label,
  div.instruction,
  div.number-value,
  div.bool-value,
  div.name {
    width: 120px;
    padding: 0 0.2em;

    &,
    * {
      font-family: monospace;
    }

    i {
      font-style: normal;
      color: #999;
    }
  }

  div.addr {
    width: 100px;
    text-align: right;

    &.active {
      color: rgb(240, 100, 100);
    }
  }

  div.bool-value {
    width: auto;
  }

  .icon {
    font-size: 18px;

    &:hover {
      cursor: pointer;
    }
  }
`;

class Op extends React.PureComponent<Props & DerivedProps> {
  render() {
    const { op, addr, active, edited, selected } = this.props;
    return (
      <OpDiv
        innerRef={this.onEl}
        className={`cell ${active && "active"} ${edited &&
          "edited"} ${selected && "selected"}`}
        data-addr={addr}
        onClick={this.props.onClick}
      >
        {this.renderContents(op)}
      </OpDiv>
    );
  }

  el: HTMLElement;
  onEl = (el: HTMLElement) => {
    this.el = el;
    this.handleScroll();
  };

  renderContents(op: OpCode): JSX.Element {
    const { addr, active } = this.props;
    const { type, label } = op;
    const def = OpCodeTypes[type];
    const fields = def.relevantFields;

    return (
      <>
        <div className={classNames("addr")}>
          {active ? (
            <>
              <span className="icon icon-cpu" />{" "}
            </>
          ) : null}
          <code>{formatAddress(addr)}</code>
        </div>
        <div
          className="label"
          onClick={() => {
            const label = window.prompt("Label name", op.label);
            if (label !== null) {
              this.props.cellSetLabel({ addr, label });
            }
          }}
        >
          {label ? label : <i>no label</i>}
        </div>
        <div className="instruction">
          <ContextMenuTrigger
            id="cell-type-menu"
            holdToDisplay={0}
            collect={props => {
              this.props.setCellSelection({ start: addr, size: 1 });
              return { ...props, addr, op };
            }}
          >
            <span className={`icon icon-${def.icon}`} data-rh={def.label} />{" "}
            {type}
          </ContextMenuTrigger>
        </div>

        {fields.numberValue ? (
          <div
            className="number-value"
            data-rh={fields.numberValue.label}
            onClick={ev => {
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
          </div>
        ) : null}
        {fields.boolValue ? (
          this.renderBoolValue(op.boolValue, fields.boolValue)
        ) : (
          <div className="bool-value" />
        )}
        {this.renderName(op)}
      </>
    );
  }

  renderName(op: OpCode): JSX.Element {
    const { addr } = this.props;
    const { type } = op;
    const def = OpCodeTypes[type];
    const fields = def.relevantFields;
    if (!fields.name) {
      return <div className="name" />;
    }

    let label = op.name;
    if (fields.name.choices) {
      for (const ch of fields.name.choices) {
        if (ch.value == op.name) {
          label = ch.label;
        }
      }
    }

    let inner = <div className="name">{label || "∅"}</div>;

    const attrs = { className: "name", ["data-rh"]: fields.name.label };

    if (fields.name.choices) {
      return (
        <ContextMenuTrigger
          id="name-menu"
          attributes={attrs}
          holdToDisplay={0}
          collect={props => ({ ...props, def, addr })}
        >
          {label}
        </ContextMenuTrigger>
      );
    } else {
      return (
        <div
          {...attrs}
          onClick={ev => {
            ev.preventDefault();
            ev.stopPropagation();
            let name = window.prompt(fields.name.label, op.name);
            if (name) {
              this.props.cellSetName({ addr, name });
            }
          }}
        >
          {inner}
        </div>
      );
    }
  }

  renderBoolValue(bv: boolean, title: string) {
    return (
      <div
        data-rh={title}
        style={{ color: bv ? "#5cbf5c" : "#de9494" }}
        className={`bool-value icon icon-${bv ? "check" : "x"}`}
        onClick={this.onFlipBool}
      />
    );
  }

  onFlipBool = (ev: React.MouseEvent<any>) => {
    ev.preventDefault();
    ev.stopPropagation();
    const { addr, op } = this.props;
    this.props.cellSetBoolValue({
      addr,
      boolValue: !op.boolValue,
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
  "cellSetBoolValue",
  "cellSetLabel",
  "setCellSelection",
);

type DerivedProps = {} & Dispatchers<typeof actionCreators>;

export default connect<Props>(Op, {
  actionCreators,
});
