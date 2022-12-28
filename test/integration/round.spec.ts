import express, { Express } from 'express';
import request from 'supertest';

import { round } from '../../src/commons/routes/round';
import { missingGameId, threePlayerList } from '../helper/test-data';
import { createGame, GAME_STARTING_ROUND_NUMBER } from '../../src/game/game-service';
import { game } from '../../src/commons/routes/game';
import { validateGenericCard } from '../helper/test-validation-utils';
import { createRound, DRAW_TYPE_DECK, DRAW_TYPE_VISIBLE } from '../../src/round/round-service';
import { HttpCode } from '../../src/commons/errors/api-error';
import { RoundDomain } from '../../src/round/domains/round';
import { deleteFromCache, flushCache } from '../../src/commons/utils/cache';
import { errorHandler } from '../../src/commons/middleware/error-handler';
import { EMPTY_CARD } from '../../src/card-group/domains/card';

const ROUND_NOT_FOUND = 10
const SAVED_GAME_ID = '79057bd6-5502-488d-b9ba-ca0f51945a9a';
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
      expect(body.id).toBe(`${SAVED_GAME_ID}/${GAME_STARTING_ROUND_NUMBER}`);
      expect(body.deck.length).toBe(DECK_LENGTH_AFTER_ROUND_THREE_DEAL);
      expect(Object.keys(body.hands).sort()).toEqual(threePlayerList.sort());
      validateGenericCard(body.visibleCard);
      expect(body.nextPlayer).toBe(playerOne);
    });

    it('returns 404 when Game Not Found', async () => {
      const expectedReturn = { error: `Cache empty for key: ${missingGameId}/${GAME_STARTING_ROUND_NUMBER}` }
      const { body, status } = await request(testApp).get(`/game/${missingGameId}/round/${GAME_STARTING_ROUND_NUMBER}`);
      expect(status).toEqual(HttpCode.NOT_FOUND);
      expect(body).toEqual(expectedReturn);
    });

    it('returns 404 when Round Not Found', async () => {
      const expectedReturn = { error: `Cache empty for key: ${SAVED_GAME_ID}/${ROUND_NOT_FOUND}` }
      const { body, status } = await request(testApp).get(`/game/${SAVED_GAME_ID}/round/${ROUND_NOT_FOUND}`);
      expect(status).toEqual(HttpCode.NOT_FOUND);
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

    it('returns 404 when creating a Round for Not Found Game', async () => {
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
      const cacheKey = `${SAVED_GAME_ID}/${GAME_STARTING_ROUND_NUMBER}`
      deleteFromCache(cacheKey);
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
      expect(body.visibleCard).toStrictEqual(EMPTY_CARD);

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

    it('returns 400 when wrong round number is passed', async () => {
      const expectedReturn = { error: `getDrawRoundRouteParams: unexpected round number. gameId: ${SAVED_GAME_ID} | expected roundNumber: 3 | passed: 10` }
      const { body, status } = await request(testApp).put(`/game/${SAVED_GAME_ID}/round/${ROUND_NOT_FOUND}/draw/${DRAW_TYPE_VISIBLE}`);
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

  xdescribe('PUT discard', () => {
    let beforeTest: { body: RoundDomain, status: number };

    beforeAll(() => {
      createGame(threePlayerList, SAVED_GAME_ID);
      createRound(SAVED_GAME_ID, GAME_STARTING_ROUND_NUMBER);
    });

    afterAll(() => {
      flushCache();
    });

    it('returns as expected with valid discard, dispatch is false', async () => {
      // arrange
      const beforeDrawVisibleCard = beforeTest.body.visibleCard;
      const result = await request(testApp).put(`/game/${SAVED_GAME_ID}/round/${GAME_STARTING_ROUND_NUMBER}/draw/${DRAW_TYPE_VISIBLE}`);
      const beforeRound = result.body;
      expect(result.status).toEqual(HttpCode.OK);
      expect(beforeRound.body.nextPlayer).toEqual(playerOne);
      const beforeDeck = beforeRound.body.deck;
      const beforePlayerHand = beforeRound.body.hands[playerOne];
      expect(beforePlayerHand.length).toEqual(GAME_STARTING_ROUND_NUMBER + 1);
      const beforeGameResult = await request(testApp).get(`/game/${SAVED_GAME_ID}`);

      // act - TODO: add body params
      const lastCardInPlayersHand = beforePlayerHand.pop();
      expect(lastCardInPlayersHand).toStrictEqual(beforeDrawVisibleCard);
      const discardParams = { card: lastCardInPlayersHand, dispatch: false }
      const { body, status } = await request(testApp).put(`/game/${SAVED_GAME_ID}/round/${GAME_STARTING_ROUND_NUMBER}/discard`).send(discardParams);

      // assert - TODO: update/edit
      expect(status).toEqual(HttpCode.OK);
      expect(body.deck.length).toEqual(beforeDeck.length);
      expect(body.visibleCard).toStrictEqual(lastCardInPlayersHand);
      const afterPlayerHand = body.hands[playerOne];
      expect(afterPlayerHand.length).toEqual(beforePlayerHand.length + 1);
      const afterGameResult = await request(testApp).get(`/game/${SAVED_GAME_ID}`);
      expect(afterGameResult.body.roundNumber).toStrictEqual(beforeGameResult.body.roundNumber);
    });

    it('returns as expected with valid discard, dispatch is true', () => {
      // TODO
    });

    it('returns 400 when card not in hand is passed in body', () => {
      // TODO
    });

    it('returns 400 when wrong round number is passed', async () => {
      // TODO
    });

    it('returns 404 when trying to Discard but Game Not Found', async () => {
      // TODO
    });

    it('returns 400 when trying to Discard but Round Not Found', async () => {
      // TODO
    });
  });

  describe('Routes need real implementation', () => {
    const testGameId = '1b952e3c-6351-4414-a5e3-eb5343030a07';
    const roundNumber = 4;
    const commonRoundRoute = `/game/${testGameId}/round/${roundNumber}`;

    describe('DELETE', () => {
      it('returns successfully', async () => {
        const { text } = await request(testApp).delete(commonRoundRoute);
        expect(text).toBe(`DELETE /round | Params: {"gameId":"${testGameId}","roundNumber":"${roundNumber}"}`);
      });
    });
  });
});
