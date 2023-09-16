/*
  A simple clock which renders the current time and date in a digital format.
  Callback should be used to update your UI.
*/
import clock from "clock";
import {preferences} from "user-settings";

import {days, months, monthsShort} from "./locales/en.js";
import * as util from "./utils";
import {battery, charger} from "power";

let dateFormat, clockCallback;

export function initialize(granularity, dateFormatString, callback) {
    dateFormat = dateFormatString;
    clock.granularity = granularity;
    clockCallback = callback;
    clock.addEventListener("tick", tickHandler);
}

function tickHandler(evt) {
    let today = evt.date;

    let hours = today.getHours();
    let mins = util.zeroPad(today.getMinutes());

    const endOfYear = new Date(today.getFullYear(), 11, 31);
    const millisecondsInADay = 24 * 60 * 60 * 1000;

    const timeDifference = endOfYear - today;
    const daysPassed = 365 - Math.ceil(timeDifference / millisecondsInADay);


    // Use the power api to get battery level
    let batNum = Math.floor(battery.chargeLevel);
    let isCharging = charger.connected;
    let power = {battery: batNum, charging: isCharging};

    clockCallback({mins: mins, daysPassed: daysPassed, power: power, hours: hours});
}
