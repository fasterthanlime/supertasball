import * as React from "react";
import styled from "./styles";
import { actionCreatorsList, Dispatchers, connect } from "./connect";
import { SimulationState, RootState, Results, Unlocked } from "../types";

import Pinball from "./pinball";
import IDE from "./ide";
import Icon from "./icon";
import Button from "./button";
import { mapDefs, orderedMaps } from "../map-defs";
import { isCheating } from "../is-cheating";
import Dropzone = require("react-dropzone");
import { unlocks } from "../unlocks";

const AchievementsDiv = styled.div`
  h3 {
    font-size: 28px;
  }

  position: absolute;
  left: 20px;
  right: 20px;
  top: 20px;
  bottom: 20px;

  box-shadow: 0 0 8px #777;
  background: white;
  z-index: 20;
  padding: 1em 3em;

  .unlocks {
    display: flex;
    flex-direction: column;
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
    const { unlocked } = this.props;
    return (
      <AchievementsDiv>
        <h3>Achievements</h3>
        <div className="unlocks">
          {Object.keys(unlocked).map(key => {
            const unlock = unlocks[key];
            return <section key={key}>{unlock.label}</section>;
          })}
        </div>
        <ButtonsDiv>
          <Button icon="x" onClick={this.onCancel}>
            Close
          </Button>
        </ButtonsDiv>
      </AchievementsDiv>
    );
  }

  onCancel = () => {
    this.props.hideAchievements({});
  };
}

interface Props {}
const actionCreators = actionCreatorsList("hideAchievements");
type DerivedProps = Dispatchers<typeof actionCreators> & {
  unlocked: Unlocked;
};

export default connect<Props>(MapPicker, {
  actionCreators,
  state: (rs: RootState) => ({
    unlocked: rs.resources.unlocked,
  }),
});
