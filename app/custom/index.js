import CustomContextPad from './CustomContextPad';
import CustomPalette from './palette/CustomPalette';
import CustomRenderer from './CustomRenderer';
import ResizeTask from "./ResizeTask";
import CustomBpmnReplace from "./replace/CustomBpmnReplace";
import CustomReplaceMenuProvider from "./replace/CustomReplaceMenuProvider";
import CustomPopupMenu from "./replace/CustomPopupMenu";
import CustomRealPalette from "./palette/CustomRealPalette";

export default {
  __init__: [ 'customContextPad', 'customPalette', 'customRenderer', 'resizeTask', 'replaceMenuProvider', 'bpmnReplace', 'popupMenu', 'palette'],
  customContextPad: [ 'type', CustomContextPad ],
  customPalette: [ 'type', CustomPalette ],
  customRenderer: [ 'type', CustomRenderer ],
  resizeTask: [ 'type', ResizeTask],
  replaceMenuProvider: ['type', CustomReplaceMenuProvider],
  bpmnReplace: ['type', CustomBpmnReplace],
  popupMenu: ['type', CustomPopupMenu],
  palette: ['type', CustomRealPalette]
};
