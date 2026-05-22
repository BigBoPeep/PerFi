import type { HandlerEvent } from "@netlify/functions";
import { UserSettingsModel } from "./models";
import { USER_SETTINGS_PATCH_KEYS } from "../../shared/types/settings";
import { jsonResponse } from "./utils";
import type { UserSettingsPatch } from "../../shared/types/settings";

export const handleUserSettings = async (
  event: HandlerEvent,
  userID: string,
) => {
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
};
