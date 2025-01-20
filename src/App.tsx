import { useState, useEffect } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { Calendar, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { Toaster, toast } from "react-hot-toast";
import { DateFilter } from "./components/DateFilter";
import { EventList } from "./components/EventList";
import Logo from "./assets/Logo.png";
import type { CalendarEvent } from "./types/calendar";

function App() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      setAccessToken(tokenResponse.access_token);
      toast.success("Successfully signed in!");
    },
    onError: () => {
      toast.error("Failed to sign in. Please try again.");
    },
    scope: "https://www.googleapis.com/auth/calendar.readonly",
  });

  const handleLogout = () => {
    setAccessToken(null);
    setEvents([]);
    toast.success("Successfully signed out!");
  };

  const fetchCalendarEvents = async (token: string) => {
    setLoading(true);
    try {
      const timeMin = new Date(startDate).toISOString();
      const timeMax = new Date(endDate).toISOString();

      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${timeMin}&timeMax=${timeMax}&orderBy=startTime&singleEvents=true`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch calendar events");
      }

      const data = await response.json();
      setEvents(data.items);
      toast.success("Calendar events updated!");
    } catch (error) {
      console.error("Error fetching calendar events:", error);
      toast.error("Failed to fetch calendar events");
    } finally {
      setLoading(false);
    }
  };

  // Filter events based on search term and location
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

  useEffect(() => {
    if (accessToken) {
      fetchCalendarEvents(accessToken);
    }
  }, [accessToken, startDate, endDate]);

  if (!accessToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center relative overflow-hidden">
        {/* Particle Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 animate-gradient bg-gradient-to-r from-blue-300 via-purple-300 to-indigo-300 opacity-40 blur-xl"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg hover:shadow-2xl transform transition duration-500"
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
            >
              <Calendar className="mx-auto h-16 w-16 text-blue-500" />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="mt-6 text-4xl font-bold text-gray-900"
            >
              Evently
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="mt-2 text-md text-gray-600"
            >
              Your personalized calendar dashboard
            </motion.p>
          </div>

          <motion.div
            className="mt-8 flex justify-center w-fit mx-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <button
              onClick={() => login()}
              className="group relative flex justify-center py-3 px-6 my-auto border border-transparent text-sm font-medium rounded-full text-black border-blue-600 bg-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md transform transition-all duration-300 hover:shadow-lg hover:text-white"
            >
              <img
                src={Logo}
                className=" w-6 h-6 mr-4 bg-white p-0.5 rounded-full"
              ></img>
              Sign in with Google
            </button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Your Calendar Events
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              View and filter your upcoming events
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </motion.button>
        </div>

        <DateFilter
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onSearchChange={setSearchTerm}
          onLocationChange={setLocationFilter}
        />

        <div className="mt-8">
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center items-center py-12"
            >
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
            </motion.div>
          ) : (
            <EventList events={filteredEvents} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
