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

## TODO
* finish methods related to creating round
  * dealHands, drawCard
* add & setup inversify
* generic validation middleware runner

## Helpful resources
### sample test requests via [curl](https://curl.se/)
```
curl -i -X GET http://localhost:3000/games/<guid>/rounds/<int>
curl -i -X POST -H 'Content-Type: application/json' -d '{"playerCount": <int>}' http://localhost:3000/games/<guid>/rounds/<int>
curl -i -X PUT http://localhost:3000/games/<guid>/rounds/<int>/draw
curl -i -X PUT -H 'Content-Type: application/json' -d '{"card": "<abbrv>"}' http://localhost:3000/games/<guid>/rounds/<int>/discard
curl -i -X DELETE http://localhost:3000/games/<guid>/rounds/<int>
```

```
curl -i -X POST -H 'Content-Type: application/json' -d '{"playerCount": 2}' http://localhost:3000/games/9c9f9a0b-40a6-4d69-ad52-c1412fbbecc6/rounds/3
curl -i -X GET http://localhost:3000/games/9c9f9a0b-40a6-4d69-ad52-c1412fbbecc6/rounds/3
```

### guides
* init: https://ultimatecourses.com/blog/setup-typescript-nodejs-express
* tests: https://medium.com/@pojotorshemi/integration-test-on-express-restful-apis-using-jest-and-supertest-4cf5d1414ab0
  * with db conn: https://www.wwt.com/article/using-jest-to-run-integration-tests

### docs
* express: https://expressjs.com/en/guide/routing.html
* typescript: https://www.typescriptlang.org/docs/handbook/modules.html
* jest: https://kulshekhar.github.io/ts-jest/docs/getting-started/installation
* inversify: https://doc.inversify.cloud/en/