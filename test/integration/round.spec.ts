import express, { Express } from 'express';
import request from 'supertest';

import { round } from '../../src/commons/routes/round';
import { missingGameId, threePlayerList } from '../helper/test-data';
import { createGame, GAME_STARTING_ROUND_NUMBER } from '../../src/game/game-service';
import { game } from '../../src/commons/routes/game';
import { validateGenericCard } from '../helper/test-validation-utils';
import { createRound, drawCard, DRAW_TYPE_DECK, DRAW_TYPE_VISIBLE } from '../../src/round/round-service';
import { HttpCode } from '../../src/commons/errors/api-error';
import { deleteFromCache, flushCache } from '../../src/commons/utils/cache';
import { errorHandler } from '../../src/commons/middleware/error-handler';
import { CardDomain } from '../../src/round/domains/card';
import { assembleRoundId } from '../../src/commons/utils/round';

const INCORRECT_ROUND = 10
const SAVED_GAME_ID = '79057bd6-5502-488d-b9ba-ca0f51945a9a';
const expectedThirdRoundId = assembleRoundId(SAVED_GAME_ID, GAME_STARTING_ROUND_NUMBER);
const playerOne = threePlayerList[0];

const testApp: Express = express();
testApp.use(express.json());
testApp.use(game);
testApp.use(round);
testApp.use(errorHandler);

describe('round', () => {
  describe('GET single', () => {
    beforeAll(() => {
      createGame(threePlayerList, SAVED_GAME_ID);
      createRound(SAVED_GAME_ID, GAME_STARTING_ROUND_NUMBER)
    });

    afterAll(() => {
      flushCache();
    });
  
    it('returns as expected when round is found', async () => {
      const DECK_LENGTH_AFTER_ROUND_THREE_DEAL = 46 - (GAME_STARTING_ROUND_NUMBER * threePlayerList.length) - 1;
      const { body, status } = await request(testApp).get(`/game/${SAVED_GAME_ID}/round/${GAME_STARTING_ROUND_NUMBER}`);
      
      expect(status).toEqual(HttpCode.OK);
      expect(body.id).toBe(expectedThirdRoundId);
      expect(body.deck.length).toBe(DECK_LENGTH_AFTER_ROUND_THREE_DEAL);
      expect(Object.keys(body.hands).sort()).toEqual(threePlayerList.sort());
      validateGenericCard(body.visibleCard);
      expect(body.nextPlayer).toBe(playerOne);
    });

    it('returns 404 when Game Not Found', async () => {
      const expectedReturn = { error: `Cache empty for key: ${missingGameId}` }
      const { body, status } = await request(testApp).get(`/game/${missingGameId}/round/${GAME_STARTING_ROUND_NUMBER}`);
      expect(status).toEqual(HttpCode.NOT_FOUND);
      expect(body).toEqual(expectedReturn);
    });

    it('returns 400 when incorrect Round', async () => {
      const expectedReturn = { error: `ensureValidRoundRouteParams: unexpected round number. gameId: ${SAVED_GAME_ID} | expected roundNumber: 3 | passed: ${INCORRECT_ROUND}` }
      const { body, status } = await request(testApp).get(`/game/${SAVED_GAME_ID}/round/${INCORRECT_ROUND}`);
      expect(status).toEqual(HttpCode.BAD_REQUEST);
      expect(body).toEqual(expectedReturn);
    });
  });

  describe('POST', () => {
    beforeAll(() => {
      createGame(threePlayerList, SAVED_GAME_ID);
    });

    afterAll(() => {
      flushCache();
    });

    it('returns as expected when Game exists', async () => {
      const roundResult = await request(testApp).post(`/game/${SAVED_GAME_ID}/round/${GAME_STARTING_ROUND_NUMBER}`);
      expect(roundResult.status).toEqual(HttpCode.OK);
      validateGenericCard(roundResult.body.visibleCard);
      expect(roundResult.body.nextPlayer).toBe(playerOne);

      // Ensure game also updated correctly
      const gameResult = await request(testApp).get(`/game/${SAVED_GAME_ID}`);
      expect(gameResult.body.id).toEqual(SAVED_GAME_ID);
      expect(gameResult.body.roundNumber).toEqual(GAME_STARTING_ROUND_NUMBER);
    });

    it('returns 404 when creating a Round for Game Not Found', async () => {
      const expectedReturn = { error: `Cache empty for key: ${missingGameId}` }
      const { body, status } = await request(testApp).post(`/game/${missingGameId}/round/${GAME_STARTING_ROUND_NUMBER}`);
      expect(status).toEqual(HttpCode.NOT_FOUND);
      expect(body).toEqual(expectedReturn);
    });
  });

  describe('PUT draw', () => {
    beforeAll(() => {
      createGame(threePlayerList, SAVED_GAME_ID);
    })

    beforeEach(() => {
      createRound(SAVED_GAME_ID, GAME_STARTING_ROUND_NUMBER)
    });

    afterEach(() => {
      deleteFromCache(expectedThirdRoundId);
    });

    afterAll(() => {
      flushCache();
    });

    it('returns as expected when drawing visible card', async () => {
      // arrange
      const beforeRound = await request(testApp).get(`/game/${SAVED_GAME_ID}/round/${GAME_STARTING_ROUND_NUMBER}`);
      const beforeDeck = beforeRound.body.deck;
      const beforePlayerHand = beforeRound.body.hands[playerOne];
      const beforeVisibleCard = beforeRound.body.visibleCard;
    
      // act
      const { body, status } = await request(testApp).put(`/game/${SAVED_GAME_ID}/round/${GAME_STARTING_ROUND_NUMBER}/draw/${DRAW_TYPE_VISIBLE}`);

      // assert
      expect(status).toEqual(HttpCode.OK);

      // check deck and visible card
      expect(body.deck.length).toEqual(beforeDeck.length);
      expect(body.visibleCard).toBe(undefined);

      // check player's hand
      const afterPlayerHand = body.hands[playerOne];
      expect(afterPlayerHand.length).toEqual(beforePlayerHand.length + 1);
      const lastCardAdded = afterPlayerHand.pop();
      expect(lastCardAdded).toStrictEqual(beforeVisibleCard);
      // hand after pop should match hand before draw
      expect(afterPlayerHand).toStrictEqual(beforePlayerHand);
    });

    it('returns as expected when drawing from deck', async () => {
      // arrange
      const beforeRound = await request(testApp).get(`/game/${SAVED_GAME_ID}/round/${GAME_STARTING_ROUND_NUMBER}`);
      const beforeDeck = beforeRound.body.deck;
      const lastCardInDeck = beforeRound.body.deck[beforeRound.body.deck.length-1];
      const beforePlayerHand = beforeRound.body.hands[playerOne];
      const beforeVisibleCard = beforeRound.body.visibleCard;

      // act
      const { body, status } = await request(testApp).put(`/game/${SAVED_GAME_ID}/round/${GAME_STARTING_ROUND_NUMBER}/draw/${DRAW_TYPE_DECK}`);

      // assert
      expect(status).toEqual(HttpCode.OK);

      // check deck and visible card
      expect(body.deck.length).toEqual(beforeDeck.length - 1);
      expect(body.visibleCard).toStrictEqual(beforeVisibleCard);

      // check player's hand
      const afterPlayerHand = body.hands[playerOne];
      expect(afterPlayerHand.length).toEqual(beforePlayerHand.length + 1);
      const lastCardAdded = afterPlayerHand.pop();
      expect(lastCardAdded).toStrictEqual(lastCardInDeck);
      // hand after pop should match hand before draw
      expect(afterPlayerHand).toStrictEqual(beforePlayerHand);
    });

    it('returns 400 when invalid Draw source', async () => {
      const expectedReturn = { error: `"source" must be one of [deck, visible]` }
      const { body, status } = await request(testApp).put(`/game/${SAVED_GAME_ID}/round/${GAME_STARTING_ROUND_NUMBER}/draw/cheese`);
      expect(status).toEqual(HttpCode.BAD_REQUEST);
      expect(body).toEqual(expectedReturn);
    });

    it('returns 400 when user tries to draw multiple times during their turn', async () => {
      // arrange
      await request(testApp).get(`/game/${SAVED_GAME_ID}/round/${GAME_STARTING_ROUND_NUMBER}`);
      await request(testApp).put(`/game/${SAVED_GAME_ID}/round/${GAME_STARTING_ROUND_NUMBER}/draw/${DRAW_TYPE_VISIBLE}`);

      // act
      const expectedReturn = { error: `drawCard: invalid draw: User already has an extra card in hand: gameId ${SAVED_GAME_ID} | round: ${GAME_STARTING_ROUND_NUMBER} | nextPlayer: ${playerOne}` }
      const { body, status } = await request(testApp).put(`/game/${SAVED_GAME_ID}/round/${GAME_STARTING_ROUND_NUMBER}/draw/${DRAW_TYPE_VISIBLE}`);
      expect(status).toEqual(HttpCode.BAD_REQUEST);
      expect(body).toEqual(expectedReturn);
    });
    
    it('returns 400 when trying to Draw but incorrect Round', async () => {
      const expectedReturn = { error: `ensureValidRoundRouteParams: unexpected round number. gameId: ${SAVED_GAME_ID} | expected roundNumber: ${GAME_STARTING_ROUND_NUMBER} | passed: ${INCORRECT_ROUND}` }
      const { body, status } = await request(testApp).put(`/game/${SAVED_GAME_ID}/round/${INCORRECT_ROUND}/draw/${DRAW_TYPE_VISIBLE}`);
      expect(status).toEqual(HttpCode.BAD_REQUEST);
      expect(body).toEqual(expectedReturn);
    });

    it('returns 404 when trying to Draw but Game Not Found', async () => {
      const expectedReturn = { error: `Cache empty for key: ${missingGameId}` }
      const { body, status } = await request(testApp).put(`/game/${missingGameId}/round/${GAME_STARTING_ROUND_NUMBER}/draw/${DRAW_TYPE_VISIBLE}`);
      expect(status).toEqual(HttpCode.NOT_FOUND);
      expect(body).toEqual(expectedReturn);
    });
  });

  describe('PUT discard', () => {
    let beforeDeck: CardDomain[];
    let beforePlayerHand: CardDomain[];
    let beforeVisibleCard: CardDomain;

    beforeAll(() => {
      createGame(threePlayerList, SAVED_GAME_ID);
    });

    beforeEach(async () => {
      createRound(SAVED_GAME_ID, GAME_STARTING_ROUND_NUMBER)
      drawCard(SAVED_GAME_ID, GAME_STARTING_ROUND_NUMBER, DRAW_TYPE_VISIBLE);

      const beforeRound = await request(testApp).get(`/game/${SAVED_GAME_ID}/round/${GAME_STARTING_ROUND_NUMBER}`);
      beforeDeck = beforeRound.body.deck;
      beforePlayerHand = beforeRound.body.hands[playerOne];
      beforeVisibleCard = beforeRound.body.visibleCard;
    });

    afterEach(() => {
      const cacheKey = `${SAVED_GAME_ID}/${GAME_STARTING_ROUND_NUMBER}`
      deleteFromCache(cacheKey);
    });

    afterAll(() => {
      flushCache();
    });

    it('returns as expected with valid Discard, dispatch is false', async () => {
      // act
      const lastCardInPlayersHand = beforePlayerHand.pop();
      const discardParams = { card: lastCardInPlayersHand, dispatch: false }
      const { body, status } = await request(testApp).put(`/game/${SAVED_GAME_ID}/round/${GAME_STARTING_ROUND_NUMBER}/discard`).send(discardParams);

      // assert
      expect(status).toEqual(HttpCode.OK);

      // check deck and visible card
      expect(body.deck.length).toEqual(beforeDeck.length);
      expect(body.visibleCard).not.toStrictEqual(beforeVisibleCard);
      expect(body.visibleCard).toStrictEqual(lastCardInPlayersHand);

      // check player's hand
      const afterPlayerHand = body.hands[playerOne];
      // hand after pop should match hand before draw
      expect(afterPlayerHand).toEqual(beforePlayerHand);
    });

    it('returns as expected with valid Discard, dispatch is true', async () => {
      // TODO
      expect(true).toBe(true);
    });

    it('returns 400 when Discard called with card not in Hand', async () => {
      // There will never be a 5 Joker in deck (or hand)
      const cardNotInHand = {
        suit: 'Joker',
        value: 5,
      };
      const expectedReturn = { error: `removeFromGroup error! cards: ${JSON.stringify(beforePlayerHand)} | discard: ${JSON.stringify(cardNotInHand)}` }
      const discardParams = { card: cardNotInHand, dispatch: false }
      const { body, status } = await request(testApp).put(`/game/${SAVED_GAME_ID}/round/${GAME_STARTING_ROUND_NUMBER}/discard`).send(discardParams);
      expect(status).toEqual(HttpCode.BAD_REQUEST);
      expect(body).toEqual(expectedReturn);
    });

    it('returns 400 when trying to Discard but incorrect Round', async () => {
      const expectedReturn = { error: `ensureValidRoundRouteParams: unexpected round number. gameId: ${SAVED_GAME_ID} | expected roundNumber: 3 | passed: ${INCORRECT_ROUND}` }
      const lastCardInPlayersHand = beforePlayerHand.pop();
      const discardParams = { card: lastCardInPlayersHand, dispatch: false }
      const { body, status } = await request(testApp).put(`/game/${SAVED_GAME_ID}/round/${INCORRECT_ROUND}/discard`).send(discardParams);
      expect(status).toEqual(HttpCode.BAD_REQUEST);
      expect(body).toEqual(expectedReturn);
    });

    it('returns 404 when trying to Discard but Game Not Found', async () => {
      const expectedReturn = { error: `Cache empty for key: ${missingGameId}` }
      const { body, status } = await request(testApp).put(`/game/${missingGameId}/round/${GAME_STARTING_ROUND_NUMBER}/draw/${DRAW_TYPE_VISIBLE}`);
      expect(status).toEqual(HttpCode.NOT_FOUND);
      expect(body).toEqual(expectedReturn);
    });
  });

  describe('DELETE', () => {
    beforeEach(() => {
      createGame(threePlayerList, SAVED_GAME_ID);
      createRound(SAVED_GAME_ID, GAME_STARTING_ROUND_NUMBER)
    });
  
    afterAll(() => {
      flushCache();
    });
  
    it('returns successfully when round is found and deleted', async () => {
      const expectedReturn = { 'message': `Round: ${GAME_STARTING_ROUND_NUMBER} deleted for Game: ${SAVED_GAME_ID}` };
      const { body, status } = await request(testApp).delete(`/game/${SAVED_GAME_ID}/round/${GAME_STARTING_ROUND_NUMBER}`);
      expect(status).toEqual(HttpCode.OK);
      expect(body).toEqual(expectedReturn);
    });

    it('returns 404 when trying to Delete but Game Not Found', async () => {
      const expectedReturn = { error: `Cache empty for key: ${missingGameId}` }
      const { body, status } = await request(testApp).delete(`/game/${missingGameId}/round/${GAME_STARTING_ROUND_NUMBER}`);
      expect(status).toEqual(HttpCode.NOT_FOUND);
      expect(body).toEqual(expectedReturn);
    });
  });
});
