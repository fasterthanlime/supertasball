export interface MapDef {
  name: string;
  svg: string;
}

export interface MapDefs {
  [key: string]: MapDef;
}

export const mapDefs: MapDefs = {
  bearCandy: {
    name: "Bear Candy",
    svg: require("./maps/bearCandy.svg"),
  },
  knucklePanini: {
    name: "Knuckle Panini",
    svg: require("./maps/knucklePanini.svg"),
  },
  ssss: {
    name: "Ssss...",
    svg: require("./maps/ssss.svg"),
  },
  chalice: {
    name: "Chalice",
    svg: require("./maps/chalice.svg"),
  },
  pitcher: {
    name: "Pitcher",
    svg: require("./maps/pitcher.svg"),
  },
  bedtime: {
    name: "Bedtime",
    svg: require("./maps/bedtime.svg"),
  },
  custom: {
    name: "Custom map",
    svg: null,
  },
};

export type MapName = keyof typeof mapDefs;

export const orderedMaps: MapName[] = [
  "knucklePanini",
  "ssss",
  "bearCandy",
  "chalice",
  "pitcher",
  "bedtime",
];
