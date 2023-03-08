import {
  createContainer,
  updateContainer
} from 'react-reconciler/src/ReactFiberReconciler';

function ReactDOMRoot(container) {
  this._internalRoot = container;
}

ReactDOMRoot.prototype.render = function (children) {
  const root = this._internalRoot;
  updateContainer(children, root);
};

export function createRoot(container) {
  const root = createContainer(container);
  return new ReactDOMRoot(root);
}
