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
* circle back to processDiscard with dispatch = true
* add & setup inversify

## Helpful resources
* [api docs and sample calls](api-doc.md) (internal)

### guides
* init: https://ultimatecourses.com/blog/setup-typescript-nodejs-express
* tests: https://medium.com/@pojotorshemi/integration-test-on-express-restful-apis-using-jest-and-supertest-4cf5d1414ab0
  * with db conn: https://www.wwt.com/article/using-jest-to-run-integration-tests
* custom errors: https://www.codeconcisely.com/posts/how-to-handle-errors-in-express-with-typescript/
* constuctor overloading: https://upmostly.com/angular/better-constructor-overloading-in-typescript-angular
* inversify
  * & serverless: https://github.com/andrea-lascola/serverless-inversify-example
  * setup: https://itnext.io/typescript-dependency-injection-setting-up-inversifyjs-ioc-for-a-ts-project-f25d48799d70

### docs
* express: https://expressjs.com/en/guide/routing.html
* typescript: https://www.typescriptlang.org/docs/handbook/modules.html
* jest: https://kulshekhar.github.io/ts-jest/docs/getting-started/installation
* inversify: https://doc.inversify.cloud/en/