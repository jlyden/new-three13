import { RoundRouteDomain } from '../../../src/round/domains/round-route';
import { roundRouteSchema } from '../../../src/round/validators/round-route-validator';

describe('roundRouteSchema', () => {
  const testGameId = '82a4af67-cbff-41a2-976f-792b22a5ba55';
  const validRoundRouteParams = { gameId: testGameId, roundNumber: 3 };

  it('passes with guid gameId and all valid roundNumbers', () => {
    for (let i = 3; i < 14; i++) {
      const paramsToValidate: RoundRouteDomain = { gameId: testGameId, roundNumber: i };
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
    [ 'gameId is null', { gameId: null }, mustBeString ],
    [ 'gameId is undefined', { gameId: undefined }, isRequired ],
    [ 'gameId is a number', { gameId: 42 }, mustBeString ],
    [ 'gameId is a non-guid string', { gameId: 'dory' }, mustBeGuid ],
    [ 'gameId is an invalid guid', { gameId: '82a4af67-cbff-41a2-976f-792b22a5yyyy' }, mustBeGuid ],
    [ 'roundNumber is null', { roundNumber: null }, mustBeNumber ],
    [ 'roundNumber is undefined', { roundNumber: undefined }, isRequired ],
    [ 'roundNumber is string', { roundNumber: 'dory' }, mustBeNumber ],
    [ 'roundNumber is too low', { roundNumber: 2 }, 'must be greater than or equal to 3' ],
    [ 'roundNumber is too high', { roundNumber: 14 }, 'must be less than or equal to 13' ],
  ])('fails when ', (_: string, mutator: object, expectedErrorPart: string) => {
    const paramsToValidate = { ...validRoundRouteParams, ...mutator };
    const { value, error } = roundRouteSchema.validate(paramsToValidate);
 
    expect(value).toEqual(paramsToValidate);
    const actualErrorMessage: string = error ? error.message : '';
    expect(actualErrorMessage).toEqual(expect.stringContaining(Object.keys(mutator)[0]));
    expect(actualErrorMessage).toEqual(expect.stringContaining(expectedErrorPart));
  });
});