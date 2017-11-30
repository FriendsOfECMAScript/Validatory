/*
 * This file is part of the Validatory package.
 *
 * Copyright (c) 2017-present Friends Of ECMAScript
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {STATE} from './FormValidatorState';
import setDomNodeDataAttributeByValidatorState from './../dom/setDomNodeDataAttributeByValidatorState';
import dispatchNativeEvent from './../dom/dispatchNativeEvent';

/**
 * @author Mikel Tuesta <mikeltuesta@gmail.com>
 */
class AbstractFormElementValidator {

  constructor({
    formElementDomNode,
    onFormElementStateChangedCallback = () => {}
  }) {
    this.formElementDomNode = formElementDomNode;
    this.required = this.formElementDomNode.hasAttribute('required');
    this.validationStateReferenceSelector = this.formElementDomNode.dataset.validationStateReferenceSelector;

    this.onFormElementStateChangedCallback = onFormElementStateChangedCallback;
    this.onFormElementInput = this.onFormElementInput.bind(this);
    this.onFormElementChange = this.onFormElementChange.bind(this);

    this.bindListeners();
    this.setState(STATE.NOT_VALIDATED);
  }

  bindListeners() {
    this.formElementDomNode.addEventListener('input', this.onFormElementInput, true);
    this.formElementDomNode.addEventListener('change', this.onFormElementChange, true);
  }

  onFormElementInput() {
    this.validate();
  }

  onFormElementChange() {
    this.validate();
  }

  getValidationStateReferenceDomNode() {
    return this.validationStateReferenceSelector !== undefined
      ? this.formElementDomNode.closest(this.validationStateReferenceSelector)
      : this.formElementDomNode;
  }

  setState(newState) {
    if (this.state === newState) {
      return;
    }

    this.state = newState;

    setDomNodeDataAttributeByValidatorState(this.getValidationStateReferenceDomNode(), this.state);

    this.onFormElementStateChangedCallback(this);
  }

  focus() {
    dispatchNativeEvent(this.getValidationStateReferenceDomNode(), 'focus');
  }

  validate() {
    const
      isEmpty = this.formElementDomNode.value === '',
      isValid = !this.required && isEmpty || !isEmpty && this.validateValue(this.formElementDomNode.value);

    this.setState(this.required && isEmpty ? STATE.NOT_FILLED : isValid ? STATE.VALID : STATE.NOT_VALID);

    return isValid;
  }

  validateValue(value) { // eslint-disable-line no-unused-vars
    throw new TypeError('In order to extend AbstractFormElementValidator class you must implement validateValue method.');
  }
}

export default AbstractFormElementValidator;
