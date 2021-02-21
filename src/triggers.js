import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";
import FormControl from "react-bootstrap/FormControl";

const triggers = {
  Schedule: {
    default: {
      dayOfWeek: [1, 2, 3, 4, 5, 6, 0],
      hour: 8,
      minute: 0,
      second: 0,
    },
    params: [
      {
        param: "dayOfWeek",
        name: "Days of the week",
        description: "Run this script on the following days of the week",
        component: (props) => (
          <ToggleButtonGroup type="checkbox" {...props}>
            <ToggleButton value={1}>Mon.</ToggleButton>
            <ToggleButton value={2}>Tue.</ToggleButton>
            <ToggleButton value={3}>Wed.</ToggleButton>
            <ToggleButton value={4}>Thu.</ToggleButton>
            <ToggleButton value={5}>Fri.</ToggleButton>
            <ToggleButton value={6}>Sat.</ToggleButton>
            <ToggleButton value={0}>Sun.</ToggleButton>
          </ToggleButtonGroup>
        ),
      },
      {
        param: "hour",
        name: "Hour",
        description:
          "The hour (24hr time) at which to run the script (leave blank to run once per hour)",
        component: (props) => (
          <FormControl
            type="number"
            {...props}
            onChange={(event) =>
              props.onChange(
                event.target.value === "" ? null : Number(event.target.value)
              )
            }
            value={props.value === null ? "" : props.value}
          />
        ),
      },
      {
        param: "minute",
        name: "Minute",
        description:
          "The minute at which to run the script (leave blank to run once per minute)",
        component: (props) => (
          <FormControl
            type="number"
            {...props}
            onChange={(event) =>
              props.onChange(
                event.target.value === "" ? null : Number(event.target.value)
              )
            }
            value={props.value === null ? "" : props.value}
          />
        ),
      },
      {
        param: "second",
        name: "Second",
        description:
          "The second at which to run the script (leave blank to run once per second)",
        component: (props) => (
          <FormControl
            type="number"
            {...props}
            onChange={(event) =>
              props.onChange(
                event.target.value === "" ? null : Number(event.target.value)
              )
            }
            value={props.value === null ? "" : props.value}
          />
        ),
      },
    ],
  },
  Sunrise: {
    default: {},
    params: [],
  },
  Sunset: {
    default: {},
    params: [],
  },
};

export default triggers;
