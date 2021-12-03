import getDevices from "../lib/devices";
import functions from "../lib/functions";
import { Accordion, Card, ListGroup, Button, Modal } from "react-bootstrap";
import useSWR from "swr";
import { useState, useEffect } from "react";
import Loading from "./Loading";
import Error from "./Error";
import fetchAPI from "../lib/fetchAPI";

export default function Devices() {
  const { data, error } = useSWR("/api/user/global", fetchAPI);

  const [devices, setDevices] = useState(null);
  const [methodModalState, setMethodModalState] = useState(null);

  useEffect(() => {
    if (data) {
      getDevices(data).then((newDevices) => setDevices(newDevices));
    }
  }, [data]);

  return (
    <div className="dashboard-sidebar overflow-auto">
      <div className="p-4 h-100 d-flex justify-content-between flex-column bg-light">
        <div>
          <h4 className="mb-3">Devices</h4>
          {error ? (
            <Error />
          ) : devices ? (
            <Accordion>
              {Object.entries(devices).map(([key, device]) => (
                <Accordion.Item key={key} eventKey={key}>
                  <Accordion.Header>
                    <code>{key}</code>
                  </Accordion.Header>
                  <Accordion.Body>
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
                  </Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>
          ) : (
            <Loading />
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
                      <strong>&lt;{param.type}&gt;</strong> {param.description}{" "}
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
  );
}
