import { darken, lighten, transparentize } from "polished";

// colors

export const baseColors = {
  codGray: "#1d1c1c",
  darkMineShaft: "#2e2b2c",
  lightMineShaft: "#383434",
  zambezi: "#5d5757",
  silverChalice: "#a0a0a0",
  swissCoffee: "#dad2d2",
  ivory: "#fffff0",

  flushMahogany: "#d14343",
  mintJulep: "#efeebf",
  gossip: "#b9e8a1",

  shamrock: "#24c091",
  amber: "#ffc200",
  heliotrope: "#c17dff",

  carnation: "#fa5c5c",
  vividTangerine: "#ff8080"
};

export const uiColors = {
  background: "#2d2b2b",

  border: "#404040",
  borderFocused: "#676767",

  // FIXME: no pure blacks
  textShadow: "#000000",
  boxShadow: "#1b1919"
};

const breadBackground = darken(0.05, "#292727");
const itemBackground = "#2b2a2a";

export const colors = {
  accent: baseColors.carnation,
  lightAccent: baseColors.vividTangerine,

  error: baseColors.flushMahogany,
  warning: baseColors.mintJulep,
  success: baseColors.gossip
};

export const fontSizes = {
  baseText: "16px",
  larger: "20px",
  enormous: "32px"
};

export const theme = {
  ...colors,
  baseColors,
  fontSizes
};

export type Theme = typeof theme;
export interface IThemeProps {
  theme: Theme;
}

import * as styledComponents from "styled-components";
import { ThemedStyledComponentsModule } from "styled-components";
const {
  default: styled,
  css,
  injectGlobal,
  keyframes,
  ThemeProvider
} = (styledComponents as any) as ThemedStyledComponentsModule<Theme>;
// this tiny workaround brought to you by
// this line in the styled-components typings:
// export const ThemeProvider: ThemeProviderComponent<object>;

export default styled;
export { css, injectGlobal, keyframes, ThemeProvider };
