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
class FormElementPatternValidator extends AbstractFormElementValidator {
  constructor({
    formElementDomNode,
    onFormElementStateChangedCallback = () => {}
  }) {
    super({formElementDomNode, onFormElementStateChangedCallback});

    this.validationRegExp = new RegExp(this.formElementDomNode.dataset.validationPattern.trim());
  }

  validateValue(value) {
    return this.validationRegExp.test(value);
  }
}

export default FormElementPatternValidator;
