import { Navbar, Button, Spinner } from "react-bootstrap";
import { signOut, signIn } from "next-auth/client";
import "../styles/globals.scss";
import { useEffect } from "react";
import useSWR from "swr";
import fetcher from "@homescript/lib/fetcher";

export default function App({ Component, pageProps }) {
  const { data } = useSWR("/api/auth/session", fetcher);

  useEffect(() => {
    if (data && !data.user) {
      signIn();
    }
  }, [data]);

  return data && data.user ? (
    <div className="dashboard-grid">
      <div className="dashboard-navbar">
        <Navbar bg="dark" variant="dark">
          <Navbar.Brand className="mr-auto">Homescript</Navbar.Brand>
          <Button variant="outline-light" onClick={() => signOut()}>
            Sign Out
          </Button>
        </Navbar>
      </div>
      <Component {...pageProps} />
    </div>
  ) : (
    <div className="text-center">
      <Spinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner>
    </div>
  );
}
