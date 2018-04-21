import React = require("react");
import { connect, Dispatchers, actionCreatorsList } from "./connect";
import { RootState } from "../types";
import styled from "./styles";

let cellSide = 74;

const IDEDiv = styled.div`
  .row {
    display: flex;
    flex-direction: row;
  }

  .cell {
    width: ${cellSide}px;
    height: ${cellSide}px;
    margin: 3px;
    border: 2px solid #555;
    border-radius: 4px;

    &.active {
      border-color: rgb(240, 130, 130);
    }

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 44px;
    color: #555;
  }
`;

class IDE extends React.PureComponent<Props & DerivedProps> {
  render() {
    let rows: JSX.Element[] = [];
    for (let row = 0; row < this.props.numRows; row++) {
      let cols: JSX.Element[] = [];
      for (let col = 0; col < this.props.numCols; col++) {
        let active = row == this.props.row && col == this.props.col;
        cols.push(
          <div className={`cell ${active && "active"}`} key={`col-${col}`}>
            <span className="icon icon-chevron-right" />
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
}

interface Props {}

const actionCreators = actionCreatorsList("setPage");

type DerivedProps = {
  numCols: number;
  numRows: number;
  col: number;
  row: number;
} & Dispatchers<typeof actionCreators>;

export default connect<Props>(IDE, {
  actionCreators,
  state: (rs: RootState) => ({
    numCols: rs.numCols,
    numRows: rs.numRows,
    col: rs.col,
    row: rs.row,
  }),
});
