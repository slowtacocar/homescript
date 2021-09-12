import getTriggers from "./lib/triggers.js";
import getDevices from "./lib/devices.js";

export default class User {
  constructor(doc) {
    this.update(doc);
  }

  update(doc) {
    this.promise = Promise.all([
      getTriggers(doc.global).then((triggers) => {
        this.triggers = triggers;
      }),
      getDevices(doc.global).then((devices) => {
        this.devices = devices;
      }),
    ]);
  }
}
