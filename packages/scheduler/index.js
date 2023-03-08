export * from './src/forks/Scheduler';

export function unstable_scheduleCallback(callback) {
  requestIdleCallback(callback);
}
