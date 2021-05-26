export class HTTPError extends Error {
  statusCode: number;
  code: string;
  response: any;
  constructor(data: any) {
    super(data);
  }
}

export class NotFoundError extends HTTPError {
  constructor(data: any) {
    super(data);
    this.statusCode = 404;
    this.code = 'NOT_FOUND';
  }
}

export class BadRequestError extends HTTPError {
  constructor(data: any) {
    super(data);
    this.statusCode = 400;
    this.code = 'BAD_REQUEST';
  }
}

export class ServerError extends HTTPError {
  constructor(data: any) {
    super(data);
    this.statusCode = 500;
    this.code = 'SERVER_ERROR';
  }
}
