import * as document from "document";
import * as clock from "./simple/clock";
import * as activity from "./simple/activity";
import * as hrm from "./simple/hrm";

/**
 * Datetime code
 */
const hourArc = document.getElementById("hourArc");
const hourCircle = document.getElementById("hourCircle");

const minArc = document.getElementById("minArc");
const minCircle = document.getElementById("minCircle");

const dateArc = document.getElementById("dateArc");
const dateCircle = document.getElementById("dateCircle");

const battArc = document.getElementById("battArc");
const battCircle = document.getElementById("battCircle");

function clockCallback(data) {
    hourArc.sweepAngle = (data.hours / 24) * 360;
    calculateArcEndPoint(hourArc, hourCircle);

    minArc.sweepAngle = (data.mins / 60) * 360;
    calculateArcEndPoint(minArc, minCircle);

    dateArc.sweepAngle = (data.daysPassed / 365) * 360;
    calculateArcEndPoint(dateArc, dateCircle);

    battArc.sweepAngle = (data.power.battery / 100) * 360;
    calculateArcEndPoint(battArc, battCircle);
}

clock.initialize("minutes", "shortDate", clockCallback);

/**
 * STEPS, DISTANCE, AZM, CALORIES
 * Gets your current steps, and alters the arc based on your steps & steps goal.
 */

const stepsArc = document.getElementById("stepsArc");
const distanceArc = document.getElementById("distArc");
const AZMArc = document.getElementById("azmArc");
const caloriesArc = document.getElementById("calArc");
const floorsArc = document.getElementById("floorsArc");

const stepsCircle = document.getElementById("stepsCircle");
const distCircle = document.getElementById("distCircle");
const azmCircle = document.getElementById("azmCircle");
const calCircle = document.getElementById("calCircle");
const floorsCircle = document.getElementById("floorsCircle");

function activityCallback(data) {

    /*
    dateArc.sweepAngle = (Number(data.secs) / 60 * 360)

    stepsArc.sweepAngle = (6000 / data.steps.goal) * 360;
    distanceArc.sweepAngle = (5.4 / (data.distance.goal / 1000)) * 360;
    AZMArc.sweepAngle = (5 / data.activeMinutes.goal) * 360;
    caloriesArc.sweepAngle = (800 / 2000) * 360;
    floorsArc.sweepAngle = (3 / data.elevationGain.goal) * 360;

     */
    stepsArc.sweepAngle = (data.steps.raw / data.steps.goal) * 360;
    distanceArc.sweepAngle = (data.distance.raw / (data.distance.goal / 1000)) * 360;
    AZMArc.sweepAngle = (data.activeMinutes.raw / data.activeMinutes.goal) * 360;
    caloriesArc.sweepAngle = (data.calories.raw / data.calories.goal) * 360;
    floorsArc.sweepAngle = (data.elevationGain.raw / data.elevationGain.goal) * 360;

    calculateArcEndPoint(stepsArc, stepsCircle);
    calculateArcEndPoint(distanceArc, distCircle);
    calculateArcEndPoint(AZMArc, azmCircle);
    calculateArcEndPoint(caloriesArc, calCircle);
    calculateArcEndPoint(floorsArc, floorsCircle);
}

activity.initialize("seconds", activityCallback);

/**
 * Heart Rate code
 * Gets your current hr.
 */

const heartArc = document.getElementById("hrArc");
const heartCircle = document.getElementById("hrCircle");

function hrmCallback(data) {
    let hr = data.bpm;
    if (hr === null) hr = "--";
    if (hr === "--") {
        return
    }

    heartArc.sweepAngle = (hr / 220) * 360;
    calculateArcEndPoint(heartArc, heartCircle);
}

hrm.initialize(hrmCallback);

const arcWidth = 5;

function calculateArcEndPoint(arc, circle, output = false) {

    // We can cheat a lil since each arc is a full circle
    const width = arc.getBBox().width, x = arc.getBBox().x;
    const midPoint = (width / 2) + x, radius = width / 2;

    // Convert degrees to radians
    const sweepAngleRadians = ((arc.sweepAngle - 90) * Math.PI) / 180;

    // Calculate the endpoint coordinates
    const endpointX = midPoint + radius * Math.cos(sweepAngleRadians);
    const endpointY = midPoint + radius * Math.sin(sweepAngleRadians);

    // Finally to counter some sadness we calc an offset. The closer the point is to the max, the more one is added
    const offsetX = arcWidth * ((endpointX - x) / width);
    const offsetY = arcWidth * ((endpointY - x) / width);

    circle.cx = endpointX - offsetX;
    circle.cy = endpointY - offsetY;
}