import type { Handler } from "@netlify/functions";
import { verifyToken } from "../lib/verifyToken";
import { connectDB } from "../lib/connectDB";
import { AccountModel, TransactionModel } from "../lib/models";
import { ACCOUNT_PATCH_KEYS } from "../../shared/types/account";
import type { AccountPatch } from "../../shared/types/account";

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

    switch (event.httpMethod) {
      case "GET": {
        const query: Record<string, string> = { userID };
        const accounts = await AccountModel.find(query);
        return jsonResponse(200, accounts);
      }

      case "POST": {
        const { name, type } = JSON.parse(event.body || "{}");

        if (!name || !type)
          return jsonResponse(400, { error: "Missing required fields" });

        const newAccount = await AccountModel.create({
          name,
          type,
        });
        return jsonResponse(201, newAccount);
      }

      case "DELETE": {
        const { id } = event.queryStringParameters || {};
        if (!id) return jsonResponse(400, { error: "Account ID is required" });

        const account = await AccountModel.findOne({ _id: id, userID });
        if (!account) return jsonResponse(404, { error: "Account not found" });

        await Promise.all([
          AccountModel.deleteOne({ _id: id }),
          TransactionModel.deleteMany({ accountID: id }),
        ]);

        return jsonResponse(200, {
          message: "Account and transactions deleted",
        });
      }

      case "PATCH": {
        const { id } = event.queryStringParameters || {};
        if (!id) return jsonResponse(400, { error: "Account ID is required" });

        const body = JSON.parse(event.body || "{}");

        const updates = Object.fromEntries(
          Object.entries(body).filter(([key]) =>
            ACCOUNT_PATCH_KEYS.includes(key as keyof AccountPatch),
          ),
        );

        if (Object.keys(updates).length === 0)
          return jsonResponse(400, { error: "No valid fields provided" });

        const updated = await AccountModel.findOneAndUpdate(
          { _id: id, userID },
          { $set: updates },
          { returnDocument: "after" },
        );

        if (!updated) return jsonResponse(400, { error: "Account not found" });

        return jsonResponse(200, updated);
      }

      default: {
        return jsonResponse(405, { error: "Method not allowed" });
      }
    }
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
