import svg64 from "svg64";

//default
import startSVG from "../svg/default/NewStartSVG.svg";
import actorSVG from "../svg/default/Artefakt_Empfangend.svg";
import actorSubSVG from "./default/Artefakt_Empfangend_Sub.svg";
import sensorSVG from "./default/Artefakt_Sendend.svg";
import sensorSubSVG from "./default/Artefakt_Senden_Sub.svg";
import catchEvent from "../svg/default/IoT_Artefakt_Intermediate_Catch_Event.svg";
import throwEvent from "../svg/default/IoT_Artefakt_Intermediate_Throw_Event.svg";
import sensorCatchArtefact from "../svg/default/IoT_Artefakt_Sendend_Catch.svg";
import sensorCatchArtefactSub from "../svg/default/IoT_Artefakt_Sendend_Catch_Sub.svg";
import endSVG from "../svg/default/IoT_Artefakt_Endereignis.svg";
import artifactObj from "../svg/default/artifact_obj.svg";
//RED
import startSVGRed from "../svg/red/IoT_Artefakt_Startereignis_Rot.svg";
import actorSVGRed from "../svg/red/Artefakt_Empfangend_Rot.svg";
import actorSubSVGRed from "./red/Artefakt_Empfangend_Sub_Rot.svg";
import sensorSVGRed from "../svg/red/Artefakt_Sendend_Rot.svg";
import sensorSubSVGRed from "./red/Artefakt_Sendend_Sub_Rot.svg";
import catchEventRed from "../svg/red/IoT_Artefakt_Intermediate_Catch_Event_Rot.svg";
import throwEventRed from "../svg/red/IoT_Artefakt_Intermediate_Throw_Event_Rot.svg";
import sensorCatchArtefactRed from "../svg/red/IoT_Artefakt_Sendend_Catch_Rot.svg";
import sensorCatchArtefactSubRed from "../svg/red/IoT_Artefakt_Sendend_Catch_Sub_Rot.svg";
import endSVGRed from "../svg/red/IoT_Artefakt_Endereignis_Rot.svg";
import artifactObjRed from "../svg/red/Artefakt_Obj_Rot.svg"
//GREEN
import startSVGGreen from "../svg/green/IoT_Artefakt_Startereignis_Gruen.svg";
import actorSVGGreen from "../svg/green/Artefakt_Empfangend_Gruen.svg";
import actorSubSVGGreen from "./green/Artefakt_Empfangend_Sub_Gruen.svg";
import sensorSVGGreen from "../svg/green/Artefakt_Sendend_Gruen.svg";
import sensorSubSVGGreen from "./green/Artefakt_Sendend_Sub_Gruen.svg";
import catchEventGreen from "../svg/green/IoT_Artefakt_Intermediate_Catch_Event_Gruen.svg";
import throwEventGreen from "../svg/green/IoT_Artefakt_Intermediate_Throw_Event_Gruen.svg";
import sensorCatchArtefactGreen from "../svg/green/IoT_Artefakt_Sendend_Catch_Gruen.svg";
import sensorCatchArtefactSubGreen from "../svg/green/IoT_Artefakt_Sendend_Catch_Sub_Gruen.svg";
import endSVGGreen from "../svg/green/IoT_Artefakt_Endereignis_Gruen.svg";
import artifactObjGreen from "../svg/green/Artefakt_Obj_Gruen.svg"
//ORANGE
import sensorCatchArtefactOrange from "../svg/orange/IoT_Artefakt_Sendend_Catch_Sub_Orange.svg";


//Base 64 encode SVG files
//default
export const startSVGEncoded = svg64(startSVG);
export const actorSVGEncoded = svg64(actorSVG);
export const actorSubSVGEncoded = svg64(actorSubSVG);
export const sensorSVGEncoded = svg64(sensorSVG);
export const sensorSubSVGEncoded = svg64(sensorSubSVG);
export const catchEventEncoded = svg64(catchEvent);
export const throwEventEncoded = svg64(throwEvent);
export const sensorCatchSVGEncoded = svg64(sensorCatchArtefact);
export const sensorCatchSVGEncodedSub = svg64(sensorCatchArtefactSub);
export const endSVGEncoded = svg64(endSVG);
export const objSVGEncoded = svg64(artifactObj);
//RED
export const startSVGEncodedRed = svg64(startSVGRed);
export const actorSVGEncodedRed = svg64(actorSVGRed);
export const actorSubSVGEncodedRed = svg64(actorSubSVGRed);
export const sensorSVGEncodedRed = svg64(sensorSVGRed);
export const sensorSubSVGEncodedRed = svg64(sensorSubSVGRed);
export const catchEventEncodedRed = svg64(catchEventRed);
export const throwEventEncodedRed = svg64(throwEventRed);
export const sensorCatchSVGEncodedRed = svg64(sensorCatchArtefactRed);
export const sensorCatchSVGEncodedSubRed = svg64(sensorCatchArtefactSubRed);
export const endSVGEncodedRed = svg64(endSVGRed);
export const objRedSVGEncoded = svg64(artifactObjRed)
//GREEN
export const startSVGEncodedGreen = svg64(startSVGGreen);
export const actorSVGEncodedGreen = svg64(actorSVGGreen);
export const actorSubSVGEncodedGreen = svg64(actorSubSVGGreen);
export const sensorSVGEncodedGreen = svg64(sensorSVGGreen);
export const sensorSubSVGEncodedGreen = svg64(sensorSubSVGGreen);
export const catchEventEncodedGreen = svg64(catchEventGreen);
export const throwEventEncodedGreen = svg64(throwEventGreen);
export const sensorCatchSVGEncodedGreen = svg64(sensorCatchArtefactGreen);
export const sensorCatchSVGEncodedSubGreen = svg64(sensorCatchArtefactSubGreen);
export const endSVGEncodedGeen = svg64(endSVGGreen);
export const objGreenSVGEncoded = svg64(artifactObjGreen)
//ORANGE
export const sensorCatchSVGEncodedOrange = svg64(sensorCatchArtefactOrange);

