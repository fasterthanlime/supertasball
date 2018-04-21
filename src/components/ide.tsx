import React = require("react");
import { connect, Dispatchers, actionCreatorsList } from "./connect";
import { RootState, Instruction } from "../types";
import styled from "./styles";

let cellSide = 85;

const IDEDiv = styled.div`
  .row {
    display: flex;
    flex-direction: row;
  }

  .cell {
    width: ${cellSide}px;
    height: ${cellSide}px;
    margin: 3px;
    border: 3px solid #555;
    opacity: 0.4;

    &.active {
      border-color: rgb(250, 40, 40);
      opacity: 1;
    }

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    color: #555;

    .icon {
      font-size: 24px;
    }

    i {
      width: 100%;
      font-style: normal;
      background: black;
      color: white;
      padding: 4px;
      text-align: center;

      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-around;

      .icon {
        font-size: 18px;
      }
    }
  }
`;

const Filler = styled.div`
  flex-grow: 1;
`;

class IDE extends React.PureComponent<Props & DerivedProps> {
  render() {
    let rows: JSX.Element[] = [];
    for (let row = 0; row < this.props.numRows; row++) {
      let cols: JSX.Element[] = [];
      for (let col = 0; col < this.props.numCols; col++) {
        let active = row == this.props.row && col == this.props.col;
        let instruction = this.props.instructions[
          col + row * this.props.numCols
        ];
        cols.push(
          <div className={`cell ${active && "active"}`} key={`col-${col}`}>
            {this.renderInstructionIcon(instruction)}
          </div>,
        );
      }
      rows.push(
        <div className="row" key={`row-${row}`}>
          {cols}
        </div>,
      );
    }

    return <IDEDiv>{rows}</IDEDiv>;
  }

  renderInstructionIcon(ins: Instruction): JSX.Element {
    let icon: string;
    let showBoolValue = false;
    let showName = false;
    switch (ins.type) {
      case "writeFlipper": {
        showName = true;
        showBoolValue = true;
        icon = "navigation";
        break;
      }
    }

    if (!icon) {
      return null;
    }
    return (
      <>
        <Filler />
        <span className={`icon icon-${icon}`} />
        <Filler />
        <i>
          {showName ? ins.name + " " : null}
          {showBoolValue ? (
            ins.boolValue ? (
              <span className={`icon icon-arrow-up`} />
            ) : (
              <span className={`icon icon-arrow-down`} />
            )
          ) : null}
        </i>
      </>
    );
  }
}

interface Props {}

const actionCreators = actionCreatorsList("setPage");

type DerivedProps = {
  numCols: number;
  numRows: number;
  col: number;
  row: number;
  instructions: Instruction[];
} & Dispatchers<typeof actionCreators>;

export default connect<Props>(IDE, {
  actionCreators,
  state: (rs: RootState) => ({
    numCols: rs.simulation.currentStats.numCols,
    numRows: rs.simulation.currentStats.numRows,
    col: rs.simulation.col,
    row: rs.simulation.row,
    instructions: rs.simulation.instructions,
  }),
});
