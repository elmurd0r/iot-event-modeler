import CustomContextPad from './CustomContextPad';
import CustomPalette from './palette/CustomPalette';
import CustomRenderer from './CustomRenderer';
import ResizeTask from "./rules/ResizeTask";
import CustomBpmnReplace from "./replace/CustomBpmnReplace";
import CustomReplaceMenuProvider from "./replace/CustomReplaceMenuProvider";
import CustomPopupMenu from "./replace/CustomPopupMenu";
import CustomRealPalette from "./palette/CustomRealPalette";
import CustomIotArtefactRules from './rules/CustomIotArtefactRules';
import CustomIoTReplaceConnectionBehaviour from './rules/CustomIoTReplaceConnectionBehaviour';

export default {
  __init__: ['CustomIotArtefactRules', 'customContextPad', 'customPalette', 'customRenderer', 'resizeTask', 'replaceMenuProvider', 'bpmnReplace', 'popupMenu', 'palette', 'replaceConnectionBehavior'],
  CustomIotArtefactRules: ['type', CustomIotArtefactRules],
  customContextPad: [ 'type', CustomContextPad ],
  customPalette: [ 'type', CustomPalette ],
  customRenderer: [ 'type', CustomRenderer ],
  resizeTask: [ 'type', ResizeTask],
  replaceMenuProvider: ['type', CustomReplaceMenuProvider],
  bpmnReplace: ['type', CustomBpmnReplace],
  popupMenu: ['type', CustomPopupMenu],
  palette: ['type', CustomRealPalette],
  replaceConnectionBehavior: ['type', CustomIoTReplaceConnectionBehaviour]
};
