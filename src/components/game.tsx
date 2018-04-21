import React = require("react");
import { connect, Dispatchers, actionCreatorsList } from "./connect";
import { RootState } from "../types";

class Game extends React.Component<Props & DerivedProps> {
  render() {
    return (
      <div>
        Game! <button onClick={this.onMenu}>Back to menu</button>
      </div>
    );
  }

  onMenu = () => {
    this.props.setPage({ page: "menu" });
  };
}

interface Props {}

const actionCreators = actionCreatorsList("setPage");

type DerivedProps = {
  page: string;
} & Dispatchers<typeof actionCreators>;

export default connect<Props>(Game, {
  actionCreators,
  state: (rs: RootState) => ({
    page: rs.page
  })
});
