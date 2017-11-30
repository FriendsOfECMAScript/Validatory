/*
 * This file is part of the Validatory package.
 *
 * Copyright (c) 2017-present Friends Of ECMAScript
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import * as Patterns from './../patterns/patterns';

/**
 * @author Mikel Tuesta <mikeltuesta@gmail.com>
 */
const VALIDATOR_TYPE = {
  CHECKBOX: 'CHECKBOX',
  PATTERN: 'PATTERN'
};

const
  setDataValidationPatternAttribute = (formElementDomNode, pattern) => {
    formElementDomNode.setAttribute('data-validation-pattern', pattern);
  },
  preProcessFormElementValidationPattern = formElementDomNode => {
    const
      builtInValidationPatternsKeys = ['email', 'phone', 'any'],
      needsPreProcessing = builtInValidationPatternsKeys.some(key =>
        formElementDomNode.hasAttribute(`data-validate-${key}`));

    if (needsPreProcessing) {
      if (formElementDomNode.hasAttribute('data-validate-email')) {
        setDataValidationPatternAttribute(formElementDomNode, Patterns.email);
      } else if (formElementDomNode.hasAttribute('data-validate-phone')) {
        setDataValidationPatternAttribute(formElementDomNode, Patterns.phone);
      } else {
        setDataValidationPatternAttribute(formElementDomNode, Patterns.any);
      }
    }
  },
  getFormElementValidatorType = formElementDomNode => {
    if (formElementDomNode.getAttribute('type') === 'checkbox') {
      return VALIDATOR_TYPE.CHECKBOX;
    } else if (formElementDomNode.hasAttribute('data-validation-pattern')) {
      return VALIDATOR_TYPE.PATTERN;
    }
  };

export {
  VALIDATOR_TYPE,
  preProcessFormElementValidationPattern,
  getFormElementValidatorType
};
