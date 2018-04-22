import * as React from "react";
import { Floaty } from "../types";
import styled from "./styles";
import { animations } from "./styles";
import { connect, actionCreatorsList, Dispatchers } from "./connect";

const FloatyDiv = styled.div`
  position: fixed;
  animation: ${animations.floatUp} 1s normal forwards ease-in-out;

  color: rgb(220, 100, 100);
  text-shadow: 0 0 1px rgb(255, 255, 255);
  pointer-events: none;
  font-size: ${props => props.theme.fontSizes.larger};
`;

class FloatyComponent extends React.PureComponent<Props & DerivedProps> {
  render() {
    const { floaty } = this.props;
    let style: React.CSSProperties = {
      left: floaty.clientX - 40,
      top: floaty.clientY - 40,
    };
    return <FloatyDiv style={style}>{floaty.text}</FloatyDiv>;
  }

  componentDidMount() {
    // this is plain awful, don't read
    setTimeout(() => {
      this.props.floatyKill({ id: this.props.id });
    }, 1000);
  }
}

interface Props {
  id: string;
  floaty: Floaty;
}

const actionCreators = actionCreatorsList("floatyKill");

type DerivedProps = {
  page: string;
} & Dispatchers<typeof actionCreators>;

export default connect<Props>(FloatyComponent, { actionCreators });
