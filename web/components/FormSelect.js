import { FormControl } from "react-bootstrap";

export default function FormSelect({ options, ...props }) {
  return (
    <FormControl as="select" {...props}>
      {options.map((option) => (
        <option
          value={option.label ? option.value : option}
          key={option.label ? option.value : option}
        >
          {option.label || option}
        </option>
      ))}
    </FormControl>
  );
}
