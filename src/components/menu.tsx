import React = require("react");
import { connect, Dispatchers, actionCreatorsList } from "./connect";
import { RootState } from "../types";

class Menu extends React.Component<Props & DerivedProps> {
  render() {
    return (
      <div>
        Menu! <button onClick={this.onPlay}>Play now</button>
      </div>
    );
  }

  onPlay = () => {
    this.props.setPage({ page: "game" });
  };
}

interface Props {}

const actionCreators = actionCreatorsList("setPage");

type DerivedProps = {
  page: string;
} & Dispatchers<typeof actionCreators>;

export default connect<Props>(Menu, {
  actionCreators,
  state: (rs: RootState) => ({
    page: rs.page
  })
});
