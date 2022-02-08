import React from "react";
import styles from "styles/components/spinner.css";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export const Spinner: React.FunctionComponent = () => (
  <div className="lds-ring">
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
);
