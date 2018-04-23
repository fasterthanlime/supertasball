import * as React from "react";
import styled from "./styles";
import { actionCreatorsList, Dispatchers, connect } from "./connect";
import { SimulationState, RootState, Results } from "../types";

import Pinball from "./pinball";
import IDE from "./ide";
import Icon from "./icon";
import Button from "./button";
import { mapDefs, orderedMaps } from "../map-defs";
import { isCheating } from "../is-cheating";
import Dropzone = require("react-dropzone");

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
          if (key === "custom") {
            return;
          }

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
        {this.renderDropZone()}
        <ButtonsDiv>
          <Button icon="x" onClick={this.onCancel}>
            Nevermind
          </Button>
        </ButtonsDiv>
      </MapPickerDiv>
    );
  }

  renderDropZone(): JSX.Element {
    if (!isCheating()) {
      return null;
    }

    return <Dropzone onDrop={this.onDrop}>Drop .svg files here!</Dropzone>;
  }

  onDrop = (acceptedFiles, rejectedFiles) => {
    for (const file of acceptedFiles) {
      const reader = new FileReader();
      reader.onload = () => {
        const text = reader.result;
        mapDefs.custom.svg = text;
        this.props.startPlayingPinball({ mapName: "custom" });
      };
      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");

      reader.readAsText(file);
    }
  };

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
