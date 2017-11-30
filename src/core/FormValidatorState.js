/*
 * This file is part of the Validatory package.
 *
 * Copyright (c) 2017-present Friends Of ECMAScript
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * @author Mikel Tuesta <mikeltuesta@gmail.com>
 */
const STATE = {
  NOT_VALIDATED: 0,
  NOT_FILLED: 1,
  NOT_VALID: 2,
  VALID: 3
};

const STATE_DATA_ATTRIBUTE_VALUE = {
  [STATE.NOT_VALIDATED]: 'not-validated',
  [STATE.NOT_FILLED]: 'not-filled',
  [STATE.NOT_VALID]: 'not-valid',
  [STATE.VALID]: 'valid',
};

export {
  STATE,
  STATE_DATA_ATTRIBUTE_VALUE
};
