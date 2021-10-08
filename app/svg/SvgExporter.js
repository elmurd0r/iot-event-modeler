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
//RED
import startSVGRed from "../svg/red/IoT_Artefakt_Startereignis_Rot.svg";
import actorSVGRed from "../svg/red/Artefakt_Empfangend_Rot.svg";
import actorSubSVGRed from "./default/Artefakt_Empfangend_Sub.svg";
import sensorSVGRed from "../svg/red/Artefakt_Sendend_Rot.svg";
import sensorSubSVGRed from "./default/Artefakt_Senden_Sub.svg";
import catchEventRed from "../svg/red/IoT_Artefakt_Intermediate_Catch_Event_Rot.svg";
import throwEventRed from "../svg/default/IoT_Artefakt_Intermediate_Throw_Event.svg";
import sensorCatchArtefactRed from "../svg/red/IoT_Artefakt_Sendend_Catch_Rot.svg";
//GREEN
import startSVGGreen from "../svg/green/IoT_Artefakt_Startereignis_Gruen.svg";
import actorSVGGreen from "../svg/green/Artefakt_Empfangend_Gruen.svg";
import actorSubSVGGreen from "./default/Artefakt_Empfangend_Sub.svg";
import sensorSVGGreen from "../svg/green/Artefakt_Sendend_Gruen.svg";
import sensorSubSVGGreen from "./default/Artefakt_Senden_Sub.svg";
import catchEventGreen from "../svg/green/IoT_Artefakt_Intermediate_Catch_Event_Gruen.svg";
import throwEventGreen from "../svg/default/IoT_Artefakt_Intermediate_Throw_Event.svg";
import sensorCatchArtefactGreen from "../svg/green/IoT_Artefakt_Sendend_Catch_Gruen.svg";

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
//RED
export const startSVGEncodedRed = svg64(startSVGRed);
export const actorSVGEncodedRed = svg64(actorSVGRed);
export const actorSubSVGEncodedRed = svg64(actorSubSVGRed);
export const sensorSVGEncodedRed = svg64(sensorSVGRed);
export const sensorSubSVGEncodedRed = svg64(sensorSubSVGRed);
export const catchEventEncodedRed = svg64(catchEventRed);
export const throwEventEncodedRed = svg64(throwEventRed);
export const sensorCatchSVGEncodedRed = svg64(sensorCatchArtefactRed);
//GREEN
export const startSVGEncodedGreen = svg64(startSVGGreen);
export const actorSVGEncodedGreen = svg64(actorSVGGreen);
export const actorSubSVGEncodedGreen = svg64(actorSubSVGGreen);
export const sensorSVGEncodedGreen = svg64(sensorSVGGreen);
export const sensorSubSVGEncodedGreen = svg64(sensorSubSVGGreen);
export const catchEventEncodedGreen = svg64(catchEventGreen);
export const throwEventEncodedGreen = svg64(throwEventGreen);
export const sensorCatchSVGEncodedGreen = svg64(sensorCatchArtefactGreen);

