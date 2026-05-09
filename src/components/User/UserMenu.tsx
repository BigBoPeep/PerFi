import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import UserAvatar from "./UserAvatar";

export default function UserMenu({}): React.JSX.Element {
  const { user, isLoading, isAuthenticated, loginWithPopup } = useAuth0();

  if (isLoading)
    return (
      <div>
        <>Checking Auth...</>
      </div>
    );

  return (
    <div>
      <UserAvatar
        user={isAuthenticated ? user : undefined}
        isLoading={isLoading}
      />

      {isAuthenticated ? (
        <p>{user?.given_name}</p>
      ) : (
        <button onClick={() => loginWithPopup()}>Log In</button>
      )}
    </div>
  );
}
