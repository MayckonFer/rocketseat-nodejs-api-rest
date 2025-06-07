import fastify from "fastify";
import cookie from "@fastify/cookie";
import { transactionsRoutes } from "./routes/transactions";

export const app = fastify();

app.register(cookie);

// criando as rotas de transactions com o prefix /transactions antes de tudo ex: /transactions/create
app.register(transactionsRoutes, {
  prefix: "transactions",
});
