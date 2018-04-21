import React = require("react");

export default class Icon extends React.PureComponent<{ icon: string }> {
  render() {
    const { icon } = this.props;
    return <span className={`icon icon-${icon}`} />;
  }
}
