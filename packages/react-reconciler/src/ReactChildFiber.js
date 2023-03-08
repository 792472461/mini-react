import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbols';
import { createFiberFromElement, createFiberFromText } from './ReactFiber';
import { Placement } from './ReactFiberFlags';

function createChildReconciler(shouldTrackSideEffects) {
  function placeSingleChild(newFiber) {
    if (shouldTrackSideEffects && newFiber.alternate === null) {
      // 表示当前fiber节点是新创建的，需要插入到dom树中
      newFiber.flags |= Placement;
    }
    return newFiber;
  }
  function reconcileSingleElement(returnFiber, currentFiber, element) {
    // 初次挂载的时候，老节点currentFiber为null,所以直接创建新节点
    const created = createFiberFromElement(element);
    created.return = returnFiber;
    return created;
  }

  function reconcileSingleTextNode(returnFiber, currentFiber, textContent) {
    return null;
  }

  function createChild(returnFiber, newChild) {
    if (
      (typeof newChild === 'string' && newChild !== '') ||
      typeof newChild === 'number'
    ) {
      const created = createFiberFromText(`${newChild}`);
      created.return = returnFiber;
      return created;
    }
    if (typeof newChild === 'object' && newChild !== null) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE: {
          const created = createFiberFromElement(newChild);
          created.return = returnFiber;
          return created;
        }
        default:
          break;
      }
    }
    return null;
  }
  function placeChild(newFiber, newIndex) {
    newFiber.index = newIndex;
    if (shouldTrackSideEffects && newFiber.alternate === null) {
      // 标记当前fiber节点是新创建的，需要插入到dom树中
      newFiber.flags |= Placement;
    }
  }
  function reconcileChildrenArray(returnFiber, currentFiber, newChildren) {
    let resultingFirstChild = null;
    let previousNewFiber = null;
    let newIndex = 0;
    for (; newIndex < newChildren.length; newIndex++) {
      const newFiber = createChild(returnFiber, newChildren[newIndex]);
      if (newFiber === null) {
        continue;
      }
      placeChild(newFiber, newIndex);
      if (previousNewFiber === null) {
        resultingFirstChild = newFiber;
      } else {
        previousNewFiber.sibling = newFiber;
      }
      previousNewFiber = newFiber;
    }
    return resultingFirstChild;
  }

  function reconclileChildFiber(returnFiber, currentFirstFiber, newChild) {
    if (typeof newChild === 'object' && newChild !== null) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE:
          return placeSingleChild(
            reconcileSingleElement(returnFiber, currentFirstFiber, newChild)
          );
        default:
          // return placeSingleChild(
          //   reconcileSingleTextNode(returnFiber, currentFiber, '' + newChild)
          // );
          break;
      }
    }
    if (Array.isArray(newChild)) {
      return reconcileChildrenArray(returnFiber, currentFirstFiber, newChild);
    }
    return null;
  }

  return reconclileChildFiber;
}

export const mountChildFibers = createChildReconciler(false);
export const reconcileChildFibers = createChildReconciler(true);
