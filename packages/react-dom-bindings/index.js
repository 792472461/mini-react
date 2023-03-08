import { setInitialProperties } from './src/ReactDOMComponent';

export function shouldSetTextContent(type, props) {
  return (
    type === 'textarea' ||
    type === 'option' ||
    type === 'noscript' ||
    typeof props.children === 'string' ||
    typeof props.children === 'number'
  );
}

export function createTextInstance(text) {
  return document.createTextNode(text);
}

export function createInstance(type, props) {
  const domElement = document.createElement(type);
  return domElement;
}

export function finalizeInitialChildren(
  instance,
  type,
  newProps,
  workInProgress
) {
  setInitialProperties(instance, type, newProps, workInProgress);
}

export function appendInitialChild(parentInstance, child) {
  parentInstance.appendChild(child);
}

export function appendAllChildren(parentInstance, workInProgress) {
  let node = workInProgress.child;
  while (node !== null) {
    parentInstance.appendChild(node.stateNode);
    node = node.sibling;
  }
}

export function insertBefore(parentInstance, child, beforeChild) {
  parentInstance.insertBefore(child, beforeChild);
}

export function insertNode(parentInstance, child, beforeChild) {
  parentInstance.insertBefore(child, beforeChild);
}

export function appendChild(parentInstance, child) {
  parentInstance.appendChild(child);
}
