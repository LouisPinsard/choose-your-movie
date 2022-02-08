import classNames from "classnames";
import { useEffect, useState } from "react";

export const ValidationMessage: React.FunctionComponent<{
  error: string;
  isSubmitting: boolean;
}> = ({ error, isSubmitting }) => {
  const [show, setShow] = useState(!!error);

  useEffect(() => {
    const id = setTimeout(() => {
      const hasError = !!error;
      setShow(hasError && !isSubmitting);
    });

    return () => clearTimeout(id);
  }, [error, isSubmitting]);

  return (
    <div
      className={classNames("validation-message", {
        "validation-message--visible": show,
      })}
    >
      {error}
    </div>
  );
};
