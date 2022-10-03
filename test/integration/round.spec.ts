import express from 'express';
import request from 'supertest';

import { round } from '../../src/commons/routes/round';
import { errorHandler } from '../../src/commons/middleware/error-handler';
import { missingGameId, playerList } from '../helper/test-data';
import { GAME_STARTING_ROUND_NUMBER } from '../../src/game/game-service';
import { game } from '../../src/commons/routes/game';
import { validateGenericCard } from '../helper/test-utils';
import { DRAW_TYPE_DECK, DRAW_TYPE_VISIBLE } from '../../src/round/round-service';
import { HttpCode } from '../../src/commons/errors/api-error';

const savedGameId = '79057bd6-5502-488d-b9ba-ca0f51945a9a';
const roundFour = 4;
const roundTen = 10
const playerOne = playerList[0];
const playerTwo = playerList[1];

const testApp = express();
testApp.use(express.json());
testApp.use(game);
testApp.use(round);
testApp.use(errorHandler);

describe('round', () => {
  beforeAll(async () => {
    // Create Game and Round for GET, PUT
    const createGameParams = { playerList, gameId: savedGameId }
    const gameResult = await request(testApp).post('/game').send(createGameParams);
    expect(gameResult.body).toBe(savedGameId);
    const roundResult = await request(testApp).post(`/game/${savedGameId}/round/${GAME_STARTING_ROUND_NUMBER}`);
    expect(roundResult.body).toBeDefined();
    validateGenericCard(roundResult.body.visibleCard);
    expect(roundResult.body.nextPlayer).toBe(playerOne);
  });

  describe('GET single', () => {
    it('returns as expected when round is found', async () => {
      const { body, status } = await request(testApp).get(`/game/${savedGameId}/round/${GAME_STARTING_ROUND_NUMBER}`);
      expect(status).toEqual(HttpCode.OK);
      expect(body).toBeDefined();
      expect(body.id).toBe(`${savedGameId}/${GAME_STARTING_ROUND_NUMBER}`);
      expect(Array.isArray(body.deck)).toBeTruthy();
      expect(typeof body.hands).toBe('object');
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
      const expectedReturn = { error: `Cache empty for key: ${savedGameId}/${roundTen}` }
      const { body, status } = await request(testApp).get(`/game/${savedGameId}/round/${roundTen}`);
      expect(status).toEqual(HttpCode.NOT_FOUND);
      expect(body).toEqual(expectedReturn);
    });
  });

  describe('POST', () => {
    it('returns as expected when Game exists', async () => {
      const roundResult = await request(testApp).post(`/game/${savedGameId}/round/${roundFour}`);
      expect(roundResult.status).toEqual(HttpCode.OK);
      expect(roundResult.body).toBeDefined();
      validateGenericCard(roundResult.body.visibleCard);
      expect(roundResult.body.nextPlayer).toBe(playerTwo);

      // Ensure game also updated correctly
      const gameResult = await request(testApp).get(`/game/${savedGameId}`);
      expect(gameResult.body).toBeDefined();
      expect(gameResult.body.id).toEqual(savedGameId);
      expect(gameResult.body.roundNumber).toEqual(roundFour);
    });

    it('returns 404 when creating a Round for Not Found Game', async () => {
      const expectedReturn = { error: `Cache empty for key: ${missingGameId}` }
      const { body, status } = await request(testApp).post(`/game/${missingGameId}/round/${roundFour}`);
      expect(status).toEqual(HttpCode.NOT_FOUND);
      expect(body).toEqual(expectedReturn);
    });
  });

  describe('PUT draw', () => {
    it('returns as expected when drawing from deck', async () => {
      // arrange
      const beforeRound = await request(testApp).get(`/game/${savedGameId}/round/${roundFour}`);
      expect(beforeRound.body).toBeDefined();
      expect(beforeRound.body.nextPlayer).toEqual(playerTwo);
      const beforeDeck = beforeRound.body.deck;
      const lastCardInDeck = beforeRound.body.deck[beforeRound.body.deck.length-1];
      const beforePlayerHand = beforeRound.body.hands[playerTwo];
      const beforeVisibleCard = beforeRound.body.visibleCard;
      const beforeGameResult = await request(testApp).get(`/game/${savedGameId}`);

      // act
      const { body, status } = await request(testApp).put(`/game/${savedGameId}/round/${roundFour}/draw/${DRAW_TYPE_DECK}`);

      // assert
      expect(status).toEqual(HttpCode.OK);
      expect(body.deck.length).toEqual(beforeDeck.length - 1);
      expect(body.visibleCard).toStrictEqual(beforeVisibleCard);
      const afterPlayerHand = body.hands[playerTwo];
      expect(afterPlayerHand.length).toEqual(beforePlayerHand.length + 1);
      const lastCardAdded = afterPlayerHand.pop();
      expect(lastCardAdded).not.toStrictEqual(beforeVisibleCard);
      expect(lastCardAdded).toStrictEqual(lastCardInDeck);
      expect(afterPlayerHand).toStrictEqual(beforePlayerHand);
      const afterGameResult = await request(testApp).get(`/game/${savedGameId}`);
      expect(afterGameResult.body.roundNumber).toStrictEqual(beforeGameResult.body.roundNumber);
    });

    it('returns as expected when drawing visible card', async () => {
      // arrange
      const beforeRound = await request(testApp).get(`/game/${savedGameId}/round/${roundFour}`);
      expect(beforeRound.body).toBeDefined();
      expect(beforeRound.body.nextPlayer).toEqual(playerTwo);
      const beforeDeck = beforeRound.body.deck;
      const beforePlayerHand = beforeRound.body.hands[playerTwo];
      const beforeVisibleCard = beforeRound.body.visibleCard;
      const beforeGameResult = await request(testApp).get(`/game/${savedGameId}`);
    
      // act
      const { body, status } = await request(testApp).put(`/game/${savedGameId}/round/${roundFour}/draw/${DRAW_TYPE_VISIBLE}`);

      // assert
      expect(status).toEqual(HttpCode.OK);
      expect(body.deck.length).toEqual(beforeDeck.length - 1);
      expect(body.visibleCard).not.toStrictEqual(beforeVisibleCard);
      const afterPlayerHand = body.hands[playerTwo];
      expect(afterPlayerHand.length).toEqual(beforePlayerHand.length + 1);
      const lastCardAdded = afterPlayerHand.pop();
      expect(lastCardAdded).toStrictEqual(beforeVisibleCard);
      expect(afterPlayerHand).toStrictEqual(beforePlayerHand);
      const afterGameResult = await request(testApp).get(`/game/${savedGameId}`);
      expect(afterGameResult.body.roundNumber).toStrictEqual(beforeGameResult.body.roundNumber);
    });

    it('returns 400 when invalid Draw source', async () => {
      const expectedReturn = { error: `"source" must be one of [deck, visible]` }
      const { body, status } = await request(testApp).put(`/game/${savedGameId}/round/${roundFour}/draw/cheese`);
      expect(status).toEqual(HttpCode.BAD_REQUEST);
      expect(body).toEqual(expectedReturn);
    });

    it('returns 400 when wrong round number is passed', async () => {
      const expectedReturn = { error: `getDrawRoundRouteParams: unexpected round number. gameId: ${savedGameId} | expected roundNumber: 4 | passed: 3` }
      const { body, status } = await request(testApp).put(`/game/${savedGameId}/round/${GAME_STARTING_ROUND_NUMBER}/draw/${DRAW_TYPE_VISIBLE}`);
      expect(status).toEqual(HttpCode.BAD_REQUEST);
      expect(body).toEqual(expectedReturn);
    });

    it('returns 404 when trying to Draw but Game Not Found', async () => {
      const expectedReturn = { error: `Cache empty for key: ${missingGameId}` }
      const { body, status } = await request(testApp).put(`/game/${missingGameId}/round/${roundFour}/draw/${DRAW_TYPE_VISIBLE}`);
      expect(status).toEqual(HttpCode.NOT_FOUND);
      expect(body).toEqual(expectedReturn);
    });

    it('returns 400 when trying to Draw but Round Not Found', async () => {
      const expectedReturn = { error: `getDrawRoundRouteParams: unexpected round number. gameId: ${savedGameId} | expected roundNumber: 4 | passed: 10` }
      const { body, status } = await request(testApp).put(`/game/${savedGameId}/round/${roundTen}/draw/${DRAW_TYPE_VISIBLE}`);
      expect(status).toEqual(HttpCode.BAD_REQUEST);
      expect(body).toEqual(expectedReturn);
    });
  });

  describe('Routes need real implementation', () => {
    const testGameId = '1b952e3c-6351-4414-a5e3-eb5343030a07';
    const roundNumber = 4;
    const commonRoundRoute = `/game/${testGameId}/round/${roundNumber}`;
    const defaultPutDiscardBody = { "card": "H2" }

    describe('PUT discard', () => {
      it('returns successfully', async () => {
        const { text } = await request(testApp).put(`${commonRoundRoute}/discard`).send(defaultPutDiscardBody);
        expect(text).toBe(`PUT /round/discard | Params: {"gameId":"${testGameId}","roundNumber":"${roundNumber}"} && {"card":"H2"}`);
      });
    });
  
    describe('DELETE', () => {
      it('returns successfully', async () => {
        const { text } = await request(testApp).delete(commonRoundRoute);
        expect(text).toBe(`DELETE /round | Params: {"gameId":"${testGameId}","roundNumber":"${roundNumber}"}`);
      });
    });
  });
});
