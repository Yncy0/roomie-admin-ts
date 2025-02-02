import type React from "react"
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
} from "@mui/material"
import type { BookingData, ScheduleData, UserInfo } from "../../routes/user_schedule.lazy"
import dayjs from "dayjs"

interface PrintablePageProps {
  selectedUser: string | null
  userInfo: UserInfo | null
  bookingData: BookingData[]
  scheduleData: ScheduleData[]
}

const PrintablePage: React.FC<PrintablePageProps> = ({ selectedUser, userInfo, bookingData, scheduleData }) => {
  return (
    <div className="printable-page">
      {/* User Information Section */}
      <Card sx={{ marginBottom: 2, boxShadow: "none" }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 2 }}>
            User Information
          </Typography>
          <p>
            <strong>ID:</strong> {userInfo?.user_id || "Unknown"}
          </p>
          <p>
            <strong>Full Name:</strong> {userInfo?.full_name || "Unknown"}
          </p>
          <p>
            <strong>Email:</strong> {userInfo?.user_email || "Unknown"}
          </p>
          <p>
            <strong>Mobile Number:</strong> {userInfo?.mobile_number || "Unknown"}
          </p>
          <p>
            <strong>Department:</strong> {userInfo?.user_department || "Unknown"}
          </p>
        </CardContent>
      </Card>

      {/* Schedule Information Section */}
      <Card sx={{ boxShadow: "none" }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 2 }}>
            Schedule Information
          </Typography>
          <TableContainer component={Paper} sx={{ marginTop: "10px" }}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Room Name</TableCell>
                  <TableCell>Subject Code</TableCell>
                  <TableCell>Section</TableCell>
                  <TableCell>Weekday</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell hidden>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {scheduleData
                  .filter((event) => event.user_name === selectedUser)
                  .map((event, index) => (
                    <TableRow key={index}>
                      <TableCell>{event.room_name}</TableCell>
                      <TableCell>{event.subject_code}</TableCell>
                      <TableCell>{event.course_name}</TableCell>
                      <TableCell>{event.days}</TableCell>
                      <TableCell>{`${dayjs(event.time_in, "HH:mm:ss").format("h:mm A")} - ${dayjs(event.time_out, "HH:mm:ss").format("h:mm A")}`}</TableCell>
                      <TableCell hidden>{event.status}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* CSS for Print Only */}
      <style>
        {`
          @media screen {
            .printable-page {
              display: none;
            }
          }

          @media print {
            body * {
              visibility: hidden;
            }

            .printable-page, .printable-page * {
              visibility: visible;
            }

            .printable-page {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
            }

            .printable-page table {
              width: 100%;
              border-collapse: collapse;
            }

            .printable-page th, .printable-page td {
              border: 1px solid black;
              padding: 8px;
              text-align: left;
            }

            .printable-page th {
              background-color: #f2f2f2;
            }
          }
        `}
      </style>
    </div>
  )
}

export default PrintablePage

