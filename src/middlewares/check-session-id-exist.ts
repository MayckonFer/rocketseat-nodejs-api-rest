import { FastifyReply, FastifyRequest } from "fastify";

export async function checkSessionIdExist(
  request: FastifyRequest,
  reply: FastifyReply
) {
  // Validação de cookie como se fosse o token, se não tiver o sessionId ele não deixar passar
  const sessionId = request.cookies.sessionId;

  if (!sessionId) {
    return reply.status(401).send({
      error: "Unathorized.",
    });
  }
}
