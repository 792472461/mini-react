import { HostRoot } from './ReactWorkTags';
export function markUpdateLaneFromFiberToRoot(sourceFiber, lane) {
  let node = sourceFiber; // 当前fiber
  let parent = sourceFiber.return; // 当前fiber的父节点
  while (parent !== null) {
    node = parent;
    parent = node.return;
  }
  if (node.tag === HostRoot) {
    // node指向根节点
    const root = node.stateNode;
    // 根节点的pendingLanes属性指向需要更新的lane
    root.pendingLanes |= lane;
    return root;
  }
  // node指向根节点
  const root = node.stateNode;
  // 根节点的pendingLanes属性指向需要更新的lane
  root.pendingLanes |= lane;
  return root;
}
