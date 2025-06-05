import fastify from "fastify";
import cookie from "@fastify/cookie";
import { env } from "./env";
import { transactionsRoutes } from "./routes/transactions";

const app = fastify();

app.register(cookie);

// criando as rotas de transactions com o prefix /transactions antes de tudo ex: /transactions/create
app.register(transactionsRoutes, {
  prefix: "transactions",
});

// colocando porta para rodar o server
app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log("HTTP Server is Running!");
  });
