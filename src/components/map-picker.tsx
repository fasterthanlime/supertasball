import * as React from "react";
import styled from "./styles";
import { actionCreatorsList, Dispatchers, connect } from "./connect";
import { SimulationState, RootState, Results } from "../types";

import Pinball from "./pinball";
import IDE from "./ide";
import Icon from "./icon";
import Button from "./button";
import { mapDefs, orderedMaps } from "../map-defs";

const MapPickerDiv = styled.div`
  h3 {
    font-size: 28px;
  }

  section {
    font-size: 120%;
    margin: 1em 0;

    display: flex;
    flex-direction: row;
    align-items: center;
  }

  ul {
    list-style-type: none;

    .icon-check {
    }

    .icon-x {
      color: rgb(250, 110, 110);
    }
  }
`;

const ButtonsDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;

class MapPicker extends React.PureComponent<Props & DerivedProps> {
  render() {
    return (
      <MapPickerDiv>
        <h3>Pick a map</h3>
        {orderedMaps.map(key => {
          const mapDef = mapDefs[key];
          return (
            <section key={key}>
              <Button
                icon="play"
                onClick={() => {
                  this.props.startPlayingPinball({ mapName: key });
                }}
              >
                Play {mapDef.name}
              </Button>
            </section>
          );
        })}
        <ButtonsDiv>
          <Button icon="x" onClick={this.onCancel}>
            Nevermind
          </Button>
        </ButtonsDiv>
      </MapPickerDiv>
    );
  }

  onCancel = () => {
    this.props.cancelPlayingPinball({});
  };
}

interface Props {}
const actionCreators = actionCreatorsList(
  "cancelPlayingPinball",
  "startPlayingPinball",
);
type DerivedProps = Dispatchers<typeof actionCreators> & {
  results: Results;
};

export default connect<Props>(MapPicker, {
  actionCreators,
  state: (rs: RootState) => ({
    results: rs.simulation && rs.simulation.results,
  }),
});
