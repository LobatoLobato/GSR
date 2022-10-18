import "./preview.css";

interface Props {
  xhtml: string;
}
export default function Preview(props: Props) {
  return (
    <div className="preview">
      <h2> Preview </h2>
      <svg xmlns="http://www.w3.org/2000/svg" className="viewBox">
        <foreignObject
          className="xhtmlContainer"
          width="100%"
          height="100%"
          dangerouslySetInnerHTML={{ __html: namespacedDiv(props.xhtml) }}
        ></foreignObject>
      </svg>
    </div>
  );
}

function namespacedDiv(xhtml: string): string {
  return `
  <div xmlns="http://www.w3.org/1999/xhtml" ">
    ${xhtml}
  </div>`;
}
