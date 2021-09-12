import lifx from "./lifx.js";
import time from "./time-device.js";

export default async (globalUserData) => ({
  ...(await lifx(globalUserData.lifx)),
  ...(await time(globalUserData.time)),
});
