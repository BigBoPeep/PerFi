import type { HandlerEvent } from "@netlify/functions";
import { AccountModel, TransactionModel } from "./models";
import { ACCOUNT_PATCH_KEYS } from "../../shared/types/account";
import { sanitizeString } from "./utils";
import { jsonResponse } from "./utils";
import type { AccountPatch } from "../../shared/types/account";

export const handleAccounts = async (event: HandlerEvent, userID: string) => {
  switch (event.httpMethod) {
    case "GET": {
      const query: Record<string, string> = { userID };
      const accounts = await AccountModel.find(query);
      return jsonResponse(200, accounts);
    }

    case "POST": {
      const { name, type } = JSON.parse(event.body || "{}");

      const sanitizedName = sanitizeString(name, 100);
      const sanitizedType = sanitizeString(type, 100);

      if (!sanitizedName || !sanitizedType)
        return jsonResponse(400, { error: "Missing required fields" });

      if (sanitizedName.length < 3)
        return jsonResponse(400, {
          error: "Account Name must be at least 3 characters",
        });
      if (sanitizedType.length < 3)
        return jsonResponse(400, {
          error: "Account Type must be at least 3 characters",
        });

      const newAccount = await AccountModel.create({
        userID,
        name: sanitizedName,
        type: sanitizedType,
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

      const updates = JSON.parse(event.body || "{}");
      const setFields: Record<string, unknown> = {};

      for (const [key, value] of Object.entries(updates)) {
        if (ACCOUNT_PATCH_KEYS.includes(key as keyof AccountPatch)) {
          setFields[key] = sanitizeString(value as string, 100);
        }
      }

      if (typeof setFields.name === "string" && setFields.name.length < 3)
        return jsonResponse(400, {
          error: "Account Name must be at least 3 characters.",
        });
      if (typeof setFields.type === "string" && setFields.type.length < 3)
        return jsonResponse(400, {
          error: "Account Type must be at least 3 characters.",
        });

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
};
