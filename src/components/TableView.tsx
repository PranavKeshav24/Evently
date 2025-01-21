import { format } from "date-fns";
import { Video, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import type { CalendarEvent } from "../types/calendar";
import { getEventImage } from "../utils/eventUtils";

interface TableViewProps {
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
}

export function TableView({ events, onEventClick }: TableViewProps) {
  return (
    <div className="bg-white rounded-lg shadow overflow-x-auto md:overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16"
            ></th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Event
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Date & Time
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Duration
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Location
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {events.map((event) => (
            <motion.tr
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{
                scale: 1.01,
              }}
              onClick={() => onEventClick(event)}
              className="cursor-pointer transition-colors hover:bg-slate-100 hover:transition-all"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="h-12 w-12 rounded-lg overflow-hidden">
                  <img
                    src={getEventImage(event)}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <div>
                    <div className="text-sm font-medium text-gray-900 line-clamp-1">
                      {event.summary}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center space-x-2">
                      {event.hangoutLink && (
                        <Video size={14} className="text-green-500" />
                      )}
                      <span className="line-clamp-1">
                        {event.attendees?.length || 0} attendees
                      </span>
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {format(new Date(event.start.dateTime), "MMM d, yyyy")}
                </div>
                <div className="text-sm text-gray-500">
                  {format(new Date(event.start.dateTime), "h:mm a")}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                  {getDuration(event.start.dateTime, event.end.dateTime)}
                </span>
              </td>
              <td className="px-6 py-4">
                {event.location ? (
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin size={14} className="mr-1 flex-shrink-0" />
                    <span className="line-clamp-1">{event.location}</span>
                  </div>
                ) : (
                  <span className="text-sm text-gray-400">No location</span>
                )}
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function getDuration(start: string, end: string): string {
  const duration = Math.round(
    (new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60)
  );

  if (duration >= 1440) {
    const days = Math.floor(duration / 1440);
    return `${days}d`;
  }
  if (duration >= 60) {
    const hours = Math.floor(duration / 60);
    return `${hours}h`;
  }
  return `${duration}m`;
}
