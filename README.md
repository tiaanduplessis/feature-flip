
# 🏁 feature-flip
[![package version](https://img.shields.io/npm/v/feature-flip.svg?style=flat-square)](https://npmjs.org/package/feature-flip)
[![package downloads](https://img.shields.io/npm/dm/feature-flip.svg?style=flat-square)](https://npmjs.org/package/feature-flip)
[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)
[![package license](https://img.shields.io/npm/l/feature-flip.svg?style=flat-square)](https://npmjs.org/package/feature-flip)
[![make a pull request](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

Flexible React & React Native feature flagging/flipping/toggling for simple use cases

## 📖 Table of Contents
- [🏁 feature-flip](#-feature-flip)
  - [📖 Table of Contents](#-table-of-contents)
  - [👀 Background](#-background)
    - [Features](#features)
  - [⚙️ Install](#️-install)
  - [📖 Usage](#-usage)
    - [Kitchen sink](#kitchen-sink)
    - [Overridable value parsing](#overridable-value-parsing)
  - [📚 API](#-api)
  - [💬 Contributing](#-contributing)
  - [🪪 License](#-license)

## 👀 Background

This package facilitates a [feature flag-driven workflow](https://launchdarkly.com/blog/feature-flag-driven-development/) within React and React Native applications. It is intended for simple use cases where a local or remote configuration object is used. If you have more complex requirements such as incremental roll-outs please take a look at services such as [LaunchDarkly](https://launchdarkly.com/) or [Unleash](https://www.getunleash.io/).

### Features

- Tiny bundle size
- TypeScript support with [API docs](https://paka.dev/npm/feature-flip)
- React hook, HOC and render prop APIs
- Optional fallback for falsy or missing flags
- Support for nested flags with custom separator
- Overridable value parsing for unique cases such as semver

## ⚙️ Install

Install the package locally within you project folder with your package manager:

With `npm`:
```sh
npm install feature-flip
```

With `yarn`:
```sh
yarn add feature-flip
```

With `pnpm`:
```sh
pnpm add feature-flip
```

## 📖 Usage

### Kitchen sink

```tsx
import {
  FeatureFlipsProvider,
  FeatureFlip,
  withFeatureFlip,
  useFeatureFlip
} from "feature-flip";

const features = {
  blog: {
    header: true,
    content: {
      intro: "no"
    },
    footer: false
  }
};

const Header = () => {
  const isEnabled = useFeatureFlip("blog.header");
  return isEnabled ? <header>Header</header> : null;
};

const Intro = withFeatureFlip("content.intro")(() => <p>Intro</p>);

export default function App() {
  return (
    <FeatureFlipsProvider value={features}>
      <div>
        <Header />

        <main>
          <Intro />

          <p>This is the content</p>

          <FeatureFlip name="missing-flag">
            <p>Will not show</p>
          </FeatureFlip>
        </main>

        <FeatureFlip
          name="blog.footer"
          fallback={<footer>Fallback footer</footer>}
        >
          <footer>Footer</footer>
        </FeatureFlip>
      </div>
    </FeatureFlipsProvider>
  );
}
```

### Overridable value parsing

By providing your own `onParseValue` configuration option you can handle special cases such as enable/disabling a flag based on a semantic version.

First create your custom handler:
```tsx
import semver from "semver";
import { defaultValueParser } from "feature-flip";

export const parseSemverValue = (value) => {
  if (semver.valid(value)) return semver.satisfies(value);
  // If it isn't a valid semver value, handle as normal
  return defaultValueParser(value);
};
```

Now override the `config` option for your `FeatureFlipsProvider`:

```tsx
import {parseSemverValue}  from "./parse-semver-value"

const features = {
  // ...
}

const App = () => <FeatureFlipsProvider value={features} config={{
  onParseValue: parseSemverValue
}}>
  <Component />
</FeatureFlipsProvider>
```


## 📚 API

For all configuration options, please see the [API docs](https://paka.dev/npm/feature-flip).

## 💬 Contributing

Got an idea for a new feature? Found a bug? Contributions are welcome! Please [open up an issue](https://github.com/tiaanduplessis/feature-flip/issues) or [make a pull request](https://makeapullrequest.com/).

## 🪪 License

[MIT © Tiaan du Plessis](./LICENSE)
    