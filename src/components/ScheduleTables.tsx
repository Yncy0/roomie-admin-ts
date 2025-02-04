import { Database } from "database.types";
import { generateTimeSlots } from "../utils/timeUtils";

type Schedule = Database["public"]["Tables"]["schedule"]["Row"] & {
  course: Database["public"]["Tables"]["course"]["Row"] | null;
  profiles: Database["public"]["Tables"]["profiles"]["Row"] | null;
  subject: Database["public"]["Tables"]["subject"]["Row"] | null;
  rooms: Database["public"]["Tables"]["rooms"]["Row"] | null;
};

interface WeeklyScheduleProps {
  schedules: Schedule[];
  startTime?: string;
  endTime?: string;
  intervalMinutes?: number;
}

const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export function WeeklySchedule({
  schedules,
  startTime = "06:00",
  endTime = "20:00",
  intervalMinutes = 60,
}: WeeklyScheduleProps) {
  const timeSlots = generateTimeSlots(startTime, endTime, intervalMinutes);

  if (schedules.length === 0) {
    return (
      <p className="text-center mt-4">
        No schedules found for the selected room.
      </p>
    );
  }

  const getScheduleForSlot = (day: string, time: string) => {
    const schedule = schedules.find((schedule) => {
      const scheduleDay = schedule.days?.toLowerCase();
      const scheduleTimeIn = schedule.timef_in;
      const scheduleTimeOut = schedule.timef_out;

      // Match the day (case insensitive)
      const dayMatches = scheduleDay === day.toLowerCase();

      // Convert times to minutes for comparison
      const timeInMinutes = getMinutesFromTime(scheduleTimeIn as string);
      const timeOutMinutes = getMinutesFromTime(scheduleTimeOut as string);
      const slotMinutes = getMinutesFromTime(time);

      // Check if the current slot time is within the schedule's time range
      const timeInRange =
        timeInMinutes <= slotMinutes && timeOutMinutes > slotMinutes;

      // Log the details for debugging
      console.log({
        scheduleDay,
        dayMatches,
        scheduleTimeIn,
        scheduleTimeOut,
        timeInRange,
        matchFound: dayMatches && timeInRange,
      });

      return dayMatches && timeInRange;
    });

    return schedule;
  };

  const getMinutesFromTime = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + (minutes || 0);
  };

  const getRowSpan = (schedule: Schedule) => {
    if (!schedule.timef_in || !schedule.timef_out) return 1;
    const startMinutes = getMinutesFromTime(schedule.timef_in);
    const endMinutes = getMinutesFromTime(schedule.timef_out);
    return Math.max(
      1,
      Math.ceil((endMinutes - startMinutes) / intervalMinutes)
    );
  };

  const renderScheduleCell = (
    day: string,
    slot: string,
    schedule: Schedule
  ) => {
    const rowSpan = getRowSpan(schedule);
    console.log(`Rendering schedule for ${day} at ${slot}:`, {
      course: schedule.course?.course_name,
      timeIn: schedule.timef_in,
      timeOut: schedule.timef_out,
      rowSpan,
    });

    return (
      <td
        key={`${day}-${slot}`}
        className="p-2 border bg-blue-100"
        rowSpan={rowSpan}
      >
        <div className="h-full flex flex-col justify-center">
          <p className="font-bold text-center text-sm">
            {schedule.course?.course_name ?? "N/A"}
          </p>
          <p className="text-center text-xs">
            {schedule.subject?.subject_code ?? "N/A"}
          </p>
          <p className="text-center text-xs">
            {schedule.profiles?.username ?? "N/A"}
          </p>
        </div>
      </td>
    );
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="p-2 border bg-gray-100"></th>
            {weekdays.map((day) => (
              <th
                key={day}
                className="p-2 border bg-gray-100 font-medium text-center"
              >
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {timeSlots.map((slot) => (
            <tr key={slot}>
              <td className="p-2 border font-medium text-center whitespace-nowrap">
                {slot}
              </td>
              {weekdays.map((day) => {
                const schedule = getScheduleForSlot(day, slot);
                if (schedule) {
                  if (schedule.timef_in === slot) {
                    return renderScheduleCell(day, slot, schedule);
                  }
                  return null; // This slot is covered by a previous rowSpan
                }
                return <td key={`${day}-${slot}`} className="p-2 border"></td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
