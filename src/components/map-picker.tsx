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

  .maps {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }

  section {
    display: inline;
    border: 2px solid #ddd;
    border-radius: 8px;
    padding: 0.4em 1em;
    font-size: 120%;
    margin: 0.4em;

    display: flex;
    flex-direction: row;
    align-items: center;

    .preview {
      width: 40px;
      margin-right: 10px;

      svg {
        width: 100%;
        height: auto;
      }
    }

    &:hover {
      border-color: rgb(120, 240, 120);
      cursor: pointer;
    }
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
        <h3>Pick a pinball machine</h3>
        <div className="maps">
          {orderedMaps.map(key => {
            if (key === "custom") {
              return;
            }

            const mapDef = mapDefs[key];
            return (
              <section
                key={key}
                onClick={() => {
                  this.props.startPlayingPinball({ mapName: key });
                }}
              >
                <div
                  className="preview"
                  dangerouslySetInnerHTML={{ __html: mapDef.svg }}
                />
                {mapDef.name}
              </section>
            );
          })}
        </div>
        {this.renderDropZone()}
        <ButtonsDiv>
          <Button icon="x" onClick={this.onCancel}>
            Exit arcade
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
