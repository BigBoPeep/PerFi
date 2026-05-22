import type { Handler } from "@netlify/functions";
import { verifyToken } from "../lib/verifyToken";
import { connectDB } from "../lib/connectDB";
import { handleTransactions } from "../lib/transactions";
import { handleAccounts } from "../lib/accounts";
import { handleUserSettings } from "../lib/userSettings";

export const handler: Handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  let userID: string;
  try {
    const payload = await verifyToken(event.headers.authorization);
    userID = payload.sub;
  } catch {
    return jsonResponse(401, { error: "Unauthorized" });
  }

  try {
    await connectDB();

    const path = event.path.replace("/.netlify/functions/api", "");

    if (path.startsWith("/transactions"))
      return handleTransactions(event, userID);
    if (path.startsWith("/accounts")) return handleAccounts(event, userID);
    if (path.startsWith("/userSettings"))
      return handleUserSettings(event, userID);

    return jsonResponse(404, { error: "Not found" });
  } catch (error: any) {
    return jsonResponse(500, { error: error.message });
  }
};

function jsonResponse(statusCode: number, body: object) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}
