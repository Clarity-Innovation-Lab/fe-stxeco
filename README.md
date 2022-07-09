# EcosystemDAO

The UI for the Ecosystem DAO, a DAO for the Stacks community for decision making processes.

For information about the Project, see [EcosystemDAO](https://github.com/Clarity-Innovation-Lab/ecosystem-dao).

## Project setup

```js
% node -v 
v16.14.2
% npm -v 
8.5.0
```

```js
npm install
```

### Compiles and hot-reloads for development

```js
npm run serve
```

### Compiles and minifies for production

```js
npm run build
```

### Lints and fixes files

```js
npm run lint
```

## Dependency Issues

Some build / dependency issues compounded and caused some problems which this branch addresses.

### Node Sass

Node sass requires node-gyp and ultimately Python 2.7 to be reachable on the target machine. This causes
several hard to diagnose problems during npm install including popoups saying python has unexpectedly
quit and very verbose output to terminal. The behaviour on different environments - e.g. running in linux
complicates things even further. 

Node-sass has been removed in favour of using plain css until a better solution is found

## Webpack 5 and Buffer Polyfills

Attempts to fix the above triggered this issue. Buffer polyfills are supported natively when
using webpack 4 but switching to webpack 5 means the polyfills have to be supplied via the config
in this case vue.config.cli.

- [How to polyfill Buffer with Webpack 5
](https://viglucci.io/how-to-polyfill-buffer-with-webpack-5)
- [Working with Webpack](https://cli.vuejs.org/guide/webpack.html#chaining-advanced)
- [Uncaught ReferenceError: Buffer is not defined](https://stackoverflow.com/questions/68707553/uncaught-referenceerror-buffer-is-not-defined)
- [How to Polyfill node core modules in webpack 5](https://stackoverflow.com/questions/64557638/how-to-polyfill-node-core-modules-in-webpack-5)

## D-App

This UI is a Vue web app providing features:

### Proposals

- Browse and filter proposals.
- Deploy proposal contracts.
- Submit proposals to the DAO.

### Extensions

- Browse and filter extensions.
- Interact with extensions (when able).

### Membership

- views for token balances, token transfers, membership status.

### Delegation

- interface for delegating and rescinding votes.

### Voting

- ability to find and vote on proposals

### Token Sale

- Interface to treasury contract
- Interface to token sale contract

Note this d-app will depend on an API for fast access to on-chain state and event data.

Bootstrap, launch and run dao's using Executor DAO from the Clarity Lab.

### Acknowledgements

- Photo by Mick Haupt on Unsplash - membership
- Photo by Element5 Digital on Unsplash vote
- Photo by Emma Gossett on Unsplash - tree
- Photo by Tingey Injury Law Firm on Unsplash - thinker
- Photo by Michal Matlon on Unsplash - seats

### References

## License

MIT license, all good as long as the copyright and permission notice are included.