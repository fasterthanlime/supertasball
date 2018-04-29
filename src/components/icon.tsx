import React = require("react");

export default class Icon extends React.PureComponent<Props> {
  render() {
    const { icon, className = "", ...rest } = this.props;
    return <span className={`icon icon-${icon} ${className}`} {...rest} />;
  }
}

interface Props {
  icon: string;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLSpanElement>;
}
