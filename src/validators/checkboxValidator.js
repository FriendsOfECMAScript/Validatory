/*
 * This file is part of the Validatory package.
 *
 * Copyright (c) 2017-present Friends Of ECMAScript
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Validator from '../core/Validator';

/**
 * @author Mikel Tuesta <mikeltuesta@gmail.com>
 */

const checkboxValidator = new Validator({
  supports: node => node.getAttribute('type') === 'checkbox',
  isEmpty: node => false,
  isValid: node => node.checked,
});

export default checkboxValidator;
