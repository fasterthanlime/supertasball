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
  custom: {
    name: "Custom map",
    svg: null,
  },
};

export type MapName = keyof typeof mapDefs;

export const orderedMaps: MapName[] = ["knucklePanini", "ssss", "bearCandy"];
