import { useState } from "react";
import { SquareUserRound, Loader } from "lucide-react";
import { User } from "@auth0/auth0-react";

export default function UserAvatar({
  user,
  isLoading,
}: {
  user: User | undefined;
  isLoading: boolean;
}) {
  const [imgError, setImgError] = useState(false);

  if (isLoading)
    return (
      <div>
        <Loader />
      </div>
    );

  if (!user || !user?.picture || imgError) {
    return (
      <div>
        <SquareUserRound />
      </div>
    );
  }

  return (
    <img src={user.picture} alt={user.name} onError={() => setImgError(true)} />
  );
}
