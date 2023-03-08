import {
  createInstance,
  createTextInstance,
  appendInitialChild
} from 'react-dom-bindings';
import { finalizeInitialChildren } from 'react-dom-bindings/index';
import logger, { indent } from 'shared/logger';
import { NoFlags } from './ReactFiberFlags';
import { HostComponent, HostRoot, HostText } from './ReactWorkTags';

export function completeWork(current, workInProgress) {
  indent.number -= 2;
  logger(' '.repeat(indent.number) + 'completeWork', workInProgress);

  const newProps = workInProgress.pendingProps;
  switch (workInProgress.tag) {
    case HostRoot: {
      // 如果是根节点，那么就把根节点的DOM节点挂载到真实的DOM节点上
      bubbleProperties(workInProgress);
      break;
    }
    case HostComponent: {
      // 如果是普通节点，那么就把子节点的DOM节点挂载到父节点上
      const { type } = workInProgress;
      const instance = createInstance(type, newProps, workInProgress);
      workInProgress.stateNode = instance;
      appendAllChildren(instance, workInProgress);
      finalizeInitialChildren(instance, type, newProps, workInProgress);
      bubbleProperties(workInProgress);
      break;
    }
    case HostText: {
      // 如果是文本节点，那么就创建文本节点
      const newText = newProps;
      workInProgress.stateNode = createTextInstance(newText);
      // 向上冒泡属性
      bubbleProperties(workInProgress);
      break;
    }
    default:
      break;
  }
}

function bubbleProperties(workInProgress) {
  let subTreeFlags = NoFlags;
  // 遍历fiber的所有子节点，收集所有的子节点的副作用，然后把这些副作用合并到父节点上
  let node = workInProgress.child;
  while (node !== null) {
    subTreeFlags |= node.subTreeFlags;
    subTreeFlags |= node.flags;
    node = node.sibling;
  }
  workInProgress.subTreeFlags = subTreeFlags;
}

function appendAllChildren(parentInstance, workInProgress) {
  let node = workInProgress.child;
  while (node !== null) {
    if (node.tag === HostText || node.tag === HostComponent) {
      appendInitialChild(parentInstance, node.stateNode);
    } else if (node.child !== null) {
      node = node.child;
      continue;
    }
    if (node === workInProgress) {
      break;
    }
    while (node.sibling === null) {
      if (node.return === null || node.return === workInProgress) {
        break;
      }
      node = node.return;
    }
    node = node.sibling;
  }
}
