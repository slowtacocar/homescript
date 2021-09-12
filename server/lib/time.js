import schedule from "node-schedule";
import SunCalc from "suncalc";

export default async (timeUserData) => ({
  Schedule: class Schedule {
    constructor({ dayOfWeek, hour, minute, second }) {
      this.rule = new schedule.RecurrenceRule();
      this.rule.dayOfWeek = dayOfWeek;
      this.rule.hour = hour;
      this.rule.minute = minute;
      this.rule.second = second;
    }

    run(callback) {
      this.job = schedule.scheduleJob(this.rule, callback);
    }

    stop() {
      this.job.cancel();
    }
  },
  Sunrise: class Sunrise {
    constructor() {
      this.rule = new schedule.RecurrenceRule();
      this.rule.minute = 0;
      this.rule.hour = 0;
    }

    run(callback) {
      this.job = schedule.scheduleJob(this.rule, () => {
        this.sunriseJob = schedule.scheduleJob(
          SunCalc.getTimes(new Date(), timeUserData.long, timeUserData.lat)
            .sunrise,
          callback
        );
      });
    }

    stop() {
      this.job.cancel();
      this.sunriseJob && this.sunriseJob.cancel();
    }
  },
  Sunset: class Sunset {
    constructor() {
      this.rule = new schedule.RecurrenceRule();
      this.rule.minute = 0;
      this.rule.hour = 0;
    }

    run(callback) {
      this.job = schedule.scheduleJob(this.rule, () => {
        schedule.scheduleJob(
          SunCalc.getTimes(new Date(), timeUserData.long, timeUserData.lat)
            .sunset,
          callback
        );
      });
    }

    stop() {
      this.job.cancel();
      this.sunriseJob && this.sunriseJob.cancel();
    }
  },
});
