/**
 * 函数组件的渲染
 * @param {*} current 老fiber
 * @param {*} workInProgress 新fiber
 * @param {*} Compoent 函数组件
 * @param {*} props 属性
 * @returns 虚拟DOM或者React元素
 */
export function renderWithHooks(current, workInProgress, Compoent, props) {
  const children = Compoent(props);
  return children;
}
