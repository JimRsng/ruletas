export { z } from "zod";

export const createTwitchError = (e: { body: unknown }, map?: Record<string, [status: number, message: string]>) => {
  const body = (typeof e.body === "string" ? JSON.parse(e.body) : e.body) as { status: number, message: string };

  return createError({
    status: map?.[body.message || ""]?.[0] || body.status || 500,
    message: map?.[body.message || ""]?.[1] || body.message || "Ha ocurrido un error desconocido"
  });
};
