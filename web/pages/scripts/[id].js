import { Form, Button, InputGroup, Modal } from "react-bootstrap";
import triggers from "../../lib/triggers";
import useSWR from "swr";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import Loading from "../../components/Loading";
import Error from "../../components/Error";
import Devices from "../../components/Devices";
import { Formik, Field } from "formik";
import fetchAPI from "../../lib/fetchAPI";
import LoadingButton from "../../components/LoadingButton";
import FormGroup from "../../components/FormGroup";
import FormSelect from "../../components/FormSelect";

export default function Script() {
  const router = useRouter();

  const { data, error } = useSWR(`/api/scripts/${router.query.id}`, fetchAPI);

  const [isOptionsModalShown, setIsOptionsModalShown] = useState(false);
  const [editor, setEditor] = useState(null);
  const editorContainer = useRef();

  useEffect(() => {
    if (data && editor) {
      editor.setValue(data.script);
    }
  }, [data, editor]);

  useEffect(() => {
    if (!editor) {
      import("ace-builds/src-noconflict/ace").then(async (ace) => {
        await Promise.all([
          import("ace-builds/src-noconflict/ext-language_tools"),
          import("ace-builds/src-noconflict/mode-javascript"),
          import("ace-builds/src-noconflict/theme-textmate"),
        ]);
        setEditor(
          ace.edit(editorContainer.current, {
            enableLiveAutocompletion: true,
            mode: "ace/mode/javascript",
            theme: "ace/theme/textmate",
          })
        );
      });
    }
  }, [editor]);

  async function handleSubmit(values) {
    try {
      await fetchAPI(`/api/scripts/${router.query.id}`, {
        method: "PATCH",
        body: { ...values, script: editor.getValue() },
      });
      router.push("/");
    } catch {
      alert("Failed to update script");
    }
  }

  async function deleteScript() {
    try {
      await fetchAPI(`/api/scripts/${router.query.id}`, {
        method: "DELETE",
      });
      router.push("/");
    } catch {
      alert("Failed to detete script");
    }
  }

  if (error) return <Error />;
  if (!data) return <Loading />;

  return (
    <>
      <Devices />
      <div className="dashboard-main overflow-auto">
        <div className="p-3 h-100">
          <Formik
            initialValues={{
              name: data.name,
              description: data.description,
              trigger: data.trigger,
            }}
            enableReinitialize
            onSubmit={handleSubmit}
          >
            {({ handleSubmit, isSubmitting, setFieldValue, values }) => (
              <>
                <Form
                  onSubmit={handleSubmit}
                  className="d-flex flex-column h-100"
                >
                  <FormGroup name="name" label="Name" />
                  <FormGroup name="description" description="Description" />
                  <Form.Group controlId="trigger">
                    <Form.Label>Trigger</Form.Label>
                    <InputGroup>
                      <Field
                        as={FormSelect}
                        name="trigger.name"
                        options={Object.entries(triggers).map(
                          ([value]) => value
                        )}
                        onChange={(event) =>
                          setFieldValue("trigger", {
                            name: event.target.value,
                            params: triggers[event.target.value].default,
                          })
                        }
                      />
                      <InputGroup.Append>
                        <Button
                          variant="outline-secondary"
                          onClick={() => setIsOptionsModalShown(true)}
                          disabled={
                            triggers[values.trigger.name].params.length <= 0
                          }
                        >
                          Options...
                        </Button>
                      </InputGroup.Append>
                    </InputGroup>
                  </Form.Group>
                  <Form.Group
                    controlId="script"
                    className="flex-grow-1 d-flex flex-column mh"
                  >
                    <Form.Label>Script</Form.Label>
                    <div
                      className="border flex-grow-1"
                      ref={editorContainer}
                    ></div>
                  </Form.Group>
                  <div>
                    <LoadingButton
                      isLoading={isSubmitting}
                      type="submit"
                      className="mr-2"
                    >
                      Save
                    </LoadingButton>
                    <Button
                      variant="secondary"
                      className="mr-2"
                      onClick={() => router.push("/")}
                    >
                      Close
                    </Button>
                    <Button
                      variant="danger"
                      onClick={deleteScript}
                      className="float-right"
                    >
                      Delete
                    </Button>
                  </div>
                </Form>
                <Modal
                  show={isOptionsModalShown}
                  onHide={() => setIsOptionsModalShown(false)}
                >
                  <Modal.Header closeButton>
                    <Modal.Title>{values.trigger.name}</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    {triggers[values.trigger.name].params.map((param) => (
                      <FormGroup
                        name={`trigger.params.${param.param}`}
                        key={param.param}
                        label={param.name}
                        as={param.component}
                        text={param.description}
                      />
                    ))}
                  </Modal.Body>
                  <Modal.Footer>
                    <Button
                      variant="secondary"
                      onClick={() => setIsOptionsModalShown(false)}
                    >
                      Close
                    </Button>
                  </Modal.Footer>
                </Modal>
              </>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
}
