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

const validators = [];

const addValidator = validatorObj => {
  validators.unshift(validatorObj);
};

const validatorsRegistry = {
  getValidators: () => [...validators],
  add: addValidator
};

export default validatorsRegistry;
