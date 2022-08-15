# new-three13
Api for online play of three-thirteen card game.

## Getting Started
### PreReqs
* node.js: 18.7.0

### Startup commands
```
git clone https://github.com/jlyden/new-three13.git
cd new-three13
npm install
npm run serve
```

## Helpful resources
### sample test requests via [curl](https://curl.se/)
```
curl -i -X GET http://localhost:3000/rounds
curl -i -X GET http://localhost:3000/game/<guid>
curl -i -X GET http://localhost:3000/game/<guid>/rounds/<int>/draw
curl -i -X DELETE http://localhost:3000/game/<guid>
curl -i -X POST -H 'Content-Type: application/json' -d '{"round": 3, "playerCount": 4}' http://localhost:3000/rounds
curl -i -X PUT -H 'Content-Type: application/json' -d '{"player": "<guid>", "card": "<abbrev>"}' http://localhost:3000/game/<guid>/rounds/<int>/discard
```

### guides
* init: https://ultimatecourses.com/blog/setup-typescript-nodejs-express
* tests: https://medium.com/@pojotorshemi/integration-test-on-express-restful-apis-using-jest-and-supertest-4cf5d1414ab0
  * with db conn: https://www.wwt.com/article/using-jest-to-run-integration-tests

### docs
* express: https://expressjs.com/en/guide/routing.html
 * using express.Router: https://stackoverflow.com/a/59682504
* typescript: https://www.typescriptlang.org/docs/handbook/modules.html
* https://kulshekhar.github.io/ts-jest/docs/getting-started/installation