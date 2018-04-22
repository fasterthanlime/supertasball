import styled from "./styles";
import React = require("react");
import classNames = require("classnames");

let bg = "#333";
let bg2 = "#77a";

const ButtonDiv = styled.div`
  padding: 6px 8px;
  margin: 3px 5px;
  border-radius: 2px;
  background: ${bg};
  color: #eee;
  box-shadow: 1px 1px 0 #777;
  border: 1px solid #444;

  display: flex;
  flex-direction: row;
  align-items: center;

  font-size: ${props => props.theme.fontSizes.larger};

  user-select: none;

  &:not(.disabled):not(.progressing):hover {
    background: #444;
    border-color: #333;
  }

  &.disabled {
    cursor: not-allowed;
    filter: grayscale(100%) brightness(60%);
  }

  &.progressing {
    border-color: ${bg2};
    &:hover {
      cursor: progress;
    }
  }

  .icon {
    font-size: 20px;
  }

  &.large .icon {
    font-size: 30px;
  }
`;

// like it's '99!
const Spacer = styled.div`
  display: inline-block;
  width: 8px;
  height: 1px;
`;

export default class Button extends React.PureComponent<Props> {
  render() {
    const { icon, children, progress, disabled, large, ...rest } = this.props;

    let style: React.CSSProperties = {};
    if (progress > 0) {
      let perc = progress * 100;
      style.backgroundImage = `linear-gradient(to right, ${bg2} 0%, ${bg2} ${perc}%, ${bg} ${perc}%)`;
    }

    return (
      <ButtonDiv
        style={style}
        {...rest}
        className={classNames({ disabled, progressing: progress > 0, large })}
      >
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
  progress?: number;
  disabled?: boolean;
  large?: boolean;
}
