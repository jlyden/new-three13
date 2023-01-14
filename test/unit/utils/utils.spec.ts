import * as utils from '../../../src/commons/utils/utils';
import { threePlayerList, fourPlayerList } from '../../helper/test-data';

describe('getIndexOfRoundFirstPlayer', () => {
  it.each([
    [2, 3, 0],
    [2, 4, 1],
    [2, 5, 0],
    [2, 6, 1],
    [2, 7, 0],
    [2, 8, 1],
    [2, 9, 0],
    [2, 10, 1],
    [2, 11, 0],
    [2, 12, 1],
    [2, 13, 0],
    [3, 3, 0],
    [3, 4, 1],
    [3, 5, 2],
    [3, 6, 0],
    [3, 7, 1],
    [3, 8, 2],
    [3, 9, 0],
    [3, 10, 1],
    [3, 11, 2],
    [3, 12, 0],
    [3, 13, 1],
    [4, 3, 0],
    [4, 4, 1],
    [4, 5, 2],
    [4, 6, 3],
    [4, 7, 0],
    [4, 8, 1],
    [4, 9, 2],
    [4, 10, 3],
    [4, 11, 0],
    [4, 12, 1],
    [4, 13, 2],
    [5, 3, 0],
    [5, 4, 1],
    [5, 5, 2],
    [5, 6, 3],
    [5, 7, 4],
    [5, 8, 0],
    [5, 9, 1],
    [5, 10, 2],
    [5, 11, 3],
    [5, 12, 4],
    [5, 13, 0],
    [6, 3, 0],
    [6, 4, 1],
    [6, 5, 2],
    [6, 6, 3],
    [6, 7, 4],
    [6, 8, 5],
    [6, 9, 0],
    [6, 10, 1],
    [6, 11, 2],
    [6, 12, 3],
    [6, 13, 4],
  ]) ('returns expected value for playerCount %d and round %d', (playerCount: number, roundNumber: number, expected: number) => {
    const actual = utils.getIndexOfRoundFirstPlayer(roundNumber, playerCount);
    expect(actual).toBe(expected);
  });
});

describe('getNextPlayer', () => {
  it.each([
    [threePlayerList, threePlayerList[0], threePlayerList[1]],
    [threePlayerList, threePlayerList[1], threePlayerList[2]],
    [threePlayerList, threePlayerList[2], threePlayerList[0]],
    [fourPlayerList, fourPlayerList[0], fourPlayerList[1]],
    [fourPlayerList, fourPlayerList[1], fourPlayerList[2]],
    [fourPlayerList, fourPlayerList[2], fourPlayerList[3]],
    [fourPlayerList, fourPlayerList[3], fourPlayerList[0]],
  ]) ('returns expected value for playerList and currentPlayer', (playerList: string[], currentPlayer: string, expected: string) => {
    const actual = utils.getNextPlayer(playerList, currentPlayer);
    expect(actual).toBe(expected);
  });
});
