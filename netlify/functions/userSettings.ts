import type { Handler } from "@netlify/functions";
import { verifyToken } from "../lib/verifyToken";
import { connectDB } from "../lib/connectDB";
import { UserSettingsModel } from "../lib/models";
import { USER_SETTINGS_PATCH_KEYS } from "../../shared/types/settings";
import type { UserSettingsPatch } from "../../shared/types/settings";

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
        const settings = await UserSettingsModel.findOneAndUpdate(
          { userID },
          { $setOnInsert: { userID } },
          { upsert: true, returnDocument: "after" },
        );

        return jsonResponse(200, settings);
      }

      case "PATCH": {
        const body = JSON.parse(event.body || "{}");

        const updates = Object.fromEntries(
          Object.entries(body).filter(([key]) =>
            USER_SETTINGS_PATCH_KEYS.includes(key as keyof UserSettingsPatch),
          ),
        );

        if (Object.keys(updates).length === 0) {
          return jsonResponse(400, { error: "No valid fields provided" });
        }

        const updated = await UserSettingsModel.findOneAndUpdate(
          { userID },
          { $set: updates },
          { returnDocument: "after" },
        );

        return jsonResponse(200, updated);
      }

      default: {
        return jsonResponse(405, { error: "Method not allowed" });
      }
    }
  } catch (err: any) {
    return jsonResponse(500, { error: err.message });
  }
};

function jsonResponse(statusCode: number, body: object) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}
