import { useState, useEffect } from "react";
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

  useEffect(() => {
    setImgError(false);
  }, [user?.picture]);

  const image = () => {
    if (isLoading) return <Loader />;
    if (!user || !user.picture || imgError) return <SquareUserRound />;
    return (
      <img
        src={user.picture}
        alt={user.name}
        referrerPolicy="no-referrer"
        onError={() => setImgError(true)}
      />
    );
  };

  return (
    <div className="w-8 h-8 place-items-center content-center">{image()}</div>
  );
}
