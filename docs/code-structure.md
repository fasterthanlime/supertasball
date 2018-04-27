# Code structure

Super TASball is structured like many React / Redux app, with a little
addition called "reactors" for side-effects

Throughout this document, we'll be playing Simon says. Simon is
an has 100% insight on how to best structure an application like Super TASball.

So when we do something, it's not because anyone on the team said it, it's
because Simon, the all-knowing ethereal being, said so.

### Indentation & formatting

> Simon says: Don't bicker about code indentation and formatting because
> [prettier](https://github.com/prettier/prettier) knows best.

Save valuable time by installing a prettier extension for your code
editor (VSCode has a good one, just search for it in "Install packages...")
and enabling format on save.

You'll be surprised the it saves to be
able to write _just code_ without worrying about its shape, hitting save,
and having it be beautifully laid out for you.

> Be careful: vim-prettier has a different set of defaults, for some
> reason.

**Even if you don't setup your edidtor properly**, there's a pre-commit
hook that formats all staged files, so you really can't miss.

### React basics

> Simon says: React lets you semi-declaratively specify what to render
> given a set of props.

For example, icons in the game are shown with the following markup:

```html
<span className="icon icon-github"/>
```

But the fact that they're spans, and that they have a className of a
specific format is an implementation detail. So we can hide that in an
Icon component, that takes an `icon` prop, so that we can use it
like that:

```html
<Icon icon="github"/>
```

The `Icon` component can be implemented like so:

```tsx
import React = require("react");

export default class Icon extends React.PureComponent<Props> {
  render() {
    const { icon } = this.props;

    return <span className={`icon icon-${icon}`} />;
  }
}

interface Props {
  icon: string;
}
```

Let's analyze this line by line:

```tsx
import React = require("react");
```

> Simon says: React is not an ES2015 module, so we need to use that old
> syntax. This is not the same as `const React = require("react")`, which would
> make `React` of type `any` and we'd lose any typing information.

```tsx
export default class Icon extends React.PureComponent<Props> {
```

`Icon` is a class, it's a React component that takes the props
in the `Props` type defined later. Additionally, it's a **pure** React
component (all our components should be pure), which means React will do
a shallow comparison of props to determine if the component should be
updated or not.

**See the [React docs](https://reactjs.org/docs/react-api.html#reactpurecomponent) for more info**.

```tsx
  render() {
```

All React components have a render method - it returns a `JSX.Component` or
null. If we wanted to return several HTML elements, we could wrap them in
a fragment, for example:

```tsx
   render () {
     return (
       <>
          <h3>In this house...</h3>
          <p>...we use fragments</p>
       </>
     );
   }
```

On the next line, we use a [destructuring assignment](https://basarat.gitbooks.io/typescript/docs/destructuring.html) to grab the
subset of the props we're immediately interested in:

```tsx
const { icon } = this.props;
```

Then we just return some React-TypeScript markup. Note that our file
needs to end in `.tsx`, (not just `.ts`) for us to be able to write HTML
tags like that:

```tsx
return <span className={`icon icon-${icon}`} />;
```

For simple react props, we can just do `<a href="https://example.org"/>`, but
here we're using [template strings](https://basarat.gitbooks.io/typescript/docs/template-strings.html) to dynamically generate the class name. Any computed/non-string value in TSX must be wrapped in curly braces.

For example, the `style` prop (valid for all HTMLElement(s)) is an object,
so it must be wrapped in curly braces:

```tsx
// there's few reasons to use inline styles like that -
// this is not one of them!
return <span style={{ color: "red" }}>IAMA red span AMA</span>;
```

And that's it! Now we can re-use `Icon` as many times as we want. If
we render it once with a certain value for its `icon` prop, and then
with another value, it'll re-render. However, no matter how many times
we re-render it with the same value, it'll keep using the same DOM element.

### Styled components

> Simon says: Instead of writing CSS in separate files, styles live near their components
> thanks to `styled-components`.

A basic outline of the style, including typical colors and font sizes, lives in
[styles.tsx](../src/components/styles.tsx).

Its default export, `styled`, lets us use this weird-looking construct:

```tsx
import React = require("react");
import styled from "./styles";

const ButtonDiv = styled.div`
  border: 3px solid red;
  font-size: ${props => props.theme.fontSizes.larger};
`;
```

And then we can use it in one of our components:

```tsx
render() {
  return <ButtonDiv>I'm a button!</ButtonDiv>
}
```

In a `styled.div` (or `styled.span`, or `styled.ul`, or `styled(SomeComponent)`, etc.) we can
use some CSS features of the future, like nested selectors:

```tsx
const ButtonDiv = styled.div`
  border: 3px solid red;
  font-size: ${props => props.theme.fontSizes.larger};

  &.fat {
    border-width: 8px;
  }

  &:hover {
    cursor: pointer;
  }
`;
```

> Note: The `vscode-styled-components` extension colorizes the CSS
> inside these template strings. So it's almost as friendly as writing
> regular CSS!

### React: more tips

> Simon says: If you need to turn a list into components, you need to give them a `key`.

In the past React would give a warning, now it'll just
completely misbehave if you miss it.

> Simon says: keep your browser console open. React will regularly shame you about what you're doing wrong.

So this won't work:

```tsx
render() {
  const list = ["apples", "oranges", "grapes"];
  // DON'T DO THIS
  return (
    <ul>
      {list.map((fruit) => <li>{fruit}</li>)}
    </ul>
  );
}
```

But this will:

```tsx
render() {
  const list = ["apples", "oranges", "grapes"];
  // Do this instead
  return (
    <ul>
      {list.map((fruit) => <li key={fruit}>{fruit}</li>)}
    </ul>
  );
}
```

But what to pick as the key? It should be a unique identifier
for the object - in this case, they're just strings so that works out
fine. If they were more complicated objects, we'd pick a field that is
different for every object (typically `id`, but that doesn't exist everywhere).

> Simon says: don't use the array index as a `key` because that makes
> a bunch of DOM optimizations not work. You're just making the browser
> struggle for no good reason.

### Redux basics

Simon says: the store is the _single source of truth_ of your application state. Our whole application state fits in the type `RootState` (specified
in `types.ts`) - which is a whole tree, like so:

```tsx
interface RootState {
  ui: { // UIState
    tracks: Track[];
    // etc.
  }
  resources: ResourcesState { /* ... */ }
  simulation: SimulationState { /* ... */ }
}
```

Simon says: the application state can only be modified by dispatching actions. **Reducers** take an action and return the modified state.

In Super TASball, we have special reducer helpers that allow us to
write this very nicely. A very dump UI reducer (`reducers/ui.ts`) would
look like this:

```tsx
import reducer from "./reducer";
import * as actions from "./actions.ts";
import { UIState } from "./types.ts";

const initialState = {
  showHelp: false,
};

export default reducer<UIState>(initialState, on => {
  on(actions.showHelp, (state, action) => {
    return { ...state, showHelp: true };
  });
});
```

Note that the state we return can't be shallow-equal, or our
pure react components won't update.

Never do this:

```tsx
on(actions.showHelp, (state, action) => {
  // !!! NEVER DO THIS !!!
  state.showHelp = true;
  return state;
});
```

Always do this:

```tsx
on(actions.showHelp, (state, action) => {
  return { ...state, showHelp: true };
});
```

Which is equivalent to this:

```tsx
on(actions.showHelp, (state, action) => {
  return Object.assign({}, state, { showHelp: true });
});
```

Which is equivalent to this:

```tsx
on(actions.showHelp, (state, action) => {
  const newState = ({} as any) as IUIState;
  for (const key of Object.keys(state)) {
    newState[key] = state[key];
  }
  newState.showHelp = true;
  return newState;
});
```

But seriously, just use the [spread operator](https://basarat.gitbooks.io/typescript/docs/spread-operator.html) for clean and concise code.

### Using application state in components

> Simon says: there are two types of components: `Smart` components and `Dumb` components.

The `Icon` component we made above was dumb. It worked all from props and didn't
to know about application state at all.

But we also need some smart components. For example, some part of the application
should decide whether to show the help or not. For that, we need the help of `connect`.

```tsx
import React = require("react");
import { RootState } from "./types";
// react-redux also exports a connect function, but don't use that one,
// use Simon's, because Simon knows best.
import { connect } from "./connect";

// note that we do not 'export default' here - this is the
// unconnected variant of game, we export it later
class Game extends React.PureComponent<Props & DerivedProps> {
  render() {
    const { showHelp } = this.props;
    return (
      <div>
        <h3>Hello this is a game</h3>
        {showHelp ? <Help /> : null}
        <Simulation />
      </div>
    );
  }
}

// it turns out Game has no non-derived props. that's ok.
// maybe later it'll need some, so let's keep it as an empty
// interface for now
interface Props {}

interface DerivedProps {
  showHelp: boolean;
}

// we specify Props explicitly here because DerivedProps should
// not be specified when using game.
export default connect<Props>(Game, {
  state: (rs: RootState) => ({
    showHelp: rs.ui.showHelp,
  }),
});
```

Now, whenever `showHelp` changes in the application state (which might happen
any time an action is dispatched), `Game` will get re-rendered with its new
value.

> Simon says: Don't require store from a component. Use `connect` always.
> `connect` wishes you only good.

### Dispatching actions from components

> Simon: if you want to change the state from a component, you'll have to dispatch
> an action. If you want to dispatch an action, you'll need to use `connect` as well.

Actions are defined in `actions.ts`. We're using some TypeScript magic to re-use
the structure of action fields in a lot of places (reducers, reactors, connect, etc.)
so it might look different from what you're used to in other redux projects.

If we only had one action, it would look like this:

```tsx
export const actions = wireActions({
  setHelpShown: action<{ shown: boolean }>(),
});
```

Action creators are typically imported in bulk using a star/wildcard import.
They're just functions that take an object and return an action.

```tsx
import * as actions from "./actions";

// all type-checked + autocompleted, because `setHelpShown` is well-typed.
const action = actions.setHelpShown({ shown: true });

// this is what gets passed around. pretty simple!
assert.deepEqual(action, {
  type: "setHelpShown",
  payload: {
    shown: true,
  },
});
```

In reactors, we just dispatch actions with `store.dispatch`. This
simple reactor performs an http request asynchronously, and dispatches
another action with the result:

```tsx
import { Watcher } from "../watcher";
import * as actions from "../actions";

export default function(w: Watcher) {
  w.on(actions.showVersionRequest, async (store, action) => {
    // note that store and action are both well typed,
    // so `action.payload` is typechecked and has autocompletion.
    const data = await request("/version.json");
    // ideally we'd like some error handling here :)
    const version = JSON.parse(data).versionString;
    store.dispatch(actions.showVersion({ version }));
    // showVersion would typically be handled in a reducer
    // and change the application's state
  });
}
```

But **in components** we don't have a reference to store. What do?

> Simon says: don't overthink it, look at other components to grasp how it works.

Let's write a component that enables showing the help:

```tsx
import React = require("react");
// we import a bunch more stuff this time
import { connect, actionCreatorsList, Dispatchers } from "./connect";

// note that we do not 'export default' here - this is the
// unconnected variant of game, we export it later
class ShowHelpButton extends React.PureComponent<Props & DerivedProps> {
  render() {
    // we don't use a closure here, instead we refer to the bound
    // member function "onClick". This helps with performance.
    return <Button onClick={this.onClick}>Show help!</Button>;
  }

  // notice this isn't `onClick() {` - we need the `= () =>`
  // to bind the function to this particular instance of ShowHelpButton.
  onClick = () => {
    // setHelpShown is a dispatcher, bound to the store passed
    // wayyyyyy up the component hierarchy and propagated via
    // the React context.
    const { setHelpShown } = this.props;
    setHelpShown({ shown: true });
  };
}

// no real props, that's ok
interface Props {}

// we can pass as many arguments to `actionCreatorsList` as we want,
// they're all strings but the typescript compiler makes sure they're
// all valid action types.
const actionCreators = actionCreatorsList("setHelpShown");

// DerivedProps is no longer an interface, it's a type union.
// The Dispatchers<...> trick makes it so we don't have to list
// all dispatchers manually.
type DerivedProps & Dispatchers<typeof actionCreators>

// effectively, this is the same as:
// interface DerivedProps {
//   setHelpShown: ({ shown: boolean }) => void;
// }

// we must pass `actionCreators` straight to connect, and voilà!
export default connect<Props>(Game, {actionCreators});
```

### Subscribing to actions in components

> Simon says: you should almost never need to do this.

This is almost always code smell. You almost always want to just
render something based on part of the application state.

But sometimes we need DOM side-effects to happen when certain actions
are dispatched, and no worries, Simon has a plan for that.

If you decorate your component with `@watching` and define a `subscribe`
method (that takes a `Watcher`), your component (as long as it's mounted),
will get notified every time an action of a specific type is dispatched.

Let's focus a search input when `actions.focusSearch` is dispatched.

```tsx
// this file lives in `src/components/example.tsx`

import React = require("react");
import { watching, Watcher } from "./watching";
import * as actions from "../actions";

@watching
export default class SearchField extends React.PureComponent<{}> {
  render() {
    // as of React 16, `ref` must be a callback
    return (
      <input
        type="search"
        placeholder="Search for things..."
        ref={this.gotSearchEl}
      />
    );
  }

  searchEl: HTMLInputElement;
  gotSearchEl = (searchEl: HTMLInputElement) => {
    // react gotcha: ref callbacks can be called with a null argument
    // (when a re-render happens and the node disappears)
    // so don't expect `searchEl` to be valid here.
    this.searchEl = searchEl;
  };

  subscribe(watcher: Watcher) {
    watcher.on(actions.focusSearch, (store, action) => {
      // we can access `action.payload` here!
      // we don't need to for this example.

      // remember, it might be null
      if (this.searchEl) {
        this.searchEl.focus();
      }
    });

    // we can call watcher.on() as many times as we want
    // if we want to be notified of other actions.
    // Simon takes care of subscribing and unsubscribing
    // automatically when the component is mounted/unmounted.
  }
}
```
