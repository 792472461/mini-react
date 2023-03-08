export function setValueForStyles(node, styles) {
  const { style } = node;
  for (const styleName in styles) {
    if (!Object.hasOwnProperty.call(styles, styleName)) {
      continue;
    }
    const isCustomProperty = styleName.indexOf('--') === 0;
    if (isCustomProperty) {
      style.setProperty(styleName, styles[styleName]);
    } else {
      style[styleName] = styles[styleName];
    }
  }
}
