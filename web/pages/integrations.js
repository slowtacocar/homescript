import { Accordion, Card, Button, Form } from "react-bootstrap";
import useSWR from "swr";
import Sidebar from "../components/Sidebar";
import modules from "../lib/modules";
import Loading from "../components/Loading";
import Error from "../components/Error";
import { Formik } from "formik";
import fetchAPI from "../lib/fetchAPI";
import LoadingButton from "../components/LoadingButton";
import FormGroup from "../components/FormGroup";

export default function Integrations() {
  const { data, error } = useSWR("/api/user/global", fetchAPI);

  async function handleSubmit(values) {
    try {
      await fetchAPI("/api/user/global", {
        method: "PATCH",
        body: values,
      });
    } catch {
      alert("Failed to update integration");
    }
  }

  if (error) return <Error />;
  if (!data) return <Loading />;

  return (
    <Sidebar>
      <Formik initialValues={data} enableReinitialize onSubmit={handleSubmit}>
        {({ handleSubmit, isSubmitting }) => (
          <Form onSubmit={handleSubmit}>
            <Accordion className="mb-3">
              {Object.entries(modules).map(([key, value]) => (
                <Accordion.Item key={key} eventKey={key}>
                  <Accordion.Header>{value.name}</Accordion.Header>
                  <Accordion.Body>
                    {value.params.map((param) => (
                      <FormGroup
                        key={param.param}
                        as={param.component}
                        label={param.name}
                        text={param.description}
                        name={`${key}.${param.param}`}
                      />
                    ))}
                  </Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>
            <LoadingButton
              className="w-100"
              isLoading={isSubmitting}
              type="submit"
            >
              Save
            </LoadingButton>
          </Form>
        )}
      </Formik>
    </Sidebar>
  );
}
