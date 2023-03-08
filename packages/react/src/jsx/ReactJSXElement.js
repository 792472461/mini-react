import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbols';
const RESOLVED_PROPS = {
  key: true,
  ref: true,
  __self: true,
  __source: true
};
// 判断是否有ref属性
function hasValidRef(config) {
  return config.ref !== undefined;
}

// 判断是否有key属性
function hasValidKey(config) {
  return config.key !== undefined;
}

function ReactElement(type, key, ref, props) {
  const element = {
    // This tag allows us to uniquely identify this as a React Element
    $$typeof: REACT_ELEMENT_TYPE,

    // Built-in properties that belong on the element
    type: type,
    key: key,
    ref: ref,
    props: props

    // Record the component responsible for creating this element.
    // _owner: currentOwner
  };

  return element;
}

export function jsxDEV(type, config) {
  let propName;
  const props = {};
  let key = null;
  let ref = null;
  if (hasValidKey(config)) {
    key = `${config.key}`;
  }
  if (hasValidRef(config)) {
    ref = config.ref;
  }
  for (propName in config) {
    if (
      hasOwnProperty.call(config, propName) &&
      !RESOLVED_PROPS.hasOwnProperty.call(propName)
    ) {
      props[propName] = config[propName];
    }
  }
  return ReactElement(type, key, ref, props);
}
