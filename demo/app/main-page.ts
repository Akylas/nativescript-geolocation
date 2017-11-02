import * as geolocation from "nativescript-geolocation";
import { Accuracy } from "ui/enums";
import { EventData } from "data/observable";
import { Page } from "ui/page";
import { MainViewModel } from "./main-view-model";

let page: Page;
let model = new MainViewModel();
let watchIds = [];

export function pageLoaded(args: EventData) {
    page = <Page>args.object;
    page.bindingContext = model;
}

export function enableLocationTap() {
    geolocation.enableLocationRequest().then(function () {
        console.log('ok');
    }, function (e) {
        console.log("Error: " + (e.message || e));
    });
}

export function buttonGetLocationTap() {
    let location = geolocation.getCurrentLocation({
        desiredAccuracy: Accuracy.high,
        maximumAge: 5000,
        timeout: 10000
    })
        .then(function (loc) {
            if (loc) {
                model.locations.push(loc);
            }
        }, function (e) {
            console.log("Error: " + (e.message || e));
        });
}

export function buttonStartTap() {
    try {
        watchIds.push(geolocation.watchLocation(
            function (loc) {
                if (loc) {
                    model.locations.push(loc);
                }
            },
            function (e) {
                console.log("Error: " + e.message);
            },
            {
                desiredAccuracy: Accuracy.high,
                updateDistance: 0.1,
                updateTime: 3000,
                minimumUpdateTime: 100
            }));
    } catch (ex) {
        console.log("Error: " + ex.message);
    }
}

export function buttonStopTap() {
    let watchId = watchIds.pop();
    while (watchId != null) {
        geolocation.clearWatch(watchId);
        watchId = watchIds.pop();
    }
}

export function buttonClearTap() {
    model.locations.splice(0, model.locations.length);
}
