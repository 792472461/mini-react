import { Placement, Update } from 'react-reconciler/src/ReactFiberFlags';
import {
  FunctionComponent,
  HostComponent,
  HostRoot,
  HostText
} from 'react-reconciler/src/ReactWorkTags';

export function getFlag(flag) {
  switch (flag) {
    case Placement:
      return '插入';
    case Update:
      return '更新';
  }
  return 'Unknown';
}

export function getTag(tag) {
  switch (tag) {
    case HostRoot:
      return 'HostRoot';
    case HostComponent:
      return 'HostComponent';
    case HostText:
      return 'HostText';
    case FunctionComponent:
      return 'FunctionComponent';
    default:
      return 'Unknown';
  }
}
