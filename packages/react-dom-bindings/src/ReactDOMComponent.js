import { setValueForStyles } from './CSSPropertyOperations';
import { setValueForProperty } from './DOMPropertyOperations';

const STYLE = 'style';
const CHILDREN = 'children';

function setInitialDOMProperties(tag, props, elemnt, workInProgress) {
  for (const propKey in props) {
    if (!Object.hasOwnProperty.call(props, propKey)) {
      continue;
    }

    const nextProp = props[propKey];
    if (propKey === STYLE) {
      setValueForStyles(elemnt, nextProp);
    } else if (propKey === CHILDREN) {
      // do nothing
      if (typeof nextProp === 'string' || typeof nextProp === 'number') {
        setTextContext(elemnt, `${nextProp}`);
      }
    } else if (nextProp !== null) {
      setValueForProperty(elemnt, propKey, nextProp, workInProgress);
    }
  }
}
export function setInitialProperties(instance, type, props, workInProgress) {
  setInitialDOMProperties(type, props, instance, workInProgress);
}

function setTextContext(node, text) {
  node.textContent = text;
}
