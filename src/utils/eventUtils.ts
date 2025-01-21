import type { CalendarEvent } from "../types/calendar";

/**
 * Maps event types to appropriate Unsplash images
 */
const EVENT_IMAGE_MAP = {
  videoCall: "https://images.unsplash.com/photo-1516387938699-a93567ec168e",
  lunch: "https://images.unsplash.com/photo-1547573854-74d2a71d0826",
  meeting: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4",
  training: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655",
  birthday: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3",
  default: "https://images.unsplash.com/photo-1506784693919-ef06d93c28d2",
} as const;

/**
 * Determines the appropriate image URL for an event based on its properties
 * @param event - Calendar event object
 * @returns Unsplash image URL
 */
export const getEventImage = (event: CalendarEvent): string => {
  const summary = event.summary?.toLowerCase() || "";
  const description = event.description?.toLowerCase() || "";
  const location = event.location?.toLowerCase() || "";

  const imageParams = "auto=format&fit=crop&q=80&w=1000";

  if (
    event.hangoutLink ||
    description.includes("zoom") ||
    description.includes("meet")
  ) {
    return `${EVENT_IMAGE_MAP.videoCall}?${imageParams}`;
  }

  if (
    location.includes("lunch") ||
    summary.includes("lunch") ||
    description.includes("lunch")
  ) {
    return `${EVENT_IMAGE_MAP.lunch}?${imageParams}`;
  }

  if (summary.includes("meeting") || description.includes("meeting")) {
    return `${EVENT_IMAGE_MAP.meeting}?${imageParams}`;
  }

  if (summary.includes("training") || description.includes("training")) {
    return `${EVENT_IMAGE_MAP.training}?${imageParams}`;
  }

  if (summary.includes("birthday") || description.includes("birthday")) {
    return `${EVENT_IMAGE_MAP.birthday}?${imageParams}`;
  }

  return `${EVENT_IMAGE_MAP.default}?${imageParams}`;
};
