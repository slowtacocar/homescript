import { VM } from "vm2";

export default class Script {
  constructor(user, doc) {
    this.trigger = new user.triggers[doc.trigger.name](doc.trigger.params);
    this.trigger.run(() => {
      const vm = new VM({ sandbox: user.devices });
      vm.run(`(async () => {${doc.script}})()`);
      console.log("Running trigger");
    });
  }

  stop() {
    this.trigger.stop();
  }
}
