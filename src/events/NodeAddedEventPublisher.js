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
class NodeAddedEventPublisher {
  constructor() {
    this.mutationObserver = null;
    this.subscribersSelectors = [];
    this.subscribersOnNodeAddedCallbacks = [];
    this.isMutationObserverInitialized = false;
  }

  initMutationObserver() {
    const
      targetNode = document.body,
      observerConfig = {
        childList: true,
        subtree: true
      };

    const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
    this.mutationObserver = new MutationObserver(this.onNodeMutated.bind(this));
    this.mutationObserver.observe(targetNode, observerConfig);

    this.isMutationObserverInitialized = true;
  }

  subscribe(selector, onNodeAddedCallback) {
    if (this.subscribersSelectors.find(subscriberSelector => subscriberSelector === selector) !== undefined) {
      return;
    }

    this.subscribersSelectors.push(selector);
    this.subscribersOnNodeAddedCallbacks.push(onNodeAddedCallback);

    if (!this.isMutationObserverInitialized) {
      this.initMutationObserver();
    }
  }

  onNodeMutated(mutations) {
    mutations.forEach(mutation =>
      [...mutation.addedNodes]
        .forEach(node => {
          const
            matchedNodesBySelector = this.getMatchedNodesBySelector(node),
            matchedSelectors = Object.keys(matchedNodesBySelector);

          if (matchedSelectors.length === 0) {
            return;
          }

          matchedSelectors.forEach(selector => {
            const subscriberIndex = this.subscribersSelectors.indexOf(selector);

            if (subscriberIndex === -1) {
              return;
            }

            this.subscribersOnNodeAddedCallbacks[subscriberIndex](matchedNodesBySelector[selector], selector);
          });
        })
    );
  }

  getMatchedNodesBySelector(rootNode) {
    let matchedNodesBySelector = {};

    const getMatchedNodesBySelector = (rootNode) => {
      this.subscribersSelectors.forEach(selector => {
        const rootNodeMatchesSelector = [...document.querySelectorAll(selector)].find(matchingNode =>
          matchingNode === rootNode);

        if (rootNodeMatchesSelector) {
          matchedNodesBySelector[selector] = matchedNodesBySelector[selector] !== undefined
            ? matchedNodesBySelector[selector].concat(rootNode)
            : [rootNode];
        }
      });

      [...rootNode.childNodes].forEach(node => getMatchedNodesBySelector(node));
    };

    getMatchedNodesBySelector(rootNode);
    return matchedNodesBySelector;
  }
}

const instance = new NodeAddedEventPublisher();

export default instance;
