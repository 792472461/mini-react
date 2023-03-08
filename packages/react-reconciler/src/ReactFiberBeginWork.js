import {
  HostRoot,
  HostComponent,
  HostText,
  ClassComponent,
  FunctionComponent,
  IndeterminateComponent
} from './ReactWorkTags';
import { processUpdateQueue } from './ReactFiberClassUpdateQueue';
import { reconcileChildFibers, mountChildFibers } from './ReactChildFiber';
import { shouldSetTextContent } from 'react-dom-bindings';
import logger, { indent } from 'shared/logger';
import { renderWithHooks } from './ReactFiberHooks';

function reconcileChildren(current, workInProgress, nextChildren) {
  // 如果是新fiber，说明是第一次渲染，那么就直接挂载子节点
  if (current === null) {
    workInProgress.child = mountChildFibers(workInProgress, null, nextChildren);
  } else {
    // 如果是更新，那么就协调子节点
    workInProgress.child = reconcileChildFibers(
      workInProgress,
      current.child,
      nextChildren
    );
  }
}

function updateHostRoot(current, workInProgress) {
  processUpdateQueue(workInProgress);
  const nextState = workInProgress.memoizedState;
  const nextChildren = nextState.element;
  // 协调子节点
  reconcileChildren(current, workInProgress, nextChildren);
  return workInProgress.child;
}

function updateHostComponent(current, workInProgress) {
  const { type } = workInProgress;
  const nextProps = workInProgress.pendingProps;
  let nextChildren = nextProps.children;
  // 如果是文本节点，那么就直接返回
  const isDirectTextChild = shouldSetTextContent(type, nextProps);
  if (isDirectTextChild) {
    nextChildren = null;
  }
  reconcileChildren(current, workInProgress, nextChildren);

  return workInProgress.child;
}

function updateHostText(current, workInProgress) {
  return null;
}

function updateClassComponent(current, workInProgress) {
  return null;
}

function updateFunctionComponent(current, workInProgress) {
  return null;
}

function mountIndeterminateComponent(current, workInProgress) {
  const { type, pendingProps } = workInProgress;
  const value = renderWithHooks(current, workInProgress, type, pendingProps);
  workInProgress.tag = FunctionComponent;
  reconcileChildren(current, workInProgress, value);
  return workInProgress.child;
}

export function beginWork(current, workInProgress) {
  logger(' '.repeat(indent.number) + 'beginWork', workInProgress);
  indent.number += 2;
  switch (workInProgress.tag) {
    case HostRoot:
      return updateHostRoot(current, workInProgress);
    // 在react里，函数组件和类组件都是通过IndeterminateComponent来表示的
    case IndeterminateComponent:
      return mountIndeterminateComponent(current, workInProgress);
    case HostComponent:
      return updateHostComponent(current, workInProgress);
    case HostText:
      return null;
    default:
      return null;
  }
}
