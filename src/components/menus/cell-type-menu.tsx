import React = require("react");

import { ContextMenu, MenuItem } from "react-contextmenu";
const { connectMenu } = require("react-contextmenu"); // smh

import { OpCodeTypes, OpCode } from "../../types";
import { Dispatchers, actionCreatorsList, connect } from "../connect";
import Icon from "../icon";

class CellTypeMenu extends React.Component<Props & DerivedProps> {
  render() {
    const { id, trigger } = this.props;
    return <ContextMenu id={id}>{this.renderOptions()}</ContextMenu>;
  }

  renderOptions(): JSX.Element {
    if (!this.props.trigger) {
      return <>{""}</>;
    }

    const { op, addr } = this.props.trigger;

    return (
      <>
        {Object.keys(OpCodeTypes).map(k => {
          const def = OpCodeTypes[k];
          return (
            <MenuItem
              key={k}
              onClick={() =>
                this.props.cellSetType({
                  addr,
                  type: k as any,
                })
              }
            >
              <Icon icon={def.icon} /> {def.label}
            </MenuItem>
          );
        })}
        <MenuItem divider />
        <MenuItem
          onClick={() => {
            const label = window.prompt("Label name", op.label);
            if (label !== null) {
              this.props.cellSetLabel({ addr, label });
            }
          }}
        >
          <Icon icon="tag" /> Set label...
        </MenuItem>
        {op.label ? (
          <MenuItem
            onClick={() => this.props.cellSetLabel({ addr, label: null })}
          >
            Clear label
          </MenuItem>
        ) : null}
      </>
    );
  }
}

interface Props {
  id: string;
  trigger?: {
    addr: number;
    op: OpCode;
  };
}

const actionCreators = actionCreatorsList("cellSetType", "cellSetLabel");
type DerivedProps = Dispatchers<typeof actionCreators>;

export default connectMenu("cell-type-menu")(
  connect<Props>(CellTypeMenu, { actionCreators }),
);
