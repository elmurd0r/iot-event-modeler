import CustomContextPad from './CustomContextPad';
import CustomPalette from './CustomPalette';
import CustomRenderer from './CustomRenderer';
import ResizeTask from "./ResizeTask";

export default {
  __init__: [ 'customContextPad', 'customPalette', 'customRenderer', 'resizeTask'],
  customContextPad: [ 'type', CustomContextPad ],
  customPalette: [ 'type', CustomPalette ],
  customRenderer: [ 'type', CustomRenderer ],
  resizeTask: [ 'type', ResizeTask]
};
