import { Spinner, Card, Col, Row, Button } from "react-bootstrap";
import Sidebar from "../components/Sidebar";
import useSWR from "swr";
import fetcher from "@homescript/lib/fetcher";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Scripts() {
  const router = useRouter();
  const { data } = useSWR("/api/scripts", fetcher);

  async function newScript() {
    const script = await fetcher("/api/scripts", {
      method: "POST",
      body: {
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
      },
    });
    router.push(`/scripts/${script._id}`);
  }

  return (
    <Sidebar>
      {data ? (
        <Row>
          <Col xs={4} className="mb-4">
            <Button block variant="outline-secondary h-100" onClick={newScript}>
              <p className="display-3">+</p>
              <p className="lead">New Script</p>
            </Button>
          </Col>
          {data.map((script) => (
            <Col xs={4} key={script._id} className="mb-4">
              <Card className="h-100">
                <Card.Body>
                  <Card.Title>{script.name}</Card.Title>
                  <Card.Text>{script.description}</Card.Text>
                </Card.Body>
                <Card.Footer>
                  <Link passHref href={`/scripts/${script._id}`}>
                    <Button as="a">Edit</Button>
                  </Link>
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
      )}
    </Sidebar>
  );
}
