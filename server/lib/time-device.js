import SunCalc from "suncalc";

export default async (timeUserData) => ({
  hasSunSet: () => {
    const now = new Date();
    const times = SunCalc.getTimes(now, timeUserData.lat, timeUserData.long);
    if (now.getTime() < times.sunrise.getTime()) {
      return true;
    } else if (now.getTime() < times.sunset.getTime()) {
      return false;
    } else {
      return true;
    }
  },
});
