import {
  HostRoot,
  IndeterminateComponent,
  HostComponent,
  HostText
} from './ReactWorkTags';
import { NoFlags } from './ReactFiberFlags';

export function FiberNode(tag, pendingProps, key) {
  this.tag = tag; // 当前节点的类型, 比如HostRoot, HostComponent, HostText, ClassComponent, FunctionComponent, IndeterminateComponent
  this.key = key; // 当前节点的key
  this.elementType = null;
  this.type = null;
  // 每个fiber节点都有一个stateNode属性，它的值取决于当前节点的类型
  // 虚拟DOM -> fiber -> DOM
  this.stateNode = null;
  this.return = null; // 指向父节点
  this.child = null; // 指向第一个子节点
  this.sibling = null; // 指向下一个兄弟节点
  this.index = 0; // 当前节点在父节点的子节点中的索引
  this.ref = null; // 指向当前节点的ref属性
  this.pendingProps = pendingProps; // 等待需要生效的属性
  this.memoizedProps = null; // 已经生效的属性
  this.updateQueue = null; // 更新队列
  this.memoizedState = null; // 已经生效的状态
  this.dependencies = null;
  this.mode = 0;
  this.effectTag = 0;
  this.nextEffect = null;
  this.firstEffect = null;
  this.lastEffect = null;
  this.alternate = null;
  this.flags = NoFlags;
  this.subtreeFlags = NoFlags;
}

export function createFiber(tag, pendingProps, key) {
  return new FiberNode(tag, pendingProps, key);
}

export function createHostRootFiber() {
  return createFiber(HostRoot, null, null);
}

// 基于当前的fiber节点，创建一个新的fiber节点
export function createWorkInProgress(current, pendingProps) {
  let workInProgress = current.alternate;
  // 如果当前的fiber节点没有alternate属性，说明当前的fiber节点是第一次创建的，那么就创建一个新的fiber节点
  if (workInProgress === null) {
    // Clone from current.
    workInProgress = createFiber(current.tag, pendingProps, current.key);
    workInProgress.elementType = current.elementType;
    workInProgress.type = current.type;
    workInProgress.stateNode = current.stateNode;
    workInProgress.alternate = current;
    current.alternate = workInProgress;
  } else {
    workInProgress.pendingProps = pendingProps;
    workInProgress.type = current.type;
    workInProgress.flags = NoFlags;
    workInProgress.subtreeFlags = NoFlags;
  }
  workInProgress.child = current.child;
  workInProgress.memoizedProps = current.memoizedProps;
  workInProgress.memoizedState = current.memoizedState;
  workInProgress.updateQueue = current.updateQueue;
  workInProgress.sibling = current.sibling;
  workInProgress.index = current.index;
  workInProgress.ref = current.ref;
  return workInProgress;
}

// 根据虚拟DOM创建fiber节点
export function createFiberFromElement(element) {
  const { type, key, props } = element;
  return createFiberFromTypeAndProps(type, key, props);
}

function createFiberFromTypeAndProps(type, key, props) {
  let fiberTag = IndeterminateComponent;
  if (typeof type === 'function') {
    fiberTag = IndeterminateComponent;
  } else if (typeof type === 'string') {
    fiberTag = HostComponent;
  }
  const fiber = createFiber(HostRoot, props, key);
  fiber.elementType = type;
  fiber.type = type;
  fiber.tag = fiberTag;
  return fiber;
}

export function createFiberFromText(content) {
  const fiber = createFiber(HostText, content, null);
  return fiber;
}
