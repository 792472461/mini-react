import { createHostRootFiber } from './ReactFiber';
import { intializeUpdateQueue } from './ReactFiberClassUpdateQueue.js';
function FiberRootNode(containerInfo) {
  this.containerInfo = containerInfo;
}

export function createFiberRoot(containerInfo) {
  const root = new FiberRootNode(containerInfo);
  // HOSTRoot就是指向根节点div#root的fiber
  const uninitializedFiber = createHostRootFiber();
  // 根容器的current属性指向根节点div#root的fiber
  root.current = uninitializedFiber;
  // 根fiber的stateNode属性指向根容器，也就是真实的DOM节点
  uninitializedFiber.stateNode = root;
  // 初始化更新队列
  intializeUpdateQueue(uninitializedFiber);
  return root;
}
