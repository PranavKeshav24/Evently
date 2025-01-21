import { motion } from "framer-motion";
import { format } from "date-fns";
import { Clock, MapPin, Users, Video, Globe, Lock, Repeat } from "lucide-react";
import type { CalendarEvent } from "../types/calendar";
import { EventImage } from "./shared/EventImage";
import { getDuration } from "../utils/dateUtils";

interface EventCardProps {
  event: CalendarEvent;
  onClick: () => void;
}

/**
 * Individual event card component with hover animations
 */
export function EventCard({ event, onClick }: EventCardProps) {
  const colorMap: Record<string, string> = {
    "1": "bg-red-100 border-red-200",
    "2": "bg-blue-100 border-blue-200",
    "3": "bg-green-100 border-green-200",
    "4": "bg-yellow-100 border-yellow-200",
    "5": "bg-purple-100 border-purple-200",
    default: "bg-gray-50 border-gray-200",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.2 }}
      className={`cursor-pointer rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all ${
        colorMap[event.colorId || "default"]
      }`}
      onClick={onClick}
    >
      <div className="relative h-48 overflow-hidden">
        <EventImage event={event} className="w-full h-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-xl font-bold text-white line-clamp-2">
            {event.summary}
          </h3>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center">
            <Clock size={16} className="mr-2" />
            <span>{format(new Date(event.start.dateTime), "h:mm a")}</span>
          </div>
          <span className="font-medium">
            {getDuration(event.start.dateTime, event.end.dateTime, true)}
          </span>
        </div>

        {event.location && (
          <div className="flex items-center text-sm text-gray-600">
            <MapPin size={16} className="mr-2 flex-shrink-0" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
        )}

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-gray-600">
            {event.attendees && (
              <div className="flex items-center">
                <Users size={16} className="mr-2" />
                <span>{event.attendees.length}</span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {event.recurringEventId && (
              <Repeat size={16} className="text-blue-500" />
            )}
            {event.visibility === "private" ? (
              <Lock size={16} className="text-gray-500" />
            ) : (
              <Globe size={16} className="text-gray-500" />
            )}
            {event.hangoutLink && (
              <Video size={16} className="text-green-500" />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
