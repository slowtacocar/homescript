import FormControl from "react-bootstrap/FormControl";

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
        component: (props) => (
          <FormControl
            {...props}
            onChange={(event) => props.onChange(event.target.value)}
          />
        ),
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
        component: (props) => (
          <FormControl
            type="number"
            step="any"
            {...props}
            onChange={(event) => props.onChange(Number(event.target.value))}
          />
        ),
      },
      {
        param: "lat",
        name: "Latitude",
        description: "The latitude of your location",
        component: (props) => (
          <FormControl
            type="number"
            step="any"
            {...props}
            onChange={(event) => props.onChange(Number(event.target.value))}
          />
        ),
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
