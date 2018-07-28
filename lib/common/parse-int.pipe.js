'use strict';
const { BadRequestException } = require('../exceptions/exceptions');

module.exports = class ParseIntPipe {
  async transform(value) {
    const isNumeric =
      typeof value === 'string' &&
      !isNaN(parseFloat(value)) &&
      isFinite(value);
    if (!isNumeric) {
      throw new BadRequestException(
        'Validation failed (numeric string is expected)'
      );
    }
    return parseInt(value, 10);
  }
};

