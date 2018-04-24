import { Dispatchers, actionCreatorsList, connect } from "./connect";
import Button from "./button";
import Icon from "./icon";
import React = require("react");
import styled from "./styles";

const EditorHelpDiv = styled.div``;

const Contents = styled.div`
  max-height: 500px;
  overflow-y: auto;

  i {
    border: 1px solid #555;
    border-radius: 2px;
    padding: 2px;
    font-size: 80%;
    font-style: normal;
  }
`;

const Header = styled.h1`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Filler = styled.div`
  flex-grow: 1;
`;

class EditorHelp extends React.PureComponent<Props & DerivedProps> {
  render() {
    return (
      <EditorHelpDiv>
        <Header>
          Editor help<Filler />
          <Button icon="x" onClick={this.hideHelp} />
        </Header>
        <Contents>
          <h3>Basic edition</h3>
          <p>
            Each cell represents an instruction. Execution is performed from
            left to right and top to bottom, and wraps around.
          </p>
          <p>
            Change the type of an instruction by right-clicking the symbol in
            the middle of a cell.
          </p>
          <p>
            Change the parameters of an instruction by right-clicking the
            relevant corners.
          </p>

          <h4>Example</h4>
          <p>
            To turn a flipper off:
            <ul>
              <li>Change the type to 'Motor'</li>
              <li>
                Right click the green <Icon icon="check" /> to change it to a
                red <Icon icon="x" />
              </li>
            </ul>
          </p>
          <p>
            Similarly, to change which flipper is affected, right-click the name
            of the flipper on the bottom-right corner.
          </p>

          <h3>Keyboard shortcuts</h3>
          <p>
            Clicking on a cell will select it. Shift-clicking on another cell
            will expand the selection to contain those two cells and any cells
            in between.
          </p>
          <p>
            <i>Ctrl</i>+<i>z</i> will undo. There is no redo.
          </p>
          <p>
            <i>Ctrl</i>+<i>x</i> will cut all selected cells (replacing them
            with nops).
          </p>
          <p>
            <i>Ctrl</i>+<i>Shift</i>+<i>x</i> will cut all selected cells,
            ofsetting all cells after as if you'd physically cut with scissors.
          </p>
          <p>
            <i>Ctrl</i>+<i>c</i> will copy all selected cells.
          </p>
          <p>
            <i>Ctrl</i>+<i>v</i> will paste the contents of the clipboard
            in-place (replacing previous contents)
          </p>
          <p>
            <i>Ctrl</i>+<i>Shift</i>+<i>v</i> will insert-paste the contents of
            the clipboard.
          </p>
          <p>
            <i>Shift</i>+<i>:KEY</i> will set the instruction type to MOTOR for{" "}
            <i>M</i>, to FREQ for <i>F</i>, and so on.
          </p>
          <p>
            <i>Del</i> and <i>Backspace</i> will set all selected cells to NOP.
          </p>
          <p>
            <i>Space</i> will play & pause the simulation.
          </p>
          <p>
            <i>←</i> and <i>→</i> will select the previous and next
            instructions, respectively.
          </p>
          <p>
            <i>+</i> or <i>Page Down</i> will step one instruction forward.
          </p>

          <h3>Instructions</h3>
          <p>
            All instructions take one clock cycle. The clock speed ranges from
            2Hz (at the beginning of the game), which is 2 instructions per
            second, to 60Hz (with a fully upgraded CPU).
          </p>

          <h4>The NOP instruction</h4>
          <p>The NOP instruction doesn't do anything.</p>

          <h4>The MOTOR instruction</h4>
          <p>
            The motor instruction controls one of the flippers, activating or
            deactivating its servo motor.
          </p>

          <h4>The GOTO instruction</h4>
          <p>
            It jumps unconditionally to another place in the code. You can use
            it to create loops which are shorter than the available ROM size.
          </p>
          <p>
            GOTOs will only be executed if they point to a valid label. To set
            the label for a cell, right click it and pick 'Set label...'
          </p>
          <p>
            Conditional jumps were originally planned but hey 72 hours is short
            when you reach the end!
          </p>

          <h4>The FREQ instruction</h4>
          <p>
            It changes the frequency at which the CPU operates. Any value from
            1Hz to the maximum currently available will be set. Other values
            will be ignored.
          </p>

          <h4>The NOTE instruction</h4>
          <p>There are four channels to play notes in.</p>
          <p>
            The frequency is the height of the note, see{" "}
            <a
              href="https://pages.mtu.edu/~suits/notefreqs.html"
              target="_blank"
            >
              this handy table
            </a>{" "}
            for reference.
          </p>
          <p>
            Don't forget to turn off a note or it'll keep playing until paused.
          </p>
        </Contents>
      </EditorHelpDiv>
    );
  }

  hideHelp = () => {
    this.props.hideHelp({});
  };
}

interface Props {}

const actionCreators = actionCreatorsList("hideHelp");

type DerivedProps = {} & Dispatchers<typeof actionCreators>;

export default connect<Props>(EditorHelp, {
  actionCreators,
});
