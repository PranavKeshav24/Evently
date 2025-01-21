import { format } from "date-fns";
import { Dialog } from "@headlessui/react";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  X,
  Globe,
  Lock,
  Repeat,
  AlertCircle,
} from "lucide-react";
import type { CalendarEvent } from "../types/calendar";
import { getEventImage } from "../utils/eventUtils";

interface EventDetailsProps {
  event: CalendarEvent;
  onClose: () => void;
}

export function EventDetails({ event, onClose }: EventDetailsProps) {
  const getDuration = (start: string, end: string): string => {
    const duration = Math.round(
      (new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60)
    );

    if (duration >= 1440) {
      const days = Math.floor(duration / 1440);
      return `${days} day${days > 1 ? "s" : ""}`;
    }
    if (duration >= 60) {
      const hours = Math.floor(duration / 60);
      return `${hours} hour${hours > 1 ? "s" : ""}`;
    }
    return `${duration} minutes`;
  };

  return (
    <Dialog
      open={true}
      onClose={onClose}
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      <div className="flex min-h-screen items-center justify-center p-4">
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="relative mx-auto max-w-2xl w-full bg-white rounded-xl shadow-2xl overflow-hidden"
        >
          <div className="relative h-64">
            <img
              src={getEventImage(event)}
              alt={event.summary}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent" />
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-white hover:text-gray-200 transition-colors"
            >
              <X size={24} />
            </button>
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <Dialog.Title className="text-3xl font-bold text-white">
                {event.summary}
              </Dialog.Title>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {event.description && (
              <Dialog.Description className="text-gray-600 whitespace-pre-line">
                {event.description}
              </Dialog.Description>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <Calendar size={20} className="mr-3" />
                  <span>
                    {format(new Date(event.start.dateTime), "MMMM d, yyyy")}
                  </span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock size={20} className="mr-3" />
                  <div>
                    <div>
                      {format(new Date(event.start.dateTime), "h:mm a")} -
                      {format(new Date(event.end.dateTime), "h:mm a")}
                    </div>
                    <div className="text-sm text-gray-500">
                      Duration:{" "}
                      {getDuration(event.start.dateTime, event.end.dateTime)}
                    </div>
                  </div>
                </div>
                {event.location && (
                  <div className="flex items-center text-gray-600">
                    <MapPin size={20} className="mr-3" />
                    <span>{event.location}</span>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                {event.recurringEventId && (
                  <div className="flex items-center text-gray-600">
                    <Repeat size={20} className="mr-3" />
                    <span>Recurring event</span>
                  </div>
                )}
                {event.visibility && (
                  <div className="flex items-center text-gray-600">
                    {event.visibility === "private" ? (
                      <>
                        <Lock size={20} className="mr-3" />
                        <span>Private event</span>
                      </>
                    ) : (
                      <>
                        <Globe size={20} className="mr-3" />
                        <span>Public event</span>
                      </>
                    )}
                  </div>
                )}
                {event.status === "tentative" && (
                  <div className="flex items-center text-amber-600">
                    <AlertCircle size={20} className="mr-3" />
                    <span>Tentative</span>
                  </div>
                )}
              </div>
            </div>

            {event.attendees && event.attendees.length > 0 && (
              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-900 mb-3">Attendees</h4>
                <div className="grid grid-cols-2 gap-3">
                  {event.attendees.map((attendee, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-2"
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${
                          attendee.responseStatus === "accepted"
                            ? "bg-green-500"
                            : attendee.responseStatus === "declined"
                            ? "bg-red-500"
                            : attendee.responseStatus === "tentative"
                            ? "bg-yellow-500"
                            : "bg-gray-500"
                        }`}
                      />
                      <span className="flex-1 truncate">{attendee.email}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {event.hangoutLink && (
              <div className="border-t pt-4">
                <a
                  href={event.hangoutLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Video size={16} className="mr-2" />
                  Join video call
                </a>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </Dialog>
  );
}
