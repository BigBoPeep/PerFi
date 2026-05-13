import { useState, useEffect } from "react";
import { SquareUserRound, Circle, LoaderCircle, Loader } from "lucide-react";
import { User } from "@auth0/auth0-react";
import LoadingSpinner from "../LoadingSpinner";

export default function UserAvatar({
  user,
  isLoading,
  className,
}: {
  user: User | undefined;
  isLoading: boolean;
  className?: string;
}) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [user?.picture]);

  const image = () => {
    if (isLoading) return <LoadingSpinner />;
    if (!user || !user.picture || imgError)
      return <SquareUserRound className="w-full h-full opacity-50" />;
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
    <div
      className={`w-10 h-10 place-items-center content-center 
      outline rounded-md overflow-hidden ${className}`}
    >
      {image()}
    </div>
  );
}
