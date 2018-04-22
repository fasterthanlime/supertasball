import * as React from "react";
import FloatyComponent from "./floaty-component";
import { Floaties, RootState } from "../types";
import { connect } from "./connect";

class FloatiesContainer extends React.PureComponent<Props & DerivedProps> {
  render() {
    const { floaties } = this.props;
    return (
      <div>
        {Object.keys(floaties).map(k => {
          const floaty = floaties[k];
          return <FloatyComponent key={k} id={k} floaty={floaty} />;
        })}
      </div>
    );
  }
}

interface Props {}
interface DerivedProps {
  floaties: Floaties;
}

export default connect<Props>(FloatiesContainer, {
  state: (rs: RootState) => ({
    floaties: rs.ui.floaties,
  }),
});
