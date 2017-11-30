/*
 * This file is part of the Validatory package.
 *
 * Copyright (c) 2017-present Friends Of ECMAScript
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import AbstractFormElementValidator from './../core/AbstractFormElementValidator';

/**
 * @author Mikel Tuesta <mikeltuesta@gmail.com>
 */
class FormCheckboxValidator extends AbstractFormElementValidator {
  validateValue(value) {
    return this.formElementDomNode.checked;
  }
}

export default FormCheckboxValidator;
