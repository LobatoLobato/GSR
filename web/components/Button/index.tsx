import React from "react";
import "./button.scss";
import { Loader } from "../Loader";

interface Props {
  text: string;
  className: string;
  loading?: boolean;
  onClick: (event: React.MouseEvent) => void;
}

export function Button(props: Props): JSX.Element {
  const { text, onClick, className, loading } = props;

  if (loading) {
    return <Loader className={className} />;
  }
  return (
    <button className={className} onClick={onClick}>
      {text}
    </button>
  );
}
