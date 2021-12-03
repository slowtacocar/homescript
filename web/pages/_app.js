import { Navbar, Button, Container } from "react-bootstrap";
import { signOut, SessionProvider } from "next-auth/react";
import "../styles/globals.scss";
import Auth from "../components/Auth";

export default function App({ Component, pageProps }) {
  return (
    <div className="dashboard-grid">
      <div className="dashboard-navbar">
        <Navbar bg="dark" variant="dark">
          <Container fluid>
            <Navbar.Brand>Homescript</Navbar.Brand>
            <Button variant="outline-light" onClick={() => signOut()}>
              Sign Out
            </Button>
          </Container>
        </Navbar>
      </div>
      <SessionProvider>
        <Auth>
          <Component {...pageProps} />
        </Auth>
      </SessionProvider>
    </div>
  );
}
