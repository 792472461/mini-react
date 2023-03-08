import { markUpdateLaneFromFiberToRoot } from './ReactFiberConcurrentUpdates';

const UpdateState = 0;
export function intializeUpdateQueue(fiber) {
  // 创建一个更新队列
  // updateQueue 本质是一个循环链表，pending属性指向链表的头节点
  const updateQueue = {
    shared: {
      pending: null
    }
  };
  fiber.updateQueue = updateQueue;
}

export function createUpdate() {
  const update = {
    tag: UpdateState
  };
  update.next = null;
  return update;
}

export function enqueueUpdate(fiber, update) {
  const updateQueue = fiber.updateQueue;
  // 获取链表的头节点
  const pending = updateQueue.shared.pending;
  if (pending === null) {
    // 链表为空，直接将更新对象赋值给链表的头节点
    update.next = update;
  } else {
    // 链表不为空，将更新对象插入到链表的头节点后面
    update.next = pending.next;
    pending.next = update;
  }
  // 将链表的头节点指向更新对象
  updateQueue.shared.pending = update;

  // 通知调度器，当前fiber节点需要更新
  // scheduleWork(fiber);
  return markUpdateLaneFromFiberToRoot(fiber);
}

export function processUpdateQueue(workInProgress) {
  const queue = workInProgress.updateQueue;
  // 获取链表的头节点
  const pending = queue.shared.pending;
  // 如果有需要更新的对象，那么就将链表的头节点指向下一个节点
  if (pending !== null) {
    // 清除等待更新的对象
    queue.shared.pending = null;
    // 获取更新队列中的最后一个更新对象
    const latsPendingUpdate = pending;
    // 获取更新队列中的第一个更新对象
    const firstPendingUpdate = latsPendingUpdate.next;
    // 将更新队列中的最后一个更新对象的next属性指向null
    latsPendingUpdate.next = null;

    let newState = workInProgress.memoizedState;
    let update = firstPendingUpdate;
    while (update) {
      newState = getStateFormUpdate(update, newState);
      update = update.next;
    }
    // 把更新后的state赋值给workInProgress的memoizedState属性
    workInProgress.memoizedState = newState;
  }
}

function getStateFormUpdate(update, prevState) {
  switch (update.tag) {
    case UpdateState: {
      const { payload } = update;
      return Object.assign({}, prevState, payload);
    }
  }
}
