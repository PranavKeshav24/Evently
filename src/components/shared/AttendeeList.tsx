import type { CalendarEvent } from "../../types/calendar";

interface AttendeeListProps {
  attendees: NonNullable<CalendarEvent["attendees"]>;
}

/**
 * Displays a grid of attendees with their response status
 */
export function AttendeeList({ attendees }: AttendeeListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-green-500";
      case "declined":
        return "bg-red-500";
      case "tentative":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      {attendees.map((attendee, index) => (
        <div
          key={index}
          className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-2"
        >
          <div
            className={`w-2 h-2 rounded-full ${getStatusColor(
              attendee.responseStatus
            )}`}
          />
          <span className="flex-1 truncate">{attendee.email}</span>
        </div>
      ))}
    </div>
  );
}
