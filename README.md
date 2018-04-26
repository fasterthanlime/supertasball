# Super TASball

[![Build Status](https://travis-ci.org/supertasball/supertasball.svg?branch=master)](https://travis-ci.org/supertasball/supertasball)
[![Quality gate](https://sonarcloud.io/api/project_badges/measure?project=supertasball&metric=alert_status)](https://sonarcloud.io/dashboard?id=supertasball)
![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)

An open-source, tool-assisted pinball idle game.

* Play here: https://supertasball.amos.me/

## How to play

Check out the [video tutorial](https://www.youtube.com/watch?v=c2lE4DDl5P0).

## Contribution model

This project uses the [pull request hack](http://felixge.de/2013/03/11/the-pull-request-hack.html).

**If you submit a pull request, we'll give you commit access.**

Additionally, the game is deployed every 5 minute.

## License

Super TASball is released under the MIT license, see the [LICENSE](./LICENSE) file.

## What is it built with?

* [TypeScript](http://www.typescriptlang.org/), [React](https://www.npmjs.com/package/react), Redux
* [jsxm](https://github.com/a1k0n/jsxm/) plays modules from [The Mod Archive](http://modarchive.org)
* [planck.js](https://github.com/shakiba/planck.js) for the pinball physics
* [PixiJS](https://github.com/pixijs/pixi.js) for the WebGL/canvas display

Super TASball is:

* a static website hosted on a tiny [Scaleway](https://www.scaleway.com/) instance
* served over HTTP/2 via Nginx ([config file](./nginx/site.conf)) and [Let's Encrypt](http://letsencrypt.org/)
* deployed every 5 minutes via Ansible ([config file](./local.yml))

## Developing Super TASball

* Make sure you have [Node.js](https://nodejs.org/en/) 9.x or above.
* Clone the repository
* Run `npm i` to install dependencies
* Run `node fuse.js` to start the development server

In development, the game is served at <http://localhost:4444>

### Maps

Each map is an `.svg` file with custom metadata. Only certain SVG
features are supported, keep reading to discover which.

For a map to be picked up by the game, it mumst be listed in [map-defs.ts](./src/map-defs.ts).

#### Making maps

You will need:

* [Inkscape](https://inkscape.org/en/)
* [Inkscape apply transforms](https://github.com/Klowner/inkscape-applytransforms) extensions.

#### Properties

A level is a SVG document consisting of only **paths** (no curves!) and **circles**.

You can define the behaviour of objects by putting tags and properties in the _description_ field, e.g.

![image showing a tagged flipper object](https://user-images.githubusercontent.com/7998310/39317278-793523d4-497b-11e8-87c6-85feebe82ed1.png)

Press `Ctrl+Shift+O` to open the "Object properties" pane.

#### What you can do

To make a new map, **copy an existing one and save it under a new name**.

_This lets you re-use the left and right flippers. Also, if it's your first map, you can peek at the node descriptions to see what's available._

You can have as many left and right flippers as you want

You can have as many balls as you want (`#ball`, must be a circle).

You can have many `#collect` (collectible) groups as you want, and
you can specify the points the player will get when hitting one of them
(`singlePoints`) and when hitting all of them (`comboPoints`):

![image showing a collectible group with points specified](https://user-images.githubusercontent.com/7998310/39317236-63c15fe0-497b-11e8-92b9-a619425dfb27.png)

You can have circles (`F5`, press control and drag to maintain a
1:1 aspect ratio), and straight lines paths (`Shift+F6`, don't drag
because curves aren't supported, just place points and hit `Enter` when
you're done),

Strokes and fills are supported to some extent, although handling
is a bit wonky/hardcoded.

#### What you can't do

* **Curves** are not supported. If any paths contain curves,
  they'll show up as straight paths.
* **Text elements** are not supported at all.
* **Ellipses** are treated like circle (using the horizontal radius)
* No gradients, no masks, no nothing. We don't use the browser's
  SVG renderer so only a minimal set of features is supported :)

#### If things are in the wrong place

...then you need the Inkscape "Apply transforms" plugin.

Once [installed](https://github.com/Klowner/inkscape-applytransforms), you can use it from this menu:

![](https://user-images.githubusercontent.com/7998310/39317565-2f069cd8-497c-11e8-96e9-c872b556418f.png)

#### Cheat mode: trying out your map

If you add `?cheat` to the game's URL ([link for the lazy](https://supertasball.amos.me/?cheat)), you'll start with $30K, and
there'll be an .svg drop zone:

![](https://user-images.githubusercontent.com/7998310/39322247-8241c96a-4989-11e8-8b98-505f3d3032f6.png)

If you drop an .svg on there, you'll be able to test your map

#### Submitting maps

Ideally, you'd open a pull request with the .svg file added and
it listed in `map-defs.ts`, but if that's too much work, you
can open an issue and attach the .svg file - hopefully one of the
contributors will add it!

### Soundtrack

The soundtrack is a collection of [.XM files](<https://en.wikipedia.org/wiki/XM_(file_format)>) in the `src/tracks/` folder, mostly collected from [The Mod Archive](https://modarchive.org/).

For a track to be picked up by the game, it must be listed
in [track-list.ts](./src/track-list.ts).

### CPU instructions

Instruction types are listed in [types.ts](./src/types.ts). Editor
controls are inferred automatically from this definition, so you don't
have to mess with the UI at all.

Their effects are implemented in [reactors/sim.ts](./src/reactors/sim.ts) and
to a lesser degree, in [reducers/simulation.ts](./src/reducers/simulation.ts).

### Unlocks and expenses

Unlocks are listed in [unlocks.ts](./src/unlocks.ts). The `effects`
field is a partial version of `ResourcesState` - when something is
unlocked, the specified resource fields are overwritten (see the resources reducer).

For unlocks to be available in the clicker/idle part of the game, a corresponding expense must exist in [expenses.ts](./src/expenses.ts).
Expenses can be hidden until one or more unlocks have been... unlocked, via the `requires` field.
