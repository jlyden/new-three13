# API Documentation

## Game
### Game GET
* Path Parameters
  * `gameId`: string guid
* Path
  * `/game/<gameId>`
* Return
  * TODO

### Game POST
* Body Payload (JSON)
  * `playerList`: string[]
    * length > 1
    * for now, any strings will do
  * `gameId`: string guid
    * optional, will be generated if not passed
* Path
  * `/game`
* Return
  * TODO

## Round
* Prerequisite
  * A Game must already exist with a valid gameId guid
* Common Path Parameters
  * `gameId`: string guid
  * `roundNumber`: int betwen 3 and 13 inclusive

### Round GET
* Path
  * `/game/<gameId>/round/<roundNumber>`
* Return
  * TODO

### Round POST
* Path
  * `/game/<gameId>/round/<roundNumber>`
* Return
  * TODO

### Round PUT draw
* Additional Path Parameter
  * `drawType`: string, either 'deck' or 'visible'
* Path
  * `/game/<gameId>/round/<roundNumber>/draw/<drawType>`
* Return
  * TODO

### Round PUT discard
* Body Payload (JSON)
  * `card`: CardDomain
  * `dispatch`: bool
* Path
  * `/game/<gameId>/round/<roundNumber>/discard`
* Return
  * TODO

---

## Example Calls
* [curl](https://curl.se/)
* [guid generator](https://guidgenerator.com/)

## Game
```
# GET
curl -i -X GET http://localhost:3000/game/fedc42aa-cf90-4ae0-ab52-290fad8f9d64

# POST
curl -i -X POST -H 'Content-Type: application/json' -d '{"playerList": ["alice", "bob", "carol"], "gameId": "fedc42aa-cf90-4ae0-ab52-290fad8f9d64"}' http://localhost:3000/game
```

## Round
```
# GET
curl -i -X GET http://localhost:3000/game/fedc42aa-cf90-4ae0-ab52-290fad8f9d64/round/3

# POST
curl -i -X POST http://localhost:3000/game/fedc42aa-cf90-4ae0-ab52-290fad8f9d64/round/3

# PUT draw deck
curl -i -X PUT http://localhost:3000/game/fedc42aa-cf90-4ae0-ab52-290fad8f9d64/round/3/draw/deck

# PUT draw visible
curl -i -X PUT http://localhost:3000/game/fedc42aa-cf90-4ae0-ab52-290fad8f9d64/round/3/draw/visible

# PUT discard
curl -i -X PUT -H 'Content-Type: application/json' -d '{"card": {"suit": "Heart", "value": 3}, "dispatch": "false"}' http://localhost:3000/game/fedc42aa-cf90-4ae0-ab52-290fad8f9d64/round/3/discard
```
