/*
 * This file is part of the Validatory package.
 *
 * Copyright (c) 2017-present Friends Of ECMAScript
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import isDomNodeDescendantOfDomNode from './../dom/isDomNodeDescendantOfDomNode';
import setDomNodeDataAttributeByValidatorState from './../dom/setDomNodeDataAttributeByValidatorState';
import onDomReady from './../events/onDomReady';
import onNodeAdded from './../events/onNodeAdded';
import FormElementPatternValidator from './../validators/FormElementPatternValidator';
import FormCheckboxValidator from './../validators/FormCheckboxValidator';
import {STATE} from './FormValidatorState';
import {
  preProcessFormElementValidationPattern,
  getFormElementValidatorType,
  VALIDATOR_TYPE
} from './FormElementValidatorTypes';

/**
 * @author Mikel Tuesta <mikeltuesta@gmail.com>
 */
class FormValidator {
  constructor({
    formDomNode,
    formElementSelector,
    onFormValidationStateChanged = () => {},
    onFormElementValidationStateChanged = () => {}
  } = {}) {
    this.formDomNode = formDomNode;
    this.formElementSelector = formElementSelector;
    this.onFormValidationStateChanged = onFormValidationStateChanged;
    this.onFormElementValidationStateChanged = onFormElementValidationStateChanged;
    this.formElements = [];
    this.state = STATE.NOT_VALIDATED;
    setDomNodeDataAttributeByValidatorState(this.formDomNode, this.state);

    this.onDomReady = this.onDomReady.bind(this);
    this.onNodeAdded = this.onNodeAdded.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.initFormElement = this.initFormElement.bind(this);
    this.validateOnFormElementStateChanged = this.validateOnFormElementStateChanged.bind(this);

    this.bindListeners();
  }

  bindListeners() {
    onDomReady(this.onDomReady);
    onNodeAdded(this.formElementSelector, this.onNodeAdded);
    this.formDomNode.addEventListener('submit', this.onFormSubmit);
  }

  onDomReady() {
    [...this.formDomNode.querySelectorAll(this.formElementSelector)].forEach(this.initFormElement);
  }

  onNodeAdded(nodes) {
    [...nodes]
      .filter(node => isDomNodeDescendantOfDomNode(node, this.formDomNode))
      .forEach(formElementNode => this.initFormElement(formElementNode));

    this.setState(this.isValid() ? STATE.VALID : STATE.NOT_VALID);
  }

  initFormElement(formElementDomNode) {
    preProcessFormElementValidationPattern(formElementDomNode);

    const validator = this.getFormElementValidatorInstance(formElementDomNode);

    if (validator === null) {
      return;
    }

    this.formElements.push(validator);

    this.setState(STATE.NOT_VALIDATED);
  }

  onFormSubmit(event) {
    if (this.validate()) {
      return;
    }

    event.preventDefault();
  }

  setState(newState) {
    if (this.state === newState) {
      return;
    }

    this.state = newState;

    setDomNodeDataAttributeByValidatorState(this.formDomNode, this.state);

    this.onFormValidationStateChanged(this);
  }

  isValid() {
    return this.formElements.every(formElement => formElement.isValid());
  }

  validate() {
    let firstInvalidInputIndex = -1;

    const isValid = this.formElements.reduce((isValid, formElement, elementIndex) => {
      const isElementValid = formElement.validate();

      if (isValid && !isElementValid) {
        firstInvalidInputIndex = elementIndex;
      }

      return isValid && isElementValid;
    }, true);

    if (firstInvalidInputIndex !== -1) {
      this.formElements[firstInvalidInputIndex].focus();
    }

    this.setState(isValid ? STATE.VALID : STATE.NOT_VALID);

    return isValid;
  }

  validateOnFormElementStateChanged(formElementValidatorInstance) {
    const isValid = this.isValid();

    this.setState(isValid ? STATE.VALID : STATE.NOT_VALID);

    this.onFormElementValidationStateChanged(formElementValidatorInstance);
  }

  getFormElementValidatorInstance(formElementDomNode) {
    const formElementValidatorType = getFormElementValidatorType(formElementDomNode);

    switch (formElementValidatorType) {
      case VALIDATOR_TYPE.CHECKBOX:
        return new FormCheckboxValidator({
          formElementDomNode,
          onFormElementStateChangedCallback: this.validateOnFormElementStateChanged
        });
      case VALIDATOR_TYPE.PATTERN:
        return new FormElementPatternValidator({
          formElementDomNode,
          onFormElementStateChangedCallback: this.validateOnFormElementStateChanged
        });
    }

    return null;
  }
}

export default FormValidator;
