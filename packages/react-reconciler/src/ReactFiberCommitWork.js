import { insertBefore, appendChild } from 'react-dom-bindings';
import { getTag } from 'shared/console';
import { MutationMask, NoFlags, Placement } from './ReactFiberFlags';
import {
  FunctionComponent,
  HostComponent,
  HostPortal,
  HostRoot,
  HostText
} from './ReactWorkTags';

export function commitMutationEffectsOnFiber(finishedWork, root) {
  switch (finishedWork.tag) {
    case FunctionComponent:
    case HostRoot:
    case HostComponent:
    case HostText: {
      recursivelyTraverseMutationEffects(finishedWork, root);
      commitReconcileEffects(finishedWork, root);
      break;
    }
  }
}

function recursivelyTraverseMutationEffects(finishedWork, root) {
  if (finishedWork.subTreeFlags & MutationMask) {
    let { child } = finishedWork;
    if (child !== null) {
      commitMutationEffectsOnFiber(child, root);
      child = child.sibling;
    }
  }
}

function commitReconcileEffects(finishedWork, root) {
  const { flags } = finishedWork;
  if (flags & Placement) {
    // 进行插入操作，把DOM节点插入到父节点上
    commitPlacement(finishedWork);
    // 删除Placement标记
    finishedWork.flags &= ~Placement;
  }
}

function commitPlacement(finishedWork) {
  const parentFiber = getHostParentFiber(finishedWork);
  switch (parentFiber.tag) {
    case HostRoot: {
      const parent = parentFiber.stateNode.containerInfo;
      const before = getHostSibling(finishedWork);
      insertOrAppendPlacementNode(finishedWork, parent, before);
      break;
    }
    case HostComponent: {
      const parent = parentFiber.stateNode;
      const before = getHostSibling(finishedWork);
      insertOrAppendPlacementNode(finishedWork, parent, before);
      break;
    }
  }
}

function getHostParentFiber(fiber) {
  let parent = fiber.return;
  while (parent !== null) {
    if (isHostParent(parent)) {
      return parent;
    }
    parent = parent.return;
  }
}

function isHostParent(fiber) {
  return fiber.tag === HostComponent || fiber.tag === HostRoot;
}

function getHostSibling(finishedWork) {
  let node = finishedWork;
  siblings: while (true) {
    while (node.sibling === null) {
      if (node.return === null || isHostParent(node.return)) {
        return null;
      }
      node = node.return;
    }
    node.sibling.return = node.return;
    node = node.sibling;
    // 如果弟弟节点不是原生节点，也不是文本节点
    while (node.tag !== HostComponent && node.tag !== HostText) {
      // 如果弟弟节点没有子节点，就找弟弟的弟弟
      if (node.effectTag & Placement) {
        continue siblings;
      }
      // 如果弟弟节点有子节点，就找弟弟的子节点
      if (node.child === null || node.tag === HostPortal) {
        continue siblings;
      } else {
        node.child.return = node;
        node = node.child;
      }
    }
    if (!(node.effectTag & Placement)) {
      return node.stateNode;
    }
  }
}

function insertOrAppendPlacementNode(node, parent, before) {
  const { tag } = node;
  const isHost = tag === HostComponent || tag === HostText;
  if (isHost) {
    if (before) {
      insertBefore(parent, node.stateNode, before);
    } else {
      appendChild(parent, node.stateNode);
    }
  } else {
    const { child } = node;
    if (child !== null) {
      insertOrAppendPlacementNode(child, parent);
      let sibling = child.sibling;
      while (sibling !== null) {
        insertOrAppendPlacementNode(sibling, parent);
        sibling = sibling.sibling;
      }
    }
  }
}
