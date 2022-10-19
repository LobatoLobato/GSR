import "./preview.css";
import { htmlFormatter, styleTagScoper } from "../../common/utils";
interface Props {
  xhtml: string;
}

export default function Preview(props: Props) {
  return (
    <div className="preview">
      <h2 className="select-none"> Preview </h2>
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
  const { scope, scopedXhtml } = styleTagScoper(xhtml);
  return `
  <div xmlns="http://www.w3.org/1999/xhtml" class="${scope}">
    ${htmlFormatter(scopedXhtml)}
  </div>`;
}
