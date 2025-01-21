import { useState, useEffect } from "react";
import type { CalendarEvent } from "../types/calendar";

interface UseEventFiltersProps {
  events: CalendarEvent[];
  searchTerm: string;
  locationFilter: string;
}

/**
 * Custom hook for handling event filtering logic
 */
export function useEventFilters({
  events,
  searchTerm,
  locationFilter,
}: UseEventFiltersProps) {
  const [filteredEvents, setFilteredEvents] = useState<CalendarEvent[]>(events);

  useEffect(() => {
    const filtered = events.filter((event) => {
      const matchesSearch =
        searchTerm === "" ||
        event.summary?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesLocation =
        locationFilter === "" ||
        event.location?.toLowerCase().includes(locationFilter.toLowerCase());

      return matchesSearch && matchesLocation;
    });

    setFilteredEvents(filtered);
  }, [events, searchTerm, locationFilter]);

  return filteredEvents;
}
