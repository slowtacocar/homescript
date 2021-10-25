import { Button } from "react-bootstrap";

export default function LoadingButton({ isLoading, children, ...props }) {
  return (
    <Button disabled={isLoading} {...props}>
      {isLoading ? "Loading" : children}
    </Button>
  );
}
