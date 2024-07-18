import React from "react";
import ReactDOM from "react-dom";
import MapView2 from "../app/MapView2";

interface MainPageProps {
  height: string;
  width: string;
  zoomLevel: number;
  mqttServerAddress: string;
  mqttServerPort: number;
  mqttServerUser: string;
  mqttServerPassword: string;
  mqttTopic: string;
  tileUrl: string;
}

Module.register<MainPageProps>("MMM-TeslamateLocation2", {
  defaults: {
    height: "300px",
    width: "100%",
    zoomLevel: 17,
    mqttServerAddress: "",
    mqttServerPort: 1883,
    mqttServerUser: "",
    mqttServerPassword: "",
    mqttTopic: "teslamate/cars/2/+",
    tileUrl: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  },

  isLoaded: false,
  appRef: null,

  start: function () {
    console.log(
      this.name +
        ": Setting up connection to MQTT Broker " +
        this.config.mqttServerAddress +
        " at port " +
        this.config.mqttServerPort
    );
    this.sendSocketNotification("MQTT_CONFIG2", this.config);
  },

  getDom: function () {
    const container = document.createElement("div");
    container.classList.add("mmm-teslamatelocation2-app");
    return container;
  },

  createMap: function () {
    const mainDivs = document.getElementsByClassName(
      "mmm-teslamatelocation2-app"
    );
    if (mainDivs.length > 0) {
      const sub = document.createElement("div");
      sub.style.width = this.config.width;
      sub.style.height = this.config.height;
      mainDivs[0].appendChild(sub);
      ReactDOM.render(
        <MapView2
          zoomLevel={this.config.zoomLevel}
          tileUrl={this.config.tileUrl}
        />,
        sub
      );
    }
  },

  socketNotificationReceived: function (
    notification,
    payload: { topic: string; value: string }
  ) {
    console.log(
      this.name +
        " socketNotificationReceived " +
        notification +
        " Topic: " +
        payload.topic +
        " JSON: " +
        payload.value
    );
    if (notification === "MQTT_PAYLOAD2") {
      if (payload != null) {
        const value = parseFloat(payload.value);
        if (payload.topic.endsWith("latitude")) {
          if ((window as any).setLatitude2) {
            (window as any).setLatitude2(value);
          }
        }
        if (payload.topic.endsWith("longitude")) {
          if ((window as any).setLongitude2) {
            (window as any).setLongitude2(value);
          }
        }
      }
    }
  },

  notificationReceived: function (notification, payload, sender) {
    if (notification === "DOM_OBJECTS_CREATED") {
      this.createMap();
    }
  },

  getStyles: function () {
    return [this.file("leaflet2.css")];
  }
});
