import svg64 from "svg64";

//default
import startSVG from "../svg/default/NewStartSVG.svg";
import actorSVG from "../svg/default/Artefakt_Empfangend.svg";
import actorSubSVG from "./default/Artefakt_Empfangend_Sub.svg";
import sensorSVG from "./default/Artefakt_Sendend.svg";
import sensorSubSVG from "./default/Artefakt_Senden_Sub.svg";
import artefaktObjSVG from "../svg/default/Artefakt_Allgemein.svg";
import catchEvent from "../svg/default/IoT_Artefakt_Intermediate_Catch_Event.svg";
import throwEvent from "../svg/default/IoT_Artefakt_Intermediate_Throw_Event.svg";
//RED
import startSVGRed from "../svg/red/IoT_Artefakt_Startereignis_Rot.svg";
import actorSVGRed from "../svg/red/Artefakt_Empfangend_Rot.svg";
import actorSubSVGRed from "./default/Artefakt_Empfangend_Sub.svg";
import sensorSVGRed from "../svg/red/Artefakt_Sendend_Rot.svg";
import sensorSubSVGRed from "./default/Artefakt_Senden_Sub.svg";
import artefaktObjSVGRed from "../svg/default/Artefakt_Allgemein.svg";
import catchEventRed from "../svg/red/IoT_Artefakt_Intermediate_Catch_Event_Rot.svg";
import throwEventRed from "../svg/default/IoT_Artefakt_Intermediate_Throw_Event.svg";
//GREEN
import startSVGGreen from "../svg/green/IoT_Artefakt_Startereignis_Gruen.svg";
import actorSVGGreen from "../svg/green/Artefakt_Empfangend_Gruen.svg";
import actorSubSVGGreen from "./default/Artefakt_Empfangend_Sub.svg";
import sensorSVGGreen from "../svg/green/Artefakt_Sendend_Gruen.svg";
import sensorSubSVGGreen from "./default/Artefakt_Senden_Sub.svg";
import artefaktObjSVGGreen from "../svg/default/Artefakt_Allgemein.svg";
import catchEventGreen from "../svg/green/IoT_Artefakt_Intermediate_Catch_Event_Gruen.svg";
import throwEventGreen from "../svg/default/IoT_Artefakt_Intermediate_Throw_Event.svg";

//Base 64 encode SVG files
//default
const startSVGEncoded = svg64(startSVG);
const actorSVGEncoded = svg64(actorSVG);
const actorSubSVGEncoded = svg64(actorSubSVG);
const sensorSVGEncoded = svg64(sensorSVG);
const sensorSubSVGEncoded = svg64(sensorSubSVG);
const artefaktObjSVGEncoded = svg64(artefaktObjSVG);
const catchEventEncoded = svg64(catchEvent);
const throwEventEncoded = svg64(throwEvent);
//RED
const startSVGEncodedRed = svg64(startSVGRed);
const actorSVGEncodedRed = svg64(actorSVGRed);
const actorSubSVGEncodedRed = svg64(actorSubSVGRed);
const sensorSVGEncodedRed = svg64(sensorSVGRed);
const sensorSubSVGEncodedRed = svg64(sensorSubSVGRed);
const artefaktObjSVGEncodedRed = svg64(artefaktObjSVGRed);
const catchEventEncodedRed = svg64(catchEventRed);
const throwEventEncodedRed = svg64(throwEventRed);
//GREEN
const startSVGEncodedGreen = svg64(startSVGGreen);
const actorSVGEncodedGreen = svg64(actorSVGGreen);
const actorSubSVGEncodedGreen = svg64(actorSubSVGGreen);
const sensorSVGEncodedGreen = svg64(sensorSVGGreen);
const sensorSubSVGEncodedGreen = svg64(sensorSubSVGGreen);
const artefaktObjSVGEncodedGreen = svg64(artefaktObjSVGGreen);
const catchEventEncodedGreen = svg64(catchEventGreen);
const throwEventEncodedGreen = svg64(throwEventGreen);


export {startSVGEncoded, actorSVGEncoded, actorSubSVGEncoded, sensorSVGEncoded, sensorSubSVGEncoded, artefaktObjSVGEncoded, catchEventEncoded,
    throwEventEncoded, startSVGEncodedRed, actorSVGEncodedRed, actorSubSVGEncodedRed, sensorSVGEncodedRed, sensorSubSVGEncodedRed,
    artefaktObjSVGEncodedRed, catchEventEncodedRed, throwEventEncodedRed, startSVGEncodedGreen, actorSVGEncodedGreen,
    actorSubSVGEncodedGreen, sensorSVGEncodedGreen, sensorSubSVGEncodedGreen, artefaktObjSVGEncodedGreen, catchEventEncodedGreen, throwEventEncodedGreen }
