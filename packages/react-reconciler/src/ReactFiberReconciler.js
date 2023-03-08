import { createUpdate, enqueueUpdate } from './ReactFiberClassUpdateQueue';
import { createFiberRoot } from './ReactFiberRoot';
import { markUpdateLaneFromFiberToRoot } from './ReactFiberConcurrentUpdates';
import { scheduleUpdateOnFiber } from './ReactWorkLoop';

export function createContainer(container) {
  return createFiberRoot(container);
}

export function updateContainer(element, container) {
  const current = container.current;
  // 创建更新对象
  const update = createUpdate();
  // 更新对象的payload属性指向需要更新的元素
  update.payload = { element };
  // 需要更新的fiber节点入队
  enqueueUpdate(current, update);
  // 返回根节点，从当前节点开始向上查找，直到找到根节点
  const root = markUpdateLaneFromFiberToRoot(current);
  // 通知调度器，当前fiber节点需要更新
  scheduleUpdateOnFiber(root);
  return root;
}
