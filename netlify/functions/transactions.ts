import type { Handler } from "@netlify/functions";
import { verifyToken } from "../lib/verifyToken";
import { TransactionModel } from "../lib/models";
import { connectDB } from "../lib/connectDB";
import { TRANSACTION_PATCH_KEYS } from "../../shared/types/transaction";
import { sanitizeString, sanitizeCurrencyAmount } from "../lib/sanitize";
import type { TransactionPatch } from "../../shared/types/transaction";

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
        const { accountID } = event.queryStringParameters || {};

        const query: Record<string, string> = { userID };
        if (accountID) query.accountID = accountID;

        const transactions = await TransactionModel.find(query);
        return jsonResponse(200, transactions);
      }

      case "POST": {
        const { accountID, amount, description, date, location } = JSON.parse(
          event.body || "{}",
        );

        if (!accountID || amount === undefined || amount === null)
          return jsonResponse(400, { error: "Missing required fields" });

        const safeAmt = sanitizeCurrencyAmount(amount);
        if (!safeAmt)
          return jsonResponse(400, {
            error: "Amount invalid. Must be a non-zero number.",
          });

        const newTransaction = await TransactionModel.create({
          userID,
          accountID,
          amount: safeAmt,
          description: sanitizeString(description, 500),
          date: sanitizeString(date, 50),
          location: sanitizeString(location, 200),
        });
        return jsonResponse(201, newTransaction);
      }

      case "DELETE": {
        const { id } = event.queryStringParameters || {};

        if (!id)
          return jsonResponse(400, { error: "Transaction ID is required" });

        const transaction = await TransactionModel.findOne({ _id: id, userID });

        if (!transaction)
          return jsonResponse(404, { error: "Transaction not found" });

        await TransactionModel.deleteOne({ _id: id });
        return jsonResponse(200, { message: "Transaction deleted" });
      }

      case "PATCH": {
        const { id } = event.queryStringParameters || {};

        if (!id)
          return jsonResponse(400, { error: "Transaction ID is required" });

        const updates = JSON.parse(event.body || "{}");
        const setFields: Record<string, unknown> = {};

        if (updates.amount !== undefined) {
          const safeAmt = sanitizeCurrencyAmount(updates.amount);
          if (safeAmt === null)
            return jsonResponse(400, {
              error: "Amount invalid. Must be a non-zero number.",
            });
          setFields.amount = safeAmt;
        }

        for (const [key, value] of Object.entries(updates)) {
          if (key === "amount" || value === undefined) continue;
          if (TRANSACTION_PATCH_KEYS.includes(key as keyof TransactionPatch)) {
            const max = key === "location" ? 100 : key === "date" ? 24 : 500;
            setFields[key] = sanitizeString(value as string, max);
          }
        }

        if (Object.keys(setFields).length === 0)
          return jsonResponse(400, { error: "No valid fields provided." });

        const updated = await TransactionModel.findOneAndUpdate(
          { _id: id, userID },
          { $set: setFields },
          { returnDocument: "after" },
        );

        if (!updated)
          return jsonResponse(404, { error: "Transaction not found" });

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
