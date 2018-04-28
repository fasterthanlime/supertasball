import React = require("react");

import { ContextMenu, MenuItem, SubMenu } from "react-contextmenu";
const { connectMenu } = require("react-contextmenu"); // smh

import { Dispatchers, actionCreatorsList, connect } from "../connect";
import Icon from "../icon";

class EditorMenu extends React.Component<Props & DerivedProps> {
  render() {
    const { id, trigger } = this.props;
    return <ContextMenu id={id}>{this.renderOptions()}</ContextMenu>;
  }

  renderOptions(): JSX.Element {
    if (!this.props.trigger) {
      return <>{""}</>;
    }

    return (
      <>
        <MenuItem
          onClick={() => {
            this.props.showHelp({});
          }}
        >
          <Icon icon="help-circle" /> Help
        </MenuItem>
        <MenuItem divider />
        <MenuItem
          onClick={() => {
            this.props.exitSimulation({});
          }}
        >
          <Icon icon="power" /> Exit pinball
        </MenuItem>
      </>
    );
  }
}

interface Props {
  id: string;
  trigger?: {};
}

const actionCreators = actionCreatorsList("showHelp", "exitSimulation");
type DerivedProps = Dispatchers<typeof actionCreators>;

export default connectMenu("editor-menu")(
  connect<Props>(EditorMenu, {
    actionCreators,
  }),
);
