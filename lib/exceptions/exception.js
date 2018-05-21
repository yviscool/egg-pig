'use strict';

const HttpStatus = require('./constant').HttpStatus;

function createHttpExceptionBody(message, error, statusCode) {
  return message ? { statusCode, error, message } : { statusCode, error };
}

class HttpException extends Error {
  constructor(response, status) {
    super();
    this.message = response;
    this.response = response;
    this.status = status;
  }

  getResponse() {
    return this.response;
  }

  getStatus() {
    return this.status;
  }
}

exports.HttpException = HttpException;

exports.ForbiddenException = class ForbiddenException extends HttpException {
  constructor(message, error = 'Forbidden') {
    super(
      createHttpExceptionBody(message, error, HttpStatus.FORBIDDEN),
      HttpStatus.FORBIDDEN
    );
  }
};


exports.BadRequestException = class BadRequestException extends HttpException {
  constructor(message, error = 'Bad Request') {
    super(
      createHttpExceptionBody(message, error, HttpStatus.BAD_REQUEST),
      HttpStatus.BAD_REQUEST
    );
  }
};

exports.UnauthorizedException = class UnauthorizedException extends HttpException {
  constructor(message, error = 'Unauthorized') {
    super(
      createHttpExceptionBody(message, error, HttpStatus.UNAUTHORIZED),
      HttpStatus.UNAUTHORIZED
    );
  }
};

exports.NotFoundException = class NotFoundException extends HttpException {
  constructor(message, error = 'Not Found') {
    super(
      createHttpExceptionBody(message, error, HttpStatus.NOT_FOUND),
      HttpStatus.NOT_FOUND
    );
  }
};

exports.NotAcceptableException = class NotAcceptableException extends HttpException {
  constructor(message, error = 'Not Acceptable') {
    super(
      createHttpExceptionBody(message, error, HttpStatus.NOT_ACCEPTABLE),
      HttpStatus.NOT_ACCEPTABLE
    );
  }
};
exports.RequestTimeoutException = class RequestTimeoutException extends HttpException {
  constructor(message, error = 'Request Timeout') {
    super(
      createHttpExceptionBody(message, error, HttpStatus.REQUEST_TIMEOUT),
      HttpStatus.REQUEST_TIMEOUT
    );
  }
};

exports.ConflictException = class ConflictException extends HttpException {
  constructor(message, error = 'Conflict') {
    super(
      createHttpExceptionBody(message, error, HttpStatus.CONFLICT),
      HttpStatus.CONFLICT
    );
  }
};
exports.GoneException = class GoneException extends HttpException {
  constructor(message, error = 'Gone') {
    super(
      createHttpExceptionBody(message, error, HttpStatus.GONE),
      HttpStatus.GONE
    );
  }
};
exports.PayloadTooLargeException = class PayloadTooLargeException extends HttpException {
  constructor(message, error = 'Payload Too Large') {
    super(
      createHttpExceptionBody(message, error, HttpStatus.PAYLOAD_TOO_LARGE),
      HttpStatus.PAYLOAD_TOO_LARGE
    );
  }
};

exports.UnsupportedMediaTypeException = class UnsupportedMediaTypeException extends HttpException {
  constructor(message, error = 'Unsupported Media Type') {
    super(
      createHttpExceptionBody(
        message,
        error,
        HttpStatus.UNSUPPORTED_MEDIA_TYPE
      ),
      HttpStatus.UNSUPPORTED_MEDIA_TYPE
    );
  }
};

exports.UnprocessableEntityException = class UnprocessableEntityException extends HttpException {
  constructor(message, error = 'Unprocessable Entity') {
    super(
      createHttpExceptionBody(message, error, HttpStatus.UNPROCESSABLE_ENTITY),
      HttpStatus.UNPROCESSABLE_ENTITY
    );
  }
};
exports.InternalServerErrorException = class InternalServerErrorException extends HttpException {
  constructor(message, error = 'Internal Server Error') {
    super(
      createHttpExceptionBody(message, error, HttpStatus.INTERNAL_SERVER_ERROR),
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

exports.NotImplementedException = class NotImplementedException extends HttpException {
  constructor(message, error = 'Not Implemented') {
    super(
      createHttpExceptionBody(message, error, HttpStatus.NOT_IMPLEMENTED),
      HttpStatus.NOT_IMPLEMENTED
    );
  }
};

exports.BadGatewayException = class BadGatewayException extends HttpException {
  constructor(message, error = 'Bad Gateway') {
    super(
      createHttpExceptionBody(message, error, HttpStatus.BAD_GATEWAY),
      HttpStatus.BAD_GATEWAY
    );
  }
};

exports.ServiceUnavailableException = class ServiceUnavailableException extends HttpException {
  constructor(message, error = 'Service Unavailable') {
    super(
      createHttpExceptionBody(message, error, HttpStatus.SERVICE_UNAVAILABLE),
      HttpStatus.SERVICE_UNAVAILABLE
    );
  }
};


exports.GatewayTimeoutException = class GatewayTimeoutException extends HttpException {
  constructor(message, error = 'Gateway Timeout') {
    super(
      createHttpExceptionBody(message, error, HttpStatus.GATEWAY_TIMEOUT),
      HttpStatus.GATEWAY_TIMEOUT
    );
  }
};
