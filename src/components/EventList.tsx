import React from "react";
import { AnimatePresence } from "framer-motion";
import { format, isToday, isTomorrow } from "date-fns";
import type { CalendarEvent } from "../types/calendar";
import { EventDetails } from "./EventDetails";
import { EventCard } from "./EventCard";

interface EventListProps {
  events: CalendarEvent[];
}

/**
 * Displays events in a card-based grid layout grouped by date
 */
export function EventList({ events }: EventListProps) {
  const [selectedEvent, setSelectedEvent] =
    React.useState<CalendarEvent | null>(null);

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
                <EventCard
                  key={event.id}
                  event={event}
                  onClick={() => setSelectedEvent(event)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {selectedEvent && (
          <EventDetails
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
