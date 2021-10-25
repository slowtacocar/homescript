import { Form } from "react-bootstrap";
import { Field, ErrorMessage } from "formik";

export default function FormGroup({ label, children, text, mb0, ...props }) {
  return (
    <Form.Group controlId={props.name} className={mb0 ? "mb-0" : ""}>
      <Form.Label>{label}</Form.Label>
      <Field as={Form.Control} {...props}>
        {children}
      </Field>
      {text && <Form.Text muted>{text}</Form.Text>}
      <ErrorMessage
        name={props.name}
        component={Form.Control.Feedback}
        type="invalid"
      />
    </Form.Group>
  );
}
