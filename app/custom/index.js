import CustomContextPad from './CustomContextPad';
import CustomPalette from './palette/CustomPalette';
import CustomRenderer from './CustomRenderer';
import ResizeTask from "./ResizeTask";
import CustomBpmnReplace from "./replace/CustomBpmnReplace";
import CustomReplaceMenuProvider from "./replace/CustomReplaceMenuProvider";
import CustomPopupMenu from "./replace/CustomPopupMenu";
import CustomRealPalette from "./palette/CustomRealPalette";
import CustomIotArtefactRules from './rules/CustomIotArtefactRules'

export default {
  __init__: ['CustomIotArtefactRules', 'customContextPad', 'customPalette', 'customRenderer', 'resizeTask', 'replaceMenuProvider', 'bpmnReplace', 'popupMenu', 'palette'],
  CustomIotArtefactRules: ['type', CustomIotArtefactRules],
  customContextPad: [ 'type', CustomContextPad ],
  customPalette: [ 'type', CustomPalette ],
  customRenderer: [ 'type', CustomRenderer ],
  resizeTask: [ 'type', ResizeTask],
  replaceMenuProvider: ['type', CustomReplaceMenuProvider],
  bpmnReplace: ['type', CustomBpmnReplace],
  popupMenu: ['type', CustomPopupMenu],
  palette: ['type', CustomRealPalette]
};
