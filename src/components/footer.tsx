import React = require("react");
import { connect, Dispatchers, actionCreatorsList } from "./connect";
import { RootState, Unlocked } from "../types";
import Button from "./button";
import Icon from "./icon";
import version from "../version";
import styled from "./styles";
import TimeAgo from "react-timeago";

const FootersDiv = styled.div`
  display: flex;
  flex-direction: row;

  align-items: center;

  border-top: 1px solid #777;
  margin-top: 30px;
  padding: 20px 0;

  a,
  a:visited {
    color: rgb(180, 80, 80);
    text-decoration: none;
  }
`;

const Filler = styled.div`
  flex-grow: 1;
`;

const Spacer = styled.div`
  width: 0.4em;
`;

class Footer extends React.PureComponent<Props & DerivedProps> {
  render() {
    const { money, freq, codeSize, unlocked } = this.props;

    return (
      <FootersDiv>
        An<Spacer />
        <a href={repoUrl}>open-source</a>
        <Spacer /> game by<Spacer />
        <a href={orgUrl}>the Super TASball team</a>
        <Filler />
        <Icon icon="github" />
        <Spacer />
        <a href={commitUrl()}>{formatCommit(version.commit)}</a>
        <Spacer />
        deployed<Spacer />
        <TimeAgo date={version.deployedAt} />
      </FootersDiv>
    );
  }

  renderContributors() {
    const contributors = [
      "fasterthanlime",
      "s_standke",
      "davemakes",
      "geckojsc",
      "newobj",
    ];
    return (
      <>
        {contributors.map((name, i) => {
          return (
            <>
              <Spacer />
              <a key={name} href={`https://twitter.com/${name}`}>
                {name}
              </a>
              {i < contributors.length - 1 ? <>,</> : null}
            </>
          );
        })}
      </>
    );
  }

  onShowAchievements = () => {
    this.props.showAchievements({});
  };
}

interface Props {}

const actionCreators = actionCreatorsList("showAchievements");

type DerivedProps = {
  money: number;
  freq: number;
  codeSize: number;
  unlocked: Unlocked;
} & Dispatchers<typeof actionCreators>;

export default connect<Props>(Footer, {
  actionCreators,
  state: (rs: RootState) => ({
    version: typeof version,
  }),
});

const orgUrl = "https://github.com/supertasball";
const repoUrl = `${orgUrl}/supertasball`;
function commitUrl(): string {
  return `${repoUrl}/commit/${version.commit}`;
}

function formatCommit(sha1: string): string {
  return sha1.substr(0, 7);
}
