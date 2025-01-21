import { getEventImage } from "../../utils/eventUtils";
import type { CalendarEvent } from "../../types/calendar";

interface EventImageProps {
  event: CalendarEvent;
  className?: string;
  alt?: string;
}

/**
 * Reusable component for displaying event images with consistent styling
 */
export function EventImage({
  event,
  className = "",
  alt = "",
}: EventImageProps) {
  return (
    <img
      src={getEventImage(event)}
      alt={alt || event.summary}
      className={`object-cover ${className}`}
    />
  );
}
