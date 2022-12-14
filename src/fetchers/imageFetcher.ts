import axios from "axios";

export async function fetchImage(uri: string): Promise<string> {
  try {
    const response = await axios.get(uri);
    const text = response.data as string;
    return text;
  } catch (e) {
    return "";
  }
}
