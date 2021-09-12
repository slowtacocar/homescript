import time from "./time.js";

export default async (globalUserData) => ({
  ...(await time(globalUserData.time)),
});
