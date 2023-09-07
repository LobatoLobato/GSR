import "./pre-start";
import express from "express";
import apiRouter from "./routes";
import EnvVars from "./constants/EnvVars";

const app = express();

app.use(express.json());

app.use((_, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.use("/api", apiRouter);

if (!EnvVars.Vite) {
  console.log("OIIii");
  const frontendFiles = process.cwd() + "/dist/web";

  app.use(express.static(frontendFiles));

  app.get("*", (_, res) => {
    res.sendFile(frontendFiles + "/index.html");
  });

  const port = EnvVars.Port;
  app.listen(port, () => console.log("Server listening on http://localhost:" + port));
}

export { app };
