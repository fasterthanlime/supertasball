export interface MapDef {
  name: string;
  svg: string;
}

export interface MapDefs {
  [key: string]: MapDef;
}

export const mapDefs: MapDefs = {
  bear: {
    name: "Bear Candy",
    svg: require("./maps/bear.svg"),
  },
  add: {
    name: "Knuckle Panini",
    svg: require("./maps/add.svg"),
  },
  distributor: {
    name: "Sssssssss",
    svg: require("./maps/distributor.svg"),
  },
};

export type MapName = keyof typeof mapDefs;

export const orderedMaps: MapName[] = ["add", "distributor", "bear"];
