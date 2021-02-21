import React from "react";
import Spinner from "react-bootstrap/Spinner";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

function Scripts(props) {
  const [scripts, setScripts] = React.useState();

  React.useEffect(
    () =>
      props.docRef.collection("scripts").onSnapshot((snapshot) => {
        setScripts(snapshot.docs);
      }),
    [props.docRef]
  );

  function editScript(docRef) {
    props.openScript(docRef);
  }

  async function newScript() {
    props.openScript(
      await props.docRef.collection("scripts").add({
        name: "New Script",
        description: "",
        script: "",
        trigger: {
          name: "Schedule",
          params: {
            dayOfWeek: [1, 2, 3, 4, 5, 6, 0],
            hour: 8,
            minute: 0,
            second: 0,
          },
        },
      })
    );
  }

  return scripts ? (
    <Row>
      <Col xs={4} className="mb-4">
        <Button block variant="outline-secondary h-100" onClick={newScript}>
          <p className="display-3">+</p>
          <p className="lead">New Script</p>
        </Button>
      </Col>
      {scripts.map((script) => (
        <Col xs={4} key={script.id} className="mb-4">
          <Card className="h-100">
            <Card.Body>
              <Card.Title>{script.get("name")}</Card.Title>
              <Card.Text>{script.get("description")}</Card.Text>
            </Card.Body>
            <Card.Footer>
              <Button onClick={() => editScript(script.ref)}>Edit</Button>
            </Card.Footer>
          </Card>
        </Col>
      ))}
    </Row>
  ) : (
    <div className="text-center">
      <Spinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner>
    </div>
  );
}

export default Scripts;
