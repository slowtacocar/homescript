import { Card, Col, Row, Button } from "react-bootstrap";
import Sidebar from "../components/Sidebar";
import useSWR from "swr";
import Link from "next/link";
import { useRouter } from "next/router";
import Loading from "../components/Loading";
import Error from "../components/Error";
import fetchAPI from "../lib/fetchAPI";

export default function Scripts() {
  const router = useRouter();
  const { data, error } = useSWR("/api/scripts", fetchAPI);

  async function newScript() {
    try {
      const script = await fetchAPI("/api/scripts", {
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
    } catch {
      alert("Failed to create script");
    }
  }

  if (error) return <Error />;
  if (!data) return <Loading />;

  return (
    <Sidebar>
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
    </Sidebar>
  );
}
