import { unstable_scheduleCallback } from 'scheduler';
import { getFlag, getTag } from 'shared/console';
import { createWorkInProgress } from './ReactFiber';
import { beginWork } from './ReactFiberBeginWork';
import { commitMutationEffectsOnFiber } from './ReactFiberCommitWork';
import { completeWork } from './ReactFiberComplete';
import { MutationMask, NoFlags } from './ReactFiberFlags';
import { HostRoot } from './ReactWorkTags';

// 正在执行的fiber根节点
let workInProgressRoot = null;
let workInProgress = null;

export function scheduleUpdateOnFiber(root) {
  // 确保调度执行root上的更新
  ensureRootIsScheduled(root);
}

function ensureRootIsScheduled(root) {
  unstable_scheduleCallback(performConcurrentWorkOnRoot.bind(null, root));
}

function performConcurrentWorkOnRoot(root) {
  // 以同步的方式渲染fiber树，初次渲染的时候，都是同步的，因为没有之前的fiber树可以复用
  renderRootSync(root);
  // 进入提交阶段,将fiber树转换成真实的DOM树
  const finishedWork = root.current.alternate;
  root.finishedWork = finishedWork;
  commitRoot(root);
}

function commitRoot(root) {
  // 从根节点开始提交
  const { finishedWork } = root;
  printFinishedWork(finishedWork);

  // 判断子树是否有副作用
  const subTreeHasEffects =
    (finishedWork.subTreeFlags & MutationMask) !== NoFlags;
  // 判断根节点是否有副作用
  const rootHasEffects = (finishedWork.flags & MutationMask) !== NoFlags;
  if (subTreeHasEffects || rootHasEffects) {
    commitMutationEffectsOnFiber(finishedWork, root);
  }
  root.current = finishedWork;
  // root.finishedWork = null;
  // 从根节点开始提交
  // commitWork(finishedWork);
}

function prepareFreshStack(root) {
  workInProgress = createWorkInProgress(root.current, null);
  workInProgressRoot = root;
}

function renderRootSync(root) {
  prepareFreshStack(root);
  workLoopSync();
}

function workLoopSync() {
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress);
  }
}

function performUnitOfWork(unitOfWork) {
  //获取新的fiber对应的老fiber
  const current = unitOfWork.alternate;

  //完成当前fiber的子fiber链表构建后
  const next = beginWork(current, unitOfWork);
  unitOfWork.memoizedProps = unitOfWork.pendingProps;
  if (next === null) {
    //如果没有子节点表示当前的fiber已经完成了
    completeUnitOfWork(unitOfWork);
  } else {
    //如果有子节点，就让子节点成为下一个工作单元
    workInProgress = next;
  }
}

function completeUnitOfWork(unitOfWork) {
  let completedWork = unitOfWork;
  do {
    const current = completedWork.alternate;
    const returnFiber = completedWork.return;
    //执行此fiber 的完成工作,如果是原生组件的话就是创建真实的DOM节点
    completeWork(current, completedWork);
    //如果有弟弟，就构建弟弟对应的fiber子链表
    const siblingFiber = completedWork.sibling;
    if (siblingFiber !== null) {
      workInProgress = siblingFiber;
      return;
    }
    //如果没有弟弟，说明这当前完成的就是父fiber的最后一个节点
    //也就是说一个父fiber,所有的子fiber全部完成了
    completedWork = returnFiber;
    workInProgress = completedWork;
  } while (completedWork !== null);
}

function printFinishedWork(fiber) {
  let { child } = fiber;
  while (child) {
    printFinishedWork(child);
    child = child.sibling;
  }
  if (fiber.flags !== NoFlags) {
    console.log(
      getFlag(fiber.flags),
      getTag(fiber.tag),
      fiber.type,
      fiber.memoizedProps
    );
  }
}
