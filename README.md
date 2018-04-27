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

### Code structure

If you're going to be writing code, you'll need to read the [Code structure documentation](./docs/code-structure.md).

### Maps

Read how maps work, how to make a new map and add it to the game in the [Maps documentation](./docs/maps.md).

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
