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
import * as Patterns from './../patterns/patterns';
import {STATE} from './FormValidatorState';
import validatorRegistry from './ValidatorRegistry';
import FormElementValidator from './FormElementValidator';
import checkboxValidator from '../validators/checkboxValidator';
import patternValidator from '../validators/patternValidator';

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

    this.addBuiltInValidators();

    this.onDomReady = this.onDomReady.bind(this);
    this.onNodeAdded = this.onNodeAdded.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.initFormElement = this.initFormElement.bind(this);
    this.validateOnFormElementStateChanged = this.validateOnFormElementStateChanged.bind(this);

    this.bindListeners();
  }

  addBuiltInValidators() {
    validatorRegistry.add(patternValidator);
    validatorRegistry.add(checkboxValidator);
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
    this.preProcessFormElementValidationPattern(formElementDomNode);

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

  setDataValidationPatternAttribute(formElementDomNode, pattern) {
    formElementDomNode.setAttribute('data-validate-pattern', pattern);
  }

  preProcessFormElementValidationPattern(formElementDomNode) {
    const
      builtInValidationPatternsKeys = ['email', 'phone', 'any'],
      needsPreProcessing = builtInValidationPatternsKeys.some(key =>
        formElementDomNode.hasAttribute(`data-validate-${key}`));

    if (needsPreProcessing) {
      if (formElementDomNode.hasAttribute('data-validate-email')) {
        this.setDataValidationPatternAttribute(formElementDomNode, Patterns.email);
      } else if (formElementDomNode.hasAttribute('data-validate-phone')) {
        this.setDataValidationPatternAttribute(formElementDomNode, Patterns.phone);
      } else {
        this.setDataValidationPatternAttribute(formElementDomNode, Patterns.any);
      }
    }
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
    const validator = validatorRegistry.getValidators().find(validator => validator.supports(formElementDomNode));

    if (validator === undefined) {
      return null;
    }

    return new FormElementValidator({
      formElementDomNode,
      emptyFn: validator.isEmpty,
      validationFn: validator.isValid,
      onFormElementStateChangedCallback: this.validateOnFormElementStateChanged
    });
  }
}

export default FormValidator;
