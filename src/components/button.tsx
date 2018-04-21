import styled from "./styles";
import React = require("react");

const ButtonDiv = styled.div`
  display: inline-block;
  padding: 6px 8px;
  margin: 4px;
  background: white;
  border-radius: 2px;
  background: #333;
  color: #eee;
  box-shadow: 1px 1px 0 #777;
  border: 1px solid #444;

  &:hover {
    background: #444;
    border-color: #333;
    cursor: pointer;
  }

  .icon {
    font-size: 20px;
  }
`;

// like it's '99!
const Spacer = styled.div`
  display: inline-block;
  width: 4px;
  height: 1px;
`;

export default class Button extends React.PureComponent<Props> {
  render() {
    const { icon, children, ...rest } = this.props;

    return (
      <ButtonDiv {...rest}>
        {icon ? (
          <>
            <span className={`icon icon-${icon}`} />
            {children && children.length > 0 ? <Spacer /> : null}
          </>
        ) : null}
        {children}
      </ButtonDiv>
    );
  }
}

interface Props {
  icon?: string;
  children?: any;
  onClick?: (e: React.MouseEvent<any>) => void;
}
