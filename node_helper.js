const mqtt = require("mqtt");
const NodeHelper = require("node_helper");
const Log = require("../../js/logger.js");
var node_helper_config;

module.exports = NodeHelper.create({
  start: function () {
    this.log("Starting node helper");
    this.loaded = false;
  },

  makeServerKey: function (address, port, user) {
    return "" + address + ":" + (port | ("1883" + user));
  },

  log: function (...args) {
    //if (node_helper_config.logging) {
      Log.log('['+ this.name + '] ' + args);
    //}
  },

  formatDateTime: function (secs) {
    //this.log("Secs", secs);
    var epoch = new Date(0);
    epoch.setSeconds(parseInt(secs));
    //this.log("Epoch", epoch);
    var date = epoch.toISOString();
    //this.log("date", date);
    this.log(
      "toLocaleTime",
      epoch.toLocaleTimeString(node_helper_config.localeStr)
    );
    var dateStr = date.split(".")[0].split("T")[0];
    return (
      dateStr.split("-")[2] +
      "." +
      dateStr.split("-")[1] +
      " " +
      epoch.toLocaleTimeString(node_helper_config.localeStr).split(":")[0] +
      ":" +
      epoch.toLocaleTimeString(node_helper_config.localeStr).split(":")[1]
    );
  },

  startClient: function (config) {
    node_helper_config = config;
    this.log("Starting client for: " + config.mqttServerAddress);

    var self = this;

    var serverKey = this.makeServerKey(
      config.mqttServerAddress,
      config.mqttServerPort,
      config.mqttServerUser
    );
    var server = {};

    server.serverKey = serverKey;
    server.address = config.mqttServerAddress;
    server.port = config.mqttServerPort;
    server.options = {};
    if (config.mqttServerUser) server.options.username = config.mqttServerUser;
    if (config.mqttServerPassword)
      server.options.password = config.mqttServerPassword;
    server.topics = [
      config.mqttTopic + "/latitude",
      config.mqttTopic + "/longitude"
    ];

    var mqttServer =
      (server.address.match(/^mqtts?:\/\//) ? "" : "mqtt://") + server.address;
    if (server.port) {
      mqttServer = mqttServer + ":" + server.port;
    }
    this.log("Connecting to " + mqttServer);

    server.client = mqtt.connect(mqttServer, server.options);

    server.client.on("error", function (err) {
      self.log(server.serverKey,"Error: " + err)
    });

    server.client.on("reconnect", function (err) {
      server.value = "reconnecting"; // Hmmm...
      self.log(server.serverKey + " reconnecting")
    });

    server.client.on("message", function (topic, payload) {
      self.log(topic, payload.toString());
      var now = Date.now();
      var nowStr = self.formatDateTime(now / 1000);
      //self.log(topic,now,nowStr);
      self.sendSocketNotification("MQTT_PAYLOAD2", {
        serverKey: server.serverKey,
        topic: topic,
        value: payload.toString(),
        time: now,
        timeStr: nowStr
      });
    });

    server.client.on("connect", function (connack) {
      self.log("connected to " + mqttServer);
      self.log("subscribing to " + server.topics);
      setTimeout(() => { server.client.subscribe(server.topics); }, 10000);
    });
  },

  socketNotificationReceived: function (notification, payload) {
    var self = this;
    this.log("Notification received: " ,notification , JSON.stringify(payload));

    if (notification === "MQTT_CONFIG2") {
      var config = payload;
      //this.log("MQTT_CONFIG2: " ,JSON.stringify(config))
      self.startClient(config);
      self.loaded = true;
    }
  }
});
