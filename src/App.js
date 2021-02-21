import firebase from "./firebase";
import "firebase/auth";
import "firebase/firestore";
import React from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import Spinner from "react-bootstrap/Spinner";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";
import Scripts from "./Scripts";
import Integrations from "./Integrations";
import Container from "react-bootstrap/Container";
import Script from "./Script";
import { defaults } from "./modules";

function App() {
  const [user, setUser] = React.useState();
  const [currentPage, setCurrentPage] = React.useState("scripts");
  const [currentScript, setCurrentScript] = React.useState();
  const docRef = React.useMemo(
    () => user && firebase.firestore().collection("user").doc(user.uid),
    [user]
  );
  const [data, setData] = React.useState();

  React.useEffect(() => {
    if (docRef) {
      return docRef.onSnapshot((doc) => {
        if (doc.exists) {
          setData(doc.data());
        } else {
          doc.ref.set({ global: defaults });
        }
      });
    }
  }, [docRef]);

  React.useEffect(() => firebase.auth().onAuthStateChanged(setUser), []);

  function signOut() {
    firebase.auth().signOut();
  }

  function openScripts() {
    setCurrentPage("scripts");
  }

  function openIntegrations() {
    setCurrentPage("integrations");
  }

  function openScript(ref) {
    setCurrentScript(ref);
  }

  function exitScript() {
    setCurrentScript();
  }

  function setGlobalData(global) {
    setData({ ...data, global });
  }

  return user === null ? (
    <StyledFirebaseAuth
      firebaseAuth={firebase.auth()}
      uiConfig={{
        signInFlow: "popup",
        signInOptions: [
          firebase.auth.EmailAuthProvider.PROVIDER_ID,
          firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        ],
        callbacks: {
          signInSuccessWithAuthResult: () => false,
        },
      }}
    />
  ) : user ? (
    <div className="dashboard-grid">
      <div className="dashboard-navbar">
        <Navbar bg="dark" variant="dark">
          <Navbar.Brand className="mr-auto">Homescript</Navbar.Brand>
          <Button variant="outline-light" onClick={signOut}>
            Sign Out
          </Button>
        </Navbar>
      </div>
      {currentScript ? (
        <Script docRef={currentScript} exit={exitScript} data={data.global} />
      ) : (
        <>
          <div className="dashboard-sidebar">
            <Nav
              variant="pills"
              className="flex-column bg-light h-100 pr-3 py-2"
              activeKey={currentPage}
            >
              <Nav.Link
                className="sidebar-link"
                eventKey="scripts"
                onClick={openScripts}
              >
                My Scripts
              </Nav.Link>
              <Nav.Link
                className="sidebar-link"
                eventKey="integrations"
                onClick={openIntegrations}
              >
                Integrations
              </Nav.Link>
            </Nav>
          </div>
          <div className="dashboard-main overflow-auto">
            <Container className="py-3">
              {currentPage === "scripts" ? (
                <Scripts docRef={docRef} openScript={openScript} />
              ) : currentPage === "integrations" ? (
                <Integrations
                  docRef={docRef}
                  data={data.global}
                  setData={setGlobalData}
                />
              ) : null}
            </Container>
          </div>
        </>
      )}
    </div>
  ) : (
    <div className="text-center p-3">
      <Spinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner>
    </div>
  );
}

export default App;
