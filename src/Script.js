import React from "react";
import Form from "react-bootstrap/Form";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-textmate";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/webpack-resolver";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import Modal from "react-bootstrap/Modal";
import triggers from "./triggers";

function Script(props) {
  const [script, setScript] = React.useState();
  const [shownModal, setShownModal] = React.useState(false);

  React.useEffect(
    () => props.docRef.onSnapshot((doc) => setScript(doc.data())),
    [props.docRef]
  );

  function handleChange(event) {
    setScript({ ...script, [event.target.name]: event.target.value });
  }

  function handleChangeScript(value) {
    setScript({ ...script, script: value });
  }

  function handleChangeTriggerName(event) {
    setScript({
      ...script,
      trigger: {
        name: event.target.value,
        params: triggers[event.target.value].default,
      },
    });
  }

  function handleChangeTriggerParam(value, key) {
    setScript({
      ...script,
      trigger: {
        ...script.trigger,
        params: {
          ...script.trigger.params,
          [key]: value,
        },
      },
    });
  }

  async function handleChangeTriggerParams(event) {
    event.preventDefault();
    await props.docRef.update({ trigger: script.trigger });
    hideModal();
  }

  async function handleSubmit(event) {
    event.preventDefault();
    await props.docRef.update(script);
    props.exit();
  }

  async function deleteScript() {
    await props.docRef.delete();
    props.exit();
  }

  function showModal() {
    setShownModal(true);
  }

  function hideModal() {
    setShownModal(false);
  }

  return (
    <>
      <div className="dashboard-sidebar"></div>
      <div className="dashboard-main overflow-auto">
        <div className="p-3 h-100">
          {script ? (
            <>
              <Form
                onSubmit={handleSubmit}
                className="d-flex flex-column h-100"
              >
                <Form.Group controlId="name">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    value={script.name}
                    name="name"
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group controlId="description">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    value={script.description}
                    name="description"
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group controlId="trigger">
                  <Form.Label>Trigger</Form.Label>
                  <InputGroup>
                    <Form.Control
                      as="select"
                      value={script.trigger.name}
                      onChange={handleChangeTriggerName}
                    >
                      {Object.entries(triggers).map(([value]) => (
                        <option value={value} key={value}>
                          {value}
                        </option>
                      ))}
                    </Form.Control>
                    <InputGroup.Append>
                      <Button variant="outline-secondary" onClick={showModal}>
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
                  <div className="border flex-grow-1">
                    <AceEditor
                      width="auto"
                      height="100%"
                      enableLiveAutocompletion
                      mode="javascript"
                      theme="textmate"
                      name="script"
                      onChange={handleChangeScript}
                      value={script.script}
                    />
                  </div>
                </Form.Group>
                <div>
                  <Button type="submit" className="mr-2">
                    Save
                  </Button>
                  <Button
                    variant="secondary"
                    className="mr-2"
                    onClick={props.exit}
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
              <Modal show={shownModal} onHide={hideModal}>
                <Modal.Header closeButton>
                  <Modal.Title>{script.trigger.name}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleChangeTriggerParams}>
                  <Modal.Body>
                    {triggers[script.trigger.name].params.map((param) => (
                      <Form.Group controlId={param.param} key={param.param}>
                        <Form.Label>{param.name}</Form.Label>
                        <param.component
                          value={script.trigger.params[param.param]}
                          onChange={(value) =>
                            handleChangeTriggerParam(value, param.param)
                          }
                        />
                        <Form.Text>{param.description}</Form.Text>
                      </Form.Group>
                    ))}
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={hideModal}>
                      Close
                    </Button>
                    <Button type="submit">Save</Button>
                  </Modal.Footer>
                </Form>
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

export default Script;
