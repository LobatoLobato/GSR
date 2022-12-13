import axios from "axios";
import { cssFormatter, htmlFormatter } from "../common/utils";
interface LoadResponse {
  ok: boolean;
  registeredId: string;
  code: string;
  githubUsername: string;
}
export interface LoadCodeFromDBResponse {
  githubUsername: string;
  cssVariables: string;
  cssUserCode: string;
  htmlCode: string;
}
export async function loadCodeFromDB(requestBody: {}): Promise<LoadCodeFromDBResponse> {
  if (!process.env.REACT_APP_LD_PATH) throw new Error("LOAD PATH IS NULL");
  const response = await axios.post<LoadResponse>(
    process.env.REACT_APP_LD_PATH,
    requestBody,
  );
  const { code, githubUsername } = response.data;

  const styleTags = code.match(/<style>.*?<\/style>/gim);

  let cssVariables = styleTags ? styleTags[0] : "";

  let cssUserCode = styleTags ? styleTags[1] : "";

  let htmlCode = code.replace(cssVariables, "").replace(cssUserCode, "");

  cssVariables = cssVariables.replace(/<\/?style>/gim, "");
  cssVariables = cssFormatter(cssVariables);

  cssUserCode = cssUserCode.replace(/<\/?style>/gim, "");
  cssUserCode = cssFormatter(cssUserCode);

  htmlCode = htmlFormatter(htmlCode);

  return {
    githubUsername,
    cssVariables,
    cssUserCode,
    htmlCode,
  };
}
interface UploadResponse {
  ok: boolean;
  registeredId: string;
}
export async function uploadCodeToDB(requestBody: {}) {
  if (!process.env.REACT_APP_UPD_PATH) throw new Error("UPLOAD PATH IS NULL");
  const response = await axios.post<UploadResponse>(
    process.env.REACT_APP_UPD_PATH,
    requestBody,
  );
  return response;
}
