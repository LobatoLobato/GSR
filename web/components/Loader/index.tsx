import "./loader.scss";
interface Props {
  className?: string;
}
export function Loader(props: Props) {
  return (
    <div className={props.className ?? "loader-container"}>
      <div className="loader" />
    </div>
  );
}
