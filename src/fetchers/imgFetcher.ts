import axios from "axios";

export async function imgFetcher(uri: string): Promise<string> {
  const response = await axios.get(uri);
  const text = response.data as string;
  return text;
}
