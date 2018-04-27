import * as React from "react";
import styled from "./styles";
import { actionCreatorsList, Dispatchers, connect } from "./connect";
import {
  SimulationState,
  RootState,
  Results,
  GameMode,
  gameModeDefs,
} from "../types";

import Pinball from "./pinball";
import IDE from "./ide";
import Icon from "./icon";
import Button from "./button";
import { mapDefs, orderedMaps, MapName } from "../map-defs";
import { isCheating } from "../is-cheating";
import Dropzone = require("react-dropzone");

const previewWidth = "120px";

const MapPickerDiv = styled.div`
  h3 {
    font-size: 28px;
  }

  .exit {
    float: right;
  }

  select {
    font-size: ${props => props.theme.fontSizes.larger};
    padding: 0.4em;
  }

  .maps {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }

  section,
  .dropzone {
    display: inline;
    border: 2px solid #ddd;
    border-radius: 8px;
    padding: 0.4em 1em;
    margin: 0.4em;

    display: flex;
    flex-direction: column;
    align-items: center;

    .preview {
      width: ${previewWidth};
      margin-right: 10px;

      svg {
        width: 100%;
        height: auto;
      }
    }

    &:hover,
    &.active {
      border-color: rgb(120, 240, 120);
      cursor: pointer;
    }
  }

  .dropzone {
    border: 2px dashed #333;
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
  justify-content: center;

  margin-top: 20px;
`;

class MapPicker extends React.PureComponent<Props & DerivedProps, State> {
  constructor(props, context) {
    super(props, context);
    this.state = {
      gameMode: "score",
      mapName: orderedMaps[0],
    };
  }

  render() {
    return (
      <MapPickerDiv>
        <Button className="exit" icon="x" onClick={this.onCancel} />
        <h3>New game</h3>
        <select value={this.state.gameMode} onChange={this.onModeChange}>
          <option value="score">{gameModeDefs.score.name}</option>
          <option value="time">{gameModeDefs.time.name}</option>
          <option value="golf">{gameModeDefs.golf.name}</option>
        </select>
        <p>{gameModeDefs[this.state.gameMode].description}</p>
        <div className="maps">
          {orderedMaps.map(key => {
            if (key === "custom") {
              return;
            }

            const mapDef = mapDefs[key];
            return (
              <section
                key={key}
                data-mapname={key}
                onClick={this.onMapChange}
                onDoubleClick={this.onPlay}
                className={`${this.state.mapName == key ? "active" : ""}`}
              >
                <div
                  className="preview"
                  dangerouslySetInnerHTML={{ __html: mapDef.svg }}
                />
                {mapDef.name}
              </section>
            );
          })}
          {this.renderDropZone()}
        </div>
        <ButtonsDiv>
          <Button icon="play" onClick={this.onPlay} large>
            Play now
          </Button>
        </ButtonsDiv>
      </MapPickerDiv>
    );
  }

  onModeChange = (ev: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({ gameMode: ev.currentTarget.value as GameMode });
  };

  onMapChange = (ev: React.MouseEvent<HTMLDivElement>) => {
    this.setState({ mapName: ev.currentTarget.dataset["mapname"] });
  };

  onPlay = () => {
    const { gameMode, mapName } = this.state;
    this.props.startPlayingPinball({ mapName, gameMode });
  };

  renderDropZone(): JSX.Element {
    if (!isCheating()) {
      return null;
    }

    return (
      <Dropzone
        className={`dropzone ${
          this.state.mapName === "custom" ? "active" : ""
        }`}
        onDrop={this.onDrop}
        style={{}}
      >
        {this.state.customMapSvg ? (
          <>
            <div
              className="preview"
              dangerouslySetInnerHTML={{ __html: this.state.customMapSvg }}
            />
            Custom map
          </>
        ) : (
          <div className="preview">Drop an svg file here</div>
        )}
      </Dropzone>
    );
  }

  onDrop = (acceptedFiles, rejectedFiles) => {
    for (const file of acceptedFiles) {
      const reader = new FileReader();
      reader.onload = () => {
        const text = reader.result;
        mapDefs.custom.svg = text;
        this.setState({ mapName: "custom", customMapSvg: text });
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

interface State {
  gameMode: GameMode;
  mapName: MapName;
  customMapSvg?: string;
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
