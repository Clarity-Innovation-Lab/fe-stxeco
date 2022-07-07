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

Note the project depends on node-sass@6 and may require rebuild of node-sass module. See (npm/sass compatibility)[https://www.npmjs.com/package/node-sass]

See also - (stack overflow explanation)[https://stackoverflow.com/questions/53125291/build-fails-npm-rebuild-node-sass-force]


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