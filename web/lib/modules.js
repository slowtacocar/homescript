import { FormControl } from "react-bootstrap";

const modules = {
  lifx: {
    name: "LIFX Integration",
    params: [
      {
        param: "apiKey",
        name: "LIFX API Key",
        description: (
          <>
            Not sure what to do? Click{" "}
            <a
              href="https://community.lifx.com/t/creating-a-lifx-http-api-token/25"
              target="_blank"
              rel="noreferrer"
            >
              here
            </a>
            .
          </>
        ),
        component: function LIFXKey(props) {
          return <FormControl type="password" {...props} />;
        },
      },
    ],
  },
  time: {
    name: "Sunrise/Sunset",
    params: [
      {
        param: "long",
        name: "Longitude",
        description: "The longitude of your location",
        component: function Longitude(props) {
          return <FormControl type="number" step="any" {...props} />;
        },
      },
      {
        param: "lat",
        name: "Latitude",
        description: "The latitude of your location",
        component: function Latitude(props) {
          return <FormControl type="number" step="any" {...props} />;
        },
      },
    ],
  },
};

export const defaults = {
  lifx: {
    apiKey: "",
  },
  time: {
    long: 0,
    lat: 0,
  },
};

export default modules;
