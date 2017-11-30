/*
 * This file is part of the Validatory package.
 *
 * Copyright (c) 2017-present Friends Of ECMAScript
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import FormValidator from './FormValidator';
import getDomNodeValidatorSelector from './../dom/getDomNodeValidatorSelector';
import onDomReady from './../events/onDomReady';
import onNodeAdded from './../events/onNodeAdded';

/**
 * @author Mikel Tuesta <mikeltuesta@gmail.com>
 */
class FormValidators {
  constructor({
    formSelector,
    formElementSelector,
    onFormValidationStateChanged = () => {},
    onFormElementValidationStateChanged = () => {}
  } = {}) {
    this.formSelector = getDomNodeValidatorSelector(formSelector);
    this.formElementSelector = getDomNodeValidatorSelector(formElementSelector);
    this.onFormValidationStateChanged = onFormValidationStateChanged;
    this.onFormElementValidationStateChanged = onFormElementValidationStateChanged;

    this.onDomReady = this.onDomReady.bind(this);
    this.onNodeAdded = this.onNodeAdded.bind(this);
    this.initFormValidator = this.initFormValidator.bind(this);

    this.bindListeners();
  }

  bindListeners() {
    onDomReady(this.onDomReady);
  }

  onDomReady() {
    [...document.querySelectorAll(this.formSelector)].forEach(this.initFormValidator);

    onNodeAdded(this.formSelector, this.onNodeAdded);
  }

  onNodeAdded(nodes) {
    nodes.forEach(this.initFormValidator);
  }

  initFormValidator(formDomNode) {
    new FormValidator({
      formDomNode,
      formElementSelector: this.formElementSelector,
      onFormValidationStateChanged: this.onFormValidationStateChanged,
      onFormElementValidationStateChanged: this.onFormElementValidationStateChanged
    });
  }
}

export default ({
  formSelector,
  formElementSelector,
  onFormValidationStateChanged = () => {},
  onFormElementValidationStateChanged = () => {}
}) => new FormValidators({
  formSelector,
  formElementSelector,
  onFormValidationStateChanged,
  onFormElementValidationStateChanged
});
