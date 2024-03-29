export enum HttpCode {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

interface ApiErrorDomain {
  name: string;
  message?: string;
  httpCode: HttpCode;
}

export class ApiError extends Error {
  public readonly httpCode: HttpCode;

  constructor (args: ApiErrorDomain) {
    super(args.message);

    this.name = args.name;
    this.httpCode = args.httpCode;
  }
}

export const badRequestError: ApiErrorDomain = {
  name: 'Bad Request',
  httpCode: HttpCode.BAD_REQUEST,
}

export const cardNotFoundError: ApiErrorDomain = {
  name: 'Card Not Found',
  httpCode: HttpCode.NOT_FOUND,
}

export const notFoundError: ApiErrorDomain = {
  name: 'Not Found',
  httpCode: HttpCode.NOT_FOUND,
}

export const serverError: ApiErrorDomain = {
  name: 'Internal Server Error',
  httpCode: HttpCode.INTERNAL_SERVER_ERROR,
}