import React = require("react");

import { ContextMenu, MenuItem } from "react-contextmenu";
const { connectMenu } = require("react-contextmenu"); // smh

import { OpCodeTypes } from "../../types";
import { Dispatchers, actionCreatorsList, connect } from "../connect";

class CellTypeMenu extends React.Component<Props & DerivedProps> {
  render() {
    const { id, trigger } = this.props;
    console.log(`rendering, trigger = `, trigger);
    return (
      <ContextMenu id={id}>
        {trigger
          ? Object.keys(OpCodeTypes).map(k => {
              const def = OpCodeTypes[k];
              return (
                <MenuItem
                  key={k}
                  onClick={() =>
                    this.props.cellSetType({
                      addr: trigger.addr,
                      type: k as any,
                    })
                  }
                >
                  {def.label}
                </MenuItem>
              );
            })
          : ""}
      </ContextMenu>
    );
  }
}

interface Props {
  id: string;
  trigger?: {
    addr: number;
  };
}

const actionCreators = actionCreatorsList("cellSetType");
type DerivedProps = Dispatchers<typeof actionCreators>;

export default connectMenu("cell-type")(
  connect<Props>(CellTypeMenu, { actionCreators }),
);
