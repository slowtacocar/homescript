import React from "react";
import Spinner from "react-bootstrap/Spinner";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import modules from "./modules";

function Integrations(props) {
  function handleChange(value, name, key) {
    props.setData({
      ...props.data,
      [key]: { ...props.data[key], [name]: value },
    });
  }

  function handleSubmit(event, value) {
    event.preventDefault();
    props.docRef.set(
      {
        global: {
          [value]: props.data[value],
        },
      },
      { merge: true }
    );
  }

  return props.data ? (
    <Accordion>
      {Object.entries(modules).map(([key, value]) => (
        <Card key={key}>
          <Card.Header>
            <Accordion.Toggle as={Button} variant="link" eventKey={key}>
              {value.name}
            </Accordion.Toggle>
          </Card.Header>
          <Accordion.Collapse eventKey={key}>
            <Card.Body>
              <Form onSubmit={(event) => handleSubmit(event, key)}>
                {value.params.map((param) => (
                  <Form.Group
                    controlId={`${key}${param.param}`}
                    key={param.param}
                  >
                    <Form.Label>{param.name}</Form.Label>
                    <param.component
                      value={props.data[key][param.param]}
                      onChange={(value) =>
                        handleChange(value, param.param, key)
                      }
                    />
                    <Form.Text>{param.description}</Form.Text>
                  </Form.Group>
                ))}
                <Button type="submit">Save</Button>
              </Form>
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      ))}
    </Accordion>
  ) : (
    <div className="text-center">
      <Spinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner>
    </div>
  );
}

export default Integrations;
