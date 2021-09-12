import { Nav, Container } from "react-bootstrap";
import Link from "next/link";
import { useRouter } from "next/dist/client/router";

export default function Sidebar({ children }) {
  const router = useRouter();

  return (
    <>
      <div className="dashboard-sidebar">
        <Nav
          variant="pills"
          className="flex-column bg-light h-100 pr-3 py-2"
          activeKey={router.basePath}
        >
          <Link href="/" passHref>
            <Nav.Link className="sidebar-link" eventKey="/">
              My Scripts
            </Nav.Link>
          </Link>
          <Link href="/integrations" passHref>
            <Nav.Link className="sidebar-link" eventKey="/integrations">
              Integrations
            </Nav.Link>
          </Link>
        </Nav>
      </div>
      <div className="dashboard-main overflow-auto">
        <Container className="py-3">{children}</Container>
      </div>
    </>
  );
}
