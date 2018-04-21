import * as React from "react";
import { connect, actionCreatorsList, Dispatchers } from "./connect";
import { RootState } from "../types";

class App extends React.Component<Props & DerivedProps> {
  render() {
    const { page } = this.props;

    if (page === "menu") {
      return (
        <div>
          Menu! <button onClick={this.onPlay}>Play now</button>
        </div>
      );
    }

    if (page) return <div>How to play:</div>;
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

export default connect<Props>(App, {
  actionCreators,
  state: (rs: RootState) => ({
    page: rs.page
  })
});
