import React = require("react");
import { connect, Dispatchers, actionCreatorsList } from "./connect";
import { RootState, OpCode, CellSelection, OpCodeTypes } from "../types";
import styled from "./styles";
import { isCheating } from "../is-cheating";

import { ContextMenu, MenuItem } from "react-contextmenu";

import SimControls from "./sim-controls";
import Op from "./op";
import EditorHelp from "./editor-help";
import ResultsScreen from "./results-screen";

import Button from "./button";

import CellTypeMenu from "./menus/cell-type-menu";
import EditorMenu from "./menus/editor-menu";
import NameMenu from "./menus/name-menu";
import watching, { Watcher } from "./watching";
import { actions } from "../actions";

const IDEDiv = styled.div`
  width: 100%;
  position: relative;

  &:focus {
    outline: none;

    .cell.selected {
      background-color: #222;
    }
  }
`;

const Ops = styled.div`
  max-height: 600px;
  overflow-y: auto;
`;

const Filler = styled.div`
  flex-grow: 1;
`;

@watching
class IDE extends React.PureComponent<Props & DerivedProps> {
  render() {
    const { showCode, showHelp, hasResults } = this.props;

    return (
      <IDEDiv
        tabIndex={0}
        onKeyUp={this.onKeyUp}
        onKeyDown={this.onKeyDown}
        innerRef={this.onDiv}
        onContextMenu={this.onContextMenu}
      >
        {showHelp ? <EditorHelp /> : null}
        {hasResults ? <ResultsScreen /> : null}
        <SimControls />
        {showCode ? this.renderOps() : <p>Code hidden</p>}
        <CellTypeMenu />
        <EditorMenu />
        <NameMenu />
      </IDEDiv>
    );
  }

  hideHelp = () => {
    this.props.hideHelp({});
  };

  subscribe(w: Watcher) {
    w.on(actions.checkpoint, (store, action) => {
      if (this.divEl) {
        this.divEl.focus();
      }
    });
  }

  onContextMenu = (ev: React.MouseEvent<any>) => {
    ev.preventDefault();
  };

  divEl: HTMLElement;
  onDiv = (divEl: HTMLElement) => {
    this.divEl = divEl;
  };

  focus() {
    if (this.divEl) {
      this.divEl.focus();
    }
  }

  renderOps(): JSX.Element {
    const { pc, code, cellSelection } = this.props;
    let ops = [];
    for (let addr = 0; addr < this.props.code.length; addr++) {
      const op = code[addr];
      let active = addr == pc;
      let selected =
        addr >= cellSelection.start &&
        addr < cellSelection.start + cellSelection.size;
      ops.push(
        <Op
          key={addr}
          op={op}
          addr={addr}
          active={active}
          selected={selected}
          onClick={this.onOpClick}
        />,
      );
    }
    ops.push(<Filler key="filler" />);
    return <Ops className="ops">{ops}</Ops>;
  }

  onOpClick = (ev: React.MouseEvent<HTMLElement>) => {
    const addr = ev.currentTarget.dataset.addr;
    if (addr) {
      let start = parseInt(addr, 10);
      let size = 1;
      if (ev.shiftKey) {
        let prevSel = this.props.cellSelection;
        if (prevSel.size > 0) {
          if (start >= prevSel.start && start < prevSel.start + prevSel.size) {
            // ignore
            return;
          } else {
            if (start > prevSel.start) {
              size = start - prevSel.start + 1;
              start = prevSel.start;
            } else {
              size = prevSel.start + prevSel.size - start;
            }
          }
        }
      }
      this.props.setCellSelection({ start, size });
    }
  };

  onKeyUp = (ev: React.KeyboardEvent<HTMLElement>) => {
    let preventDefault = true;

    if (ev.key == ",") {
      if (isCheating()) {
        this.props.flipper({ side: "left", pressed: false });
      }
    } else if (ev.key == ".") {
      if (isCheating()) {
        this.props.flipper({ side: "right", pressed: false });
      }
    } else {
      preventDefault = false;
      console.log(`key = ${ev.key}`);
    }

    if (preventDefault) {
      ev.preventDefault();
    }
  };

