import { Track } from "./types";

export function loadTracks(): Track[] {
  return [
    {
      artist: "lemonade",
      title: "Canon pour deux",
      url: require("./tracks/canonPourDeux.xm").default,
    },
    {
      artist: "Ultrasyd",
      title: "CristallizdRezonance",
      url: require("./tracks/crzn.xm").default,
    },
    {
      artist: "Ultrasyd",
      title: "Digital Adventures",
      url: require("./tracks/digital.xm").default,
    },
    {
      artist: "Ultrasyd",
      title: "Get a life",
      url: require("./tracks/getALife.xm").default,
    },
    {
      artist: "Ultrasyd",
      title: "Fed Up With ELISA (Groovy)",
      url: require("./tracks/groovyElisa.xm").default,
    },
    {
      artist: "lemonade",
      title: "Amaretto Sour",
      url: require("./tracks/lemonadeAmarettoSour.xm").default,
    },
    {
      artist: "lemonade",
      title: "BBQ with Mosquitoes",
      url: require("./tracks/lemonadeBbq.xm").default,
    },
    {
      artist: "lemonade",
      title: "Snowmelt",
      url: require("./tracks/lemonadeSnowmelt.xm").default,
    },
    {
      artist: "Ultrasyd",
      title: "Toy World is on fire",
      url: require("./tracks/toyWorld.xm").default,
    },
    {
      artist: "Ultrasyd",
      title: "Pizza",
      url: require("./tracks/ultrasydPizza.xm").default,
    },
    {
      artist: "fender",
      title: "|- sunlight -|",
      url: require("./tracks/sunlight.xm").default,
    },
  ];
}
