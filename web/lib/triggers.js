import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";
import FormControl from "react-bootstrap/FormControl";
import { useFormikContext } from "formik";

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
        component: function DayOfWeek(props) {
          const { setFieldValue } = useFormikContext();

          return (
            <ToggleButtonGroup
              type="checkbox"
              {...props}
              onChange={(value) => setFieldValue(props.name, value)}
            >
              <ToggleButton value={1}>Mon.</ToggleButton>
              <ToggleButton value={2}>Tue.</ToggleButton>
              <ToggleButton value={3}>Wed.</ToggleButton>
              <ToggleButton value={4}>Thu.</ToggleButton>
              <ToggleButton value={5}>Fri.</ToggleButton>
              <ToggleButton value={6}>Sat.</ToggleButton>
              <ToggleButton value={0}>Sun.</ToggleButton>
            </ToggleButtonGroup>
          );
        },
      },
      {
        param: "hour",
        name: "Hour",
        description:
          "The hour (24hr time) at which to run the script (leave blank to run once per hour)",
        component: function Hour(props) {
          return <FormControl type="number" {...props} />;
        },
      },
      {
        param: "minute",
        name: "Minute",
        description:
          "The minute at which to run the script (leave blank to run once per minute)",
        component: function Minute(props) {
          return <FormControl type="number" {...props} />;
        },
      },
      {
        param: "second",
        name: "Second",
        description:
          "The second at which to run the script (leave blank to run once per second)",
        component: function Second(props) {
          return <FormControl type="number" {...props} />;
        },
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
