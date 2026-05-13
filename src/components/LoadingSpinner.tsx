import { Circle, LoaderCircle } from "lucide-react";

export default function LoadingSpinner({
  className = "",
  className1 = "stroke-gray-500",
  className2 = "stroke-black",
}: {
  className?: string;
  className1?: string;
  className2?: string;
}) {
  return (
    <div className={`relative w-[80%] h-[80%] ${className}`}>
      <LoaderCircle
        className={`absolute w-full h-full origin-center stroke-4 animate-[spin_1.5s_linear_infinite] text-blue-400
          ${className1}`}
      />
      <LoaderCircle
        className={`absolute w-full h-full origin-center stroke-5 animate-[spin_4s_linear_infinite]
          ${className2}`}
      />
    </div>
  );
}
