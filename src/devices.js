import camelCase from "lodash/camelCase";

const lifx = [
  {
    name: "async isOn()",
    description: "Gets whether or not the light is on",
    params: [],
    returns: {
      type: "boolean",
      description: "True if the light is on, false if the light is off",
    },
  },
  {
    name: "async getBrightness()",
    description: "Gets the brightness level of the light",
    params: [],
    returns: {
      type: "double",
      description: "The brightness level from 0.0 to 1.0",
    },
  },
  {
    name: "async turnOff([duration])",
    description: "Turn off the light",
    params: [
      {
        name: "duration",
        type: "double",
        description: "How long in seconds you want the power action to take.",
        default: "1.0",
      },
    ],
  },
  {
    name: "async turnOn([duration])",
    description: "Turn on the light",
    params: [
      {
        name: "duration",
        type: "double",
        description: "How long in seconds you want the power action to take.",
        default: "1.0",
      },
    ],
  },
  {
    name: "async setBrightness(brightness)",
    description: "Set the brightness level of the light",
    params: [
      {
        name: "brightness",
        type: "double",
        description: "The brightness level from 0.0 to 1.0",
      },
    ],
  },
  {
    name: "async setColor(color)",
    description: "Set the color of the light",
    params: [
      {
        name: "color",
        type: "string",
        description: "The color to set the light to",
      },
    ],
  },
];

export default async function getDevices(globalUserData) {
  const res = await fetch("https://api.lifx.com/v1/lights/all", {
    headers: {
      Authorization: `Bearer ${globalUserData.lifx.apiKey}`,
    },
  });

  const devices = {};

  for (const light of await res.json()) {
    devices[camelCase(light.label)] = lifx;
    const group = camelCase(light.group.name);
    if (!devices[group]) {
      devices[group] = lifx;
    }
  }

  return devices;
}
