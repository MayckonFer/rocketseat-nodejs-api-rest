import { app } from "./app";
import { env } from "./env";

// colocando porta para rodar o server
app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log("HTTP Server is Running!");
  });
