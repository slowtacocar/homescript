import React from "react";
import Spinner from "react-bootstrap/Spinner";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

function Integrations(props) {
  const [data, setData] = React.useState();

  React.useEffect(
    () =>
      props.docRef.onSnapshot((doc) => {
        setData(doc.get("global"));
      }),
    [props.docRef]
  );

  function handleLifxChange(event) {
    setData({
      ...data,
      lifx: { ...data.lifx, [event.target.name]: event.target.value },
    });
  }

  function submitLifx(event) {
    event.preventDefault();
    props.docRef.update({ global: data });
  }

  return data ? (
    <Accordion>
      <Card>
        <Card.Header>
          <Accordion.Toggle as={Button} variant="link" eventKey="0">
            LIFX Integration
          </Accordion.Toggle>
        </Card.Header>
        <Accordion.Collapse eventKey="0">
          <Card.Body>
            <Form onSubmit={submitLifx}>
              <Form.Group controlId="lifxKey">
                <Form.Label>LIFX API Key</Form.Label>
                <Form.Control
                  value={data.lifx.apiKey}
                  onChange={handleLifxChange}
                  name="apiKey"
                />
                <Form.Text>
                  Not sure what to do? Click{" "}
                  <a
                    href="https://community.lifx.com/t/creating-a-lifx-http-api-token/25"
                    target="_blank"
                    rel="noreferrer"
                  >
                    here
                  </a>
                  .
                </Form.Text>
              </Form.Group>
              <Button type="submit">Save</Button>
            </Form>
          </Card.Body>
        </Accordion.Collapse>
      </Card>
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
