import React = require("react");

import { ContextMenu, MenuItem } from "react-contextmenu";
const { connectMenu } = require("react-contextmenu"); // smh

import { OpCodeTypes, OpCodeType, OpCodeDef } from "../../types";
import { Dispatchers, actionCreatorsList, connect } from "../connect";

class NameMenu extends React.Component<Props & DerivedProps> {
  render() {
    const { id, trigger } = this.props;
    return <ContextMenu id={id}>{this.renderOptions()}</ContextMenu>;
  }

  renderOptions(): JSX.Element {
    if (!this.props.trigger) {
      return <>{""}</>;
    }

    const { def, addr } = this.props.trigger;
    const { choices } = def.relevantFields.name;
    return (
      <>
        {Object.keys(choices).map(k => {
          const ch = choices[k];
          return (
            <MenuItem
              key={k}
              onClick={() =>
                this.props.cellSetName({
                  addr,
                  name: ch.value,
                })
              }
            >
              {ch.label}
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
    def: OpCodeDef;
  };
}

const actionCreators = actionCreatorsList("cellSetName");
type DerivedProps = Dispatchers<typeof actionCreators>;

export default connectMenu("name-menu")(
  connect<Props>(NameMenu, { actionCreators }),
);