  onKeyDown = (ev: React.KeyboardEvent<HTMLElement>) => {
    if (this.props.showHelp || this.props.hasResults) {
      return;
    }

    const cs = this.props.cellSelection;
    let preventDefault = true;
    if (ev.key == "Delete") {
      this.props.cellClear({});
    } else if (ev.key == " ") {
      this.props.setPaused({ paused: !this.props.paused });
    } else if (ev.key == "+" || ev.key == "PageDown") {
      this.props.stepForward({});
    } else if (ev.key == "Backspace") {
      this.props.cellYank({});
    } else if (ev.key == "x") {
      if (ev.ctrlKey) {
        this.props.cellCut({});
      }
    } else if (ev.key == "X") {
      if (ev.ctrlKey) {
        this.props.cellYank({});
      }
    } else if (ev.key == "c") {
      if (ev.ctrlKey) {
        this.props.cellCopy({});
      }
    } else if (ev.key == "v") {
      if (ev.ctrlKey) {
        this.props.cellPaste({});
      }
    } else if (ev.key == "V") {
      if (ev.ctrlKey) {
        this.props.cellPasteInsert({});
      }
    } else if (ev.key == "z") {
      if (ev.ctrlKey) {
        this.props.undo({});
      }
    } else if (ev.key == "F7") {
      this.props.saveState({});
    } else if (ev.key == "F8") {
      this.props.loadState({});
    } else if (ev.key == "Home") {
      this.props.reset({});
    } else if (ev.key == "Insert") {
      this.props.cellPasteInsert({});
    } else if (ev.key == "d") {
      if (ev.ctrlKey) {
        this.props.cellDuplicate({});
      }
    } else if (ev.key == "h" || ev.key == "ArrowLeft") {
      this.props.setCellSelection({ start: cs.start - 1, size: 1 });
    } else if (ev.key == "l" || ev.key == "ArrowRight") {
      this.props.setCellSelection({ start: cs.start + 1, size: 1 });
    } else if (ev.key == "G") {
      this.props.cellSetType({ type: "goto" });
    } else if (ev.key == "M") {
      this.props.cellSetType({ type: "motor" });
    } else if (ev.key == "F") {
      this.props.cellSetType({ type: "freq" });
    } else if (ev.key == ",") {
      if (isCheating()) {
        this.props.flipper({ side: "left", pressed: true });
      }
    } else if (ev.key == ".") {
      if (isCheating()) {
        this.props.flipper({ side: "right", pressed: true });
      }
    } else {
      preventDefault = false;
      console.log(`key = ${ev.key}`);
    }

    if (preventDefault) {
      ev.preventDefault();
    }
  };
}

interface Props {}

const actionCreators = actionCreatorsList(
  "floaty",
  "setCellSelection",
  "cellYank",
  "cellClear",
  "cellCut",
  "cellCopy",
  "cellPaste",
  "cellPasteInsert",
  "undo",
  "cellDuplicate",
  "cellSetType",
  "setPaused",
  "stepForward",
  "reset",
  "hideHelp",
  "flipper",
  "saveState",
  "loadState",
);

type DerivedProps = {
  pc: number;
  code: OpCode[];
  showCode: boolean;
  showHelp: boolean;
  paused: boolean;
  cellSelection: CellSelection;
  hasResults: boolean;
} & Dispatchers<typeof actionCreators>;

export default connect<Props>(IDE, {
  actionCreators,
  state: (rs: RootState) => ({
    pc: rs.simulation.machineState.pc,
    code: rs.simulation.code,
    paused: rs.simulation.paused,
    showCode: rs.ui.showCode,
    showHelp: rs.ui.showHelp,
    cellSelection: rs.ui.cellSelection,
    hasResults: !!rs.simulation.results,
  }),
});
