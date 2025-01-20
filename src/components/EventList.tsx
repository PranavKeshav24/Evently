import { useState } from "react";
import { format, isToday, isTomorrow, differenceInMinutes } from "date-fns";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Video,
  X,
  Globe,
  Lock,
  Repeat,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog } from "@headlessui/react";
import type { CalendarEvent } from "../types/calendar";

interface EventListProps {
  events: CalendarEvent[];
}

const colorMap: Record<string, string> = {
  "1": "bg-red-100 border-red-200",
  "2": "bg-blue-100 border-blue-200",
  "3": "bg-green-100 border-green-200",
  "4": "bg-yellow-100 border-yellow-200",
  "5": "bg-purple-100 border-purple-200",
  default: "bg-gray-50 border-gray-200",
};

const getEventImage = (event: CalendarEvent): string => {
  const summary = event.summary?.toLowerCase() || "";
  const description = event.description?.toLowerCase() || "";
  const location = event.location?.toLowerCase() || "";

  if (
    event.hangoutLink ||
    description.includes("zoom") ||
    description.includes("meet")
  ) {
    return "https://images.unsplash.com/photo-1516387938699-a93567ec168e?auto=format&fit=crop&q=80&w=1000";
  }

  if (
    location.includes("lunch") ||
    summary.includes("lunch") ||
    description.includes("lunch")
  ) {
    return "https://images.unsplash.com/photo-1547573854-74d2a71d0826?auto=format&fit=crop&q=80&w=1000";
  }

  if (summary.includes("meeting") || description.includes("meeting")) {
    return "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1000";
  }

  if (summary.includes("training") || description.includes("training")) {
    return "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=1000";
  }

  if (summary.includes("birthday") || description.includes("birthday")) {
    return "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&q=80&w=1000";
  }

  return "https://images.unsplash.com/photo-1506784693919-ef06d93c28d2?auto=format&fit=crop&q=80&w=1000";
};

const getDuration = (start: string, end: string): string => {
  const duration = differenceInMinutes(new Date(end), new Date(start));
  if (duration >= 1440) {
    // 24 hours
    const days = Math.floor(duration / 1440);
    return `${days} day${days > 1 ? "s" : ""}`;
  }
  if (duration >= 60) {
    const hours = Math.floor(duration / 60);
    return `${hours} hour${hours > 1 ? "s" : ""}`;
  }
  return `${duration} min`;
};

export function EventList({ events }: EventListProps) {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );

  const getDateLabel = (date: Date) => {
    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    return format(date, "MMMM d, yyyy");
  };

  const groupedEvents = events.reduce(
    (acc: Record<string, CalendarEvent[]>, event) => {
      const date = format(new Date(event.start.dateTime), "yyyy-MM-dd");
      if (!acc[date]) acc[date] = [];
      acc[date].push(event);
      return acc;
    },
    {}
  );

  return (
    <>
      <div className="space-y-8">
        {Object.entries(groupedEvents).map(([date, dayEvents]) => (
          <div key={date} className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {getDateLabel(new Date(date))}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dayEvents.map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.2 }}
                  className={`cursor-pointer rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all ${
                    colorMap[event.colorId || "default"]
                  }`}
                  onClick={() => setSelectedEvent(event)}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={getEventImage(event)}
                      alt={event.summary}
                      className="w-full h-full object-cover"
                    />
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
                        <span>
                          {format(new Date(event.start.dateTime), "h:mm a")}
                        </span>
                      </div>
                      <span className="font-medium">
                        {getDuration(event.start.dateTime, event.end.dateTime)}
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
              ))}
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {selectedEvent && (
          <Dialog
            open={true}
            onClose={() => setSelectedEvent(null)}
            className="fixed inset-0 z-10 overflow-y-auto"
          >
            <div className="flex min-h-screen items-center justify-center">
              <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative mx-auto max-w-2xl w-full bg-white rounded-xl shadow-2xl overflow-hidden"
              >
                <div className="relative h-64">
                  <img
                    src={getEventImage(selectedEvent)}
                    alt={selectedEvent.summary}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent" />
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="absolute right-4 top-4 text-white hover:text-gray-200"
                  >
                    <X size={24} />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <Dialog.Title className="text-3xl font-bold text-white">
                      {selectedEvent.summary}
                    </Dialog.Title>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {selectedEvent.description && (
                    <Dialog.Description className="text-gray-600 whitespace-pre-line">
                      {selectedEvent.description}
                    </Dialog.Description>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center text-gray-600">
                        <Calendar size={20} className="mr-3" />
                        <span>
                          {format(
                            new Date(selectedEvent.start.dateTime),
                            "MMMM d, yyyy"
                          )}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock size={20} className="mr-3" />
                        <div>
                          <div>
                            {format(
                              new Date(selectedEvent.start.dateTime),
                              "h:mm a"
                            )}{" "}
                            -
                            {format(
                              new Date(selectedEvent.end.dateTime),
                              "h:mm a"
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
                            Duration:{" "}
                            {getDuration(
                              selectedEvent.start.dateTime,
                              selectedEvent.end.dateTime
                            )}
                          </div>
                        </div>
                      </div>
                      {selectedEvent.location && (
                        <div className="flex items-center text-gray-600">
                          <MapPin size={20} className="mr-3" />
                          <span>{selectedEvent.location}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      {selectedEvent.recurringEventId && (
                        <div className="flex items-center text-gray-600">
                          <Repeat size={20} className="mr-3" />
                          <span>Recurring event</span>
                        </div>
                      )}
                      {selectedEvent.visibility && (
                        <div className="flex items-center text-gray-600">
                          {selectedEvent.visibility === "private" ? (
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
                      {selectedEvent.status === "tentative" && (
                        <div className="flex items-center text-amber-600">
                          <AlertCircle size={20} className="mr-3" />
                          <span>Tentative</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {selectedEvent.attendees &&
                    selectedEvent.attendees.length > 0 && (
                      <div className="border-t pt-4">
                        <h4 className="font-semibold text-gray-900 mb-3">
                          Attendees
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                          {selectedEvent.attendees.map((attendee, index) => (
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
                              <span className="flex-1 truncate">
                                {attendee.email}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {selectedEvent.hangoutLink && (
                    <div className="border-t pt-4">
                      <a
                        href={selectedEvent.hangoutLink}
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
        )}
      </AnimatePresence>
    </>
  );
}
