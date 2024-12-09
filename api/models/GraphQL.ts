import EnvVars from "@api/constants/EnvVars";
import axios from "axios";

export class GraphQL {
  private instance = axios.create({
    baseURL: "https://api.github.com/graphql",
    headers: {
      "Content-Type": "application/json",
      Authorization: `token ${EnvVars.GitHubPat}`,
    },
  });

  public async query<TResponse>(queries: string[]): Promise<TResponse[]>;
  public async query<TResponse>(query: string): Promise<TResponse>;
  public async query<TResponse>(query: string | string[]): Promise<TResponse | TResponse[]> {
    if (!Array.isArray(query)) {
      const request = await this.instance.post("", { query });
      return request.data.data;
    } else {
      return Promise.all(query.map((q) => this.query<TResponse>(q)));
    }
  }

  public async queryMultiple<TResponse>(queries: string[]): Promise<TResponse[]> {
    return Promise.all(queries.map((q) => this.query<TResponse>(q)));
  }
}
