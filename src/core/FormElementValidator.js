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
class FormElementValidator {

  constructor({
    formElementDomNode,
    emptyFn,
    validationFn,
    onFormElementStateChangedCallback = () => {}
  }) {
    this.formElementDomNode = formElementDomNode;
    this.emptyFn = emptyFn;
    this.validationFn = validationFn;
    this.required = this.formElementDomNode.hasAttribute('required');
    this.validationStateReferenceSelector = this.formElementDomNode.dataset.validationStateReferenceSelector;
    this.state = STATE.NOT_VALIDATED;
    setDomNodeDataAttributeByValidatorState(this.getValidationStateReferenceDomNode(), this.state);

    this.onFormElementStateChangedCallback = onFormElementStateChangedCallback;
    this.onFormElementInput = this.onFormElementInput.bind(this);
    this.onFormElementChange = this.onFormElementChange.bind(this);

    this.bindListeners();
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

  isValid() {
    const isEmpty = this.emptyFn(this.formElementDomNode);

    return !this.required && isEmpty || !isEmpty && this.validationFn(this.formElementDomNode);
  }

  validate() {
    const
      isEmpty = this.emptyFn(this.formElementDomNode),
      isValid = this.isValid();

    this.setState(this.required && isEmpty ? STATE.NOT_FILLED : isValid ? STATE.VALID : STATE.NOT_VALID);

    return isValid;
  }
}

export default FormElementValidator;
