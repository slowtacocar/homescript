import {
  Form,
  Spinner,
  Button,
  InputGroup,
  Modal,
  Accordion,
  Card,
  ListGroup,
} from "react-bootstrap";
import triggers from "../../lib/triggers";
import getDevices from "../../lib/devices";
import functions from "../../lib/functions";
import useSWR from "swr";
import fetcher from "@homescript/lib/fetcher";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";

export default function Script() {
  const router = useRouter();

  const { data } = useSWR(`/api/scripts/${router.query.id}`, fetcher);
  const { data: globalUserData } = useSWR("/api/user/global", fetcher);

  const [formState, setFormState] = useState(null);
  const [isOptionsModalShown, setIsOptionsModalShown] = useState(false);
  const [devices, setDevices] = useState(null);
  const [methodModalState, setMethodModalState] = useState(null);
  const [editor, setEditor] = useState(null);
  const editorContainer = useRef();

  useEffect(() => {
    if (data) {
      setFormState({
        name: data.name,
        description: data.description,
        trigger: data.trigger,
      });
      if (editor) {
        editor.setValue(data.script);
      }
    }
  }, [data, editor]);

  useEffect(() => {
    if (globalUserData) {
      getDevices(globalUserData).then((newDevices) => setDevices(newDevices));
    }
  }, [globalUserData]);

  useEffect(() => {
    if (!editor) {
      import("ace-builds/src-noconflict/ace").then(async (ace) => {
        await Promise.all([
          import("ace-builds/src-noconflict/ext-language_tools"),
          import("ace-builds/src-noconflict/mode-javascript"),
          import("ace-builds/src-noconflict/theme-textmate"),
        ]);
        setEditor(
          ace.edit(editorContainer.current, {
            enableLiveAutocompletion: true,
            mode: "ace/mode/javascript",
            theme: "ace/theme/textmate",
          })
        );
      });
    }
  }, [editor]);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormState((oldFormState) => ({ ...oldFormState, [name]: value }));
  }

  function handleChangeTriggerName(event) {
    const { value } = event.target;
    setFormState((oldFormState) => ({
      ...oldFormState,
      trigger: {
        name: value,
        params: triggers[value].default,
      },
    }));
  }

  function handleChangeTriggerParam(value, key) {
    setFormState((oldFormState) => ({
      ...oldFormState,
      trigger: {
        ...oldFormState.trigger,
        params: {
          ...oldFormState.trigger.params,
          [key]: value,
        },
      },
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    await fetcher(`/api/scripts/${router.query.id}`, {
      method: "PATCH",
      body: { ...formState, script: editor.getValue() },
    });
    router.push("/");
  }

  async function deleteScript() {
    await fetcher(`/api/scripts/${router.query.id}`, {
      method: "DELETE",
    });
    router.push("/");
  }

  return (
    <>
      <div className="dashboard-sidebar overflow-auto">
        <div className="p-4 h-100 d-flex justify-content-between flex-column bg-light">
          <div>
            <h4 className="mb-3">Devices</h4>
            {devices ? (
              <Accordion>
                {Object.entries(devices).map(([key, device]) => (
                  <Card key={key}>
                    <Card.Header>
                      <code>
                        <Accordion.Toggle
                          as={Button}
                          variant="link"
                          eventKey={key}
                        >
                          {key}
                        </Accordion.Toggle>
                      </code>
                    </Card.Header>
                    <Accordion.Collapse eventKey={key}>
                      <ListGroup variant="flush">
                        {device.map((method) => (
                          <ListGroup.Item
                            key={method.name}
                            action
                            onClick={() => setMethodModalState(method)}
                          >
                            <code>{method.name}</code>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
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
            <p>
              Don&apos;t see what you&apos;re looking for?
              <br />
              Check the Integrations tab.
            </p>
          </div>
          <div>
            <h4 className="mb-3">Functions</h4>
            <ListGroup>
              {functions.map((method) => (
                <ListGroup.Item
                  key={method.name}
                  action
                  onClick={() => setMethodModalState(method)}
                >
                  <code>{method.name}</code>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
          <Modal
            show={!!methodModalState}
            onHide={() => setMethodModalState(null)}
          >
            {methodModalState && (
              <>
                <Modal.Header closeButton>
                  <code>
                    <Modal.Title>{methodModalState.name}</Modal.Title>
                  </code>
                </Modal.Header>
                <Modal.Body>
                  <p>{methodModalState.description}</p>
                  <ul>
                    {methodModalState.params.map((param) => (
                      <li key={param.name}>
                        <code>{param.name}</code>{" "}
                        <strong>&lt;{param.type}&gt;</strong>{" "}
                        {param.description}{" "}
                        {param.default ? (
                          <>
                            {" "}
                            Default: <samp>{param.default}</samp>
                          </>
                        ) : (
                          ""
                        )}
                      </li>
                    ))}
                    {methodModalState.returns && (
                      <li>
                        Returns:{" "}
                        <strong>&lt;{methodModalState.returns.type}&gt;</strong>{" "}
                        {methodModalState.returns.description}
                      </li>
                    )}
                  </ul>
                </Modal.Body>
              </>
            )}
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setMethodModalState(null)}
              >
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
      <div className="dashboard-main overflow-auto">
        <div className="p-3 h-100">
          {formState ? (
            <>
              <Form
                onSubmit={handleSubmit}
                className="d-flex flex-column h-100"
              >
                <Form.Group controlId="name">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    value={formState.name}
                    name="name"
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group controlId="description">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    value={formState.description}
                    name="description"
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group controlId="trigger">
                  <Form.Label>Trigger</Form.Label>
                  <InputGroup>
                    <Form.Control
                      as="select"
                      value={formState.trigger.name}
                      onChange={handleChangeTriggerName}
                    >
                      {Object.entries(triggers).map(([value]) => (
                        <option value={value} key={value}>
                          {value}
                        </option>
                      ))}
                    </Form.Control>
                    <InputGroup.Append>
                      <Button
                        variant="outline-secondary"
                        onClick={() => setIsOptionsModalShown(true)}
                        disabled={
                          triggers[formState.trigger.name].params.length <= 0
                        }
                      >
                        Options...
                      </Button>
                    </InputGroup.Append>
                  </InputGroup>
                </Form.Group>
                <Form.Group
                  controlId="script"
                  className="flex-grow-1 d-flex flex-column mh"
                >
                  <Form.Label>Script</Form.Label>
                  <div
                    className="border flex-grow-1"
                    ref={editorContainer}
                  ></div>
                </Form.Group>
                <div>
                  <Button type="submit" className="mr-2">
                    Save
                  </Button>
                  <Button
                    variant="secondary"
                    className="mr-2"
                    onClick={() => router.push("/")}
                  >
                    Close
                  </Button>
                  <Button
                    variant="danger"
                    onClick={deleteScript}
                    className="float-right"
                  >
                    Delete
                  </Button>
                </div>
              </Form>
              <Modal
                show={isOptionsModalShown}
                onHide={() => setIsOptionsModalShown(false)}
              >
                <Modal.Header closeButton>
                  <Modal.Title>{formState.trigger.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {triggers[formState.trigger.name].params.map((param) => (
                    <Form.Group controlId={param.param} key={param.param}>
                      <Form.Label>{param.name}</Form.Label>
                      <param.component
                        value={formState.trigger.params[param.param]}
                        onChange={(value) =>
                          handleChangeTriggerParam(value, param.param)
                        }
                      />
                      <Form.Text>{param.description}</Form.Text>
                    </Form.Group>
                  ))}
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    variant="secondary"
                    onClick={() => setIsOptionsModalShown(false)}
                  >
                    Close
                  </Button>
                </Modal.Footer>
              </Modal>
            </>
          ) : (
            <div className="text-center">
              <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
              </Spinner>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
