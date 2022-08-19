import { IRoundRouteParams } from '../../src/commons/interfaces/i-round-route';
import { roundRouteSchema } from '../../src/commons/middleware/validators/round-route-validator';

describe('roundRouteSchema', () => {
  const testGameId = '82a4af67-cbff-41a2-976f-792b22a5ba55';
  const validRoundRouteParams = { game_id: testGameId, round_number: 3 };

  it('passes with guid game_id and all valid round_numbers', () => {
    for (let i = 3; i < 14; i++) {
      const paramsToValidate: IRoundRouteParams = { game_id: testGameId, round_number: i };
      const { value, error } = roundRouteSchema.validate(paramsToValidate);
      expect(value).toEqual(paramsToValidate);
      expect(error).toEqual(undefined);
    }
  });

  const mustBeString = 'must be a string';
  const mustBeGuid = 'must be a valid GUID';
  const mustBeNumber = 'must be a number';
  const isRequired = 'is required';

  it.each([
    [ 'game_id is null', { game_id: null }, mustBeString ],
    [ 'game_id is undefined', { game_id: undefined }, isRequired ],
    [ 'game_id is a number', { game_id: 42 }, mustBeString ],
    [ 'game_id is a non-guid string', { game_id: 'dory' }, mustBeGuid ],
    [ 'game_id is an invalid guid', { game_id: '82a4af67-cbff-41a2-976f-792b22a5yyyy' }, mustBeGuid ],
    [ 'round_number is null', { round_number: null }, mustBeNumber ],
    [ 'round_number is undefined', { round_number: undefined }, isRequired ],
    [ 'round_number is string', { round_number: 'dory' }, mustBeNumber ],
    [ 'round_number is too low', { round_number: 2 }, 'must be greater than or equal to 3' ],
    [ 'round_number is too high', { round_number: 14 }, 'must be less than or equal to 13' ],
  ])('fails when ', (_: string, mutator: object, expectedErrorPart: string) => {
    const paramsToValidate = { ...validRoundRouteParams, ...mutator };
    const { value, error } = roundRouteSchema.validate(paramsToValidate);
 
    expect(value).toEqual(paramsToValidate);
    const actualErrorMessage: string = error ? error.message : '';
    expect(actualErrorMessage).toEqual(expect.stringContaining(Object.keys(mutator)[0]));
    expect(actualErrorMessage).toEqual(expect.stringContaining(expectedErrorPart));
  });
});