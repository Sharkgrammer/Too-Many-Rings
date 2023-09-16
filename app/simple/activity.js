/*
  A simple way of returning activity data in the correct format based on user preferences.
  Callback should be used to update your UI.
*/
import {me} from "appbit";
import clock from "clock";
import {today, goals, primaryGoal} from "user-activity";
import {units} from "user-settings";

let activityCallback;

export function getPrimaryGoal() {
    if (me.permissions.granted("access_activity")) {
        return primaryGoal;
    } else {
        return "steps";
    }
}

export function initialize(granularity, callback) {
    if (me.permissions.granted("access_activity")) {
        clock.granularity = granularity;
        clock.addEventListener("tick", tickHandler);
        activityCallback = callback;

    } else {
        console.log("Denied User Activity permission");
        callback({
            steps: getDeniedStats(),
            calories: getDeniedStats(),
            distance: getDeniedStats(),
            elevationGain: getDeniedStats(),
            activeMinutes: getDeniedStats()
        });
    }
}

let activityData = () => {
    return {
        steps: getSteps(),
        calories: getCalories(),
        distance: getDistance(),
        elevationGain: getElevationGain(),
        activeMinutes: getActiveMinutes()
    };
}

function tickHandler(evt) {
    activityCallback(activityData());
}

function getActiveMinutes() {
    let val = (today.adjusted.activeZoneMinutes.total || 0);
    return {
        raw: val,
        pretty: (val < 60 ? "" : Math.floor(val / 60) + "h ") + ((val % 60)) + "m",
        goal: goals.activeZoneMinutes.total
    }
}

function getCalories() {
    let val = (today.adjusted.calories || 0);
    return {
        raw: val,
        pretty: val > 999 ? Math.floor(val / 1000) + "," + ("00" + (val % 1000)).slice(-3) : val,
        goal: goals.calories
    }
}

function getDistance() {
    let val = (today.adjusted.distance || 0) / 1000;
    let u = "km";
    if (units.distance === "us") {
        val *= 0.621371;
        u = "mi";
    }

    return {
        raw: val,
        pretty: `${val.toFixed(2)}`,
        goal: goals.distance
    }
}

function getElevationGain() {
    let val = today.adjusted.elevationGain || 0;
    return {
        raw: val,
        pretty: `${val}`,
        goal: goals.elevationGain
    }
}

function getSteps() {
    let val = (today.adjusted.steps || 0);
    return {
        raw: val,
        pretty: val > 999 ? Math.floor(val / 1000) + "," + ("00" + (val % 1000)).slice(-3) : val,
        goal: goals.steps
    }
}

function getDeniedStats() {
    return {
        raw: 0,
        pretty: "Denied"
    }
}