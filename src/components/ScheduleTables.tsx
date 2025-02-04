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
  console.log("Generated time slots:", timeSlots);

  const getScheduleForSlot = (day: string, time: string) => {
    const schedule = schedules.find((schedule) => {
      const scheduleDay = schedule.days;
      const scheduleTimeIn = schedule.timef_in;
      const scheduleTimeOut = schedule.timef_out;
      const dayMatches = scheduleDay === day;
      const timeInRange =
        scheduleTimeIn &&
        scheduleTimeOut &&
        scheduleTimeIn <= time &&
        scheduleTimeOut > time;

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
    return Math.ceil((endMinutes - startMinutes) / intervalMinutes);
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
                  const rowSpan = getRowSpan(schedule);
                  const isFirstSlot = schedule.timef_in === slot;
                  if (isFirstSlot) {
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
                  }
                  return null;
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
