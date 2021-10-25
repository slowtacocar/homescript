import { Navbar, Button } from "react-bootstrap";
import { signOut, signIn, useSession, Provider } from "next-auth/client";
import "../styles/globals.scss";
import { useEffect } from "react";
import Loading from "../components/Loading";

export default function App({ Component, pageProps }) {
  const [session, loading] = useSession();

  useEffect(() => {
    if (!session && !loading) {
      signIn();
    }
  }, [session, loading]);

  if (!session) return <Loading />;

  return (
    <div className="dashboard-grid">
      <div className="dashboard-navbar">
        <Navbar bg="dark" variant="dark">
          <Navbar.Brand className="mr-auto">Homescript</Navbar.Brand>
          <Button variant="outline-light" onClick={() => signOut()}>
            Sign Out
          </Button>
        </Navbar>
      </div>
      <Provider session={session}>
        <Component {...pageProps} />
      </Provider>
    </div>
  );
}
