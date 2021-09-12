import fetcher from "@homescript/lib/fetcher.js";
import camelCase from "lodash/camelCase.js";

class Lifx {
  constructor(selector, apiKey) {
    this.selector = selector;
    this.apiKey = apiKey;
  }

  async isOn() {
    const res = await fetcher(
      `https://api.lifx.com/v1/lights/${this.selector}`,
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      }
    );

    return res[0].power === "on";
  }

  async getBrightness() {
    const res = await fetcher(
      `https://api.lifx.com/v1/lights/${this.selector}`,
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      }
    );

    return res.brightness;
  }

  async turnOff(duration) {
    await fetcher(`https://api.lifx.com/v1/lights/${this.selector}/state`, {
      method: "PUT",
      body: {
        power: "off",
        duration,
      },
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
    });
  }

  async turnOn(duration) {
    await fetcher(`https://api.lifx.com/v1/lights/${this.selector}/state`, {
      method: "PUT",
      body: {
        power: "on",
        duration,
      },
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
    });
  }

  async setBrightness(brightness) {
    await fetcher(
      `https://api.lifx.com/v1/lights/${this.selector}/state`,

      {
        method: "PUT",
        body: {
          brightness,
        },
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      }
    );
  }

  async setColor(color) {
    await fetcher(
      `https://api.lifx.com/v1/lights/${this.selector}/state`,

      {
        method: "PUT",
        body: {
          color,
        },
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      }
    );
  }
}

export default async (lifxUserData) => {
  const res = await fetcher("https://api.lifx.com/v1/lights/all", {
    headers: {
      Authorization: `Bearer ${lifxUserData.apiKey}`,
    },
  });

  const lights = {};

  for (const light of res) {
    lights[camelCase(light.label)] = new Lifx(
      `id:${light.id}`,
      lifxUserData.apiKey
    );
    const group = camelCase(light.group.name);
    if (!lights[group]) {
      lights[group] = new Lifx(
        `group_id:${light.group.id}`,
        lifxUserData.apiKey
      );
    }
  }

  return lights;
};
