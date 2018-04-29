import React = require("react");

import { ContextMenu, MenuItem, SubMenu } from "react-contextmenu";
const { connectMenu } = require("react-contextmenu"); // smh

import {
  OpCodeTypes,
  OpCode,
  RootState,
  CellSelection,
  Clipboard,
} from "../../types";
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
    const cb = this.props.clipboard;

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
  cellSelection: CellSelection;
  clipboard: Clipboard;
}

const actionCreators = actionCreatorsList(
  "cellSetType",
  "cellSetLabel",
  "cellPaste",
  "cellPasteInsert",
);
type DerivedProps = Dispatchers<typeof actionCreators>;

export default connectMenu("cell-type-menu")(
  connect<Props>(CellTypeMenu, {
    actionCreators,
    state: (rs: RootState) => ({
      cellSelection: rs.ui.cellSelection,
      clipboard: rs.ui.clipboard,
    }),
  }),
);
