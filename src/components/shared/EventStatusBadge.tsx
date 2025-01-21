import { AlertCircle, Globe, Lock, Repeat } from "lucide-react";

interface EventStatusBadgeProps {
  type: "recurring" | "visibility" | "tentative";
  value?: string;
}

/**
 * Displays event status badges with consistent styling
 */
export function EventStatusBadge({ type, value }: EventStatusBadgeProps) {
  const getStatusContent = () => {
    switch (type) {
      case "recurring":
        return (
          <>
            <Repeat size={20} className="mr-3" />
            <span>Recurring event</span>
          </>
        );
      case "visibility":
        return value === "private" ? (
          <>
            <Lock size={20} className="mr-3" />
            <span>Private event</span>
          </>
        ) : (
          <>
            <Globe size={20} className="mr-3" />
            <span>Public event</span>
          </>
        );
      case "tentative":
        return (
          <>
            <AlertCircle size={20} className="mr-3" />
            <span>Tentative</span>
          </>
        );
    }
  };

  const getClassName = () => {
    switch (type) {
      case "tentative":
        return "text-amber-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className={`flex items-center ${getClassName()}`}>
      {getStatusContent()}
    </div>
  );
}
