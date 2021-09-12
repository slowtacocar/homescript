import { useEffect, useState } from "react";
import { Spinner, Accordion, Card, Button, Form } from "react-bootstrap";
import useSWR from "swr";
import Sidebar from "../components/Sidebar";
import fetcher from "@homescript/lib/fetcher";
import modules from "../lib/modules";

export default function Integrations() {
  const { data } = useSWR("/api/user/global", fetcher);

  const [formState, setFormState] = useState(null);

  useEffect(() => {
    setFormState(data);
  }, [data]);

  function handleChange(value, name, key) {
    setFormState((oldFormState) => ({
      ...oldFormState,
      [key]: { ...oldFormState[key], [name]: value },
    }));
  }

  async function handleSubmit(event, value) {
    event.preventDefault();
    await fetcher("/api/user/global", {
      method: "PATCH",
      body: {
        [value]: formState[value],
      },
    });
  }

  return (
    <Sidebar>
      {formState ? (
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
                          value={formState[key][param.param]}
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
      )}
    </Sidebar>
  );
}
