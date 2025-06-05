import { FastifyInstance } from "fastify";
import { z } from "zod";
import { randomUUID } from "node:crypto";
import { knex } from "../database";
import { checkSessionIdExist } from "../middlewares/check-session-id-exist";

export async function transactionsRoutes(app: FastifyInstance) {
  app.post("/create", async (request, reply) => {
    // validando os campos do db para não enviar coisas erradas e tipando para aparecer no request body
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(["credit", "debit"]),
    });

    // criando um sessionId com cookie como se fosse um token do usuário
    let sessionId = request.cookies.sessionId;

    // validando se o usuário tem um cookie, se não tiver ele cria um usando o uuid
    if (!sessionId) {
      sessionId = randomUUID();

      reply.cookie("sessionId", sessionId, {
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 dias (tempo para expirar o cookie do usuário)
      });
    }

    const { title, amount, type } = createTransactionBodySchema.parse(
      request.body
    );

    await knex("transactions").insert({
      id: randomUUID(),
      title,
      amount: type === "credit" ? amount : amount * -1,
      session_id: sessionId,
    });

    reply.status(201).send();
  });

  app.get("/", { preHandler: [checkSessionIdExist] }, async (request) => {
    const { sessionId } = request.cookies;

    // listando todas as transactions
    const transactions = await knex("transactions")
      // aqui só vai listar as transactions do usuário com o sessionId dele
      .where("session_id", sessionId)
      .select();

    return { transactions };
  });

  app.get("/:id", { preHandler: [checkSessionIdExist] }, async (request) => {
    // validando os campos do db para não enviar coisas erradas e tipando para aparecer no request body
    const getTransactionParamsSchema = z.object({
      id: z.string().uuid(),
    });

    // desestruturando o id e transformando ele em obj
    const { id } = getTransactionParamsSchema.parse(request.params);

    // buscando o sessionId do usuário
    const { sessionId } = request.cookies;

    // buscando uma transaction pelo o id e colocando o first para não ficar como array
    const transaction = await knex("transactions")
      .where({
        session_id: sessionId,
        id,
      })
      .first();

    return { transaction };
  });

  app.get(
    "/summary",
    { preHandler: [checkSessionIdExist] },
    async (request) => {
      // buscando o sessionId do usuário
      const { sessionId } = request.cookies;

      // somando os valores das transactions do usuário e listando
      const summary = await knex("transactions")
        .where("session_id", sessionId)
        .sum("amount", { as: "amount" })
        .first();

      return { summary };
    }
  );
}
