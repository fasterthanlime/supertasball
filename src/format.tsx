import * as React from "react";
import styled from "./components/styles";

const MoneySpan = styled.div`
  display: inline-block;
  font-weight: bold;
  margin: 0 0.3em;

  color: #fbdb5d;
`;

interface FormatMoneyOpts {
  before?: string;
}

export function formatMoney(
  money: number,
  opts: FormatMoneyOpts = {},
): JSX.Element {
  return (
    <MoneySpan>
      {opts.before}$
      {formatAmount(money)}
    </MoneySpan>
  );
}

export function formatAmount(money: number): string {
  return (Math.floor(money * 10) / 10).toLocaleString();
}
