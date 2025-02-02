import React from 'react';
import { Card, CardContent, Typography, Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Paper } from '@mui/material';
import { ReactNode } from '@tanstack/react-router';

const PrintablePage = ({ selectedUser, userInfo, scheduleData }) => {
  return (
    <div className="printable-page">
      {/* User Information Section */}
      <Card sx={{ marginBottom: 2, boxShadow: 'none' }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 2 }}>User Information</Typography>
          <p><strong>ID:</strong> {userInfo?.user_id || "Unknown"}</p>
          <p><strong>Full Name:</strong> {userInfo?.full_name || "Unknown"}</p>
          <p><strong>Email:</strong> {userInfo?.user_email || "Unknown"}</p>
          <p><strong>Mobile Number:</strong> {userInfo?.mobile_number || "Unknown"}</p>
          <p><strong>Department:</strong> {userInfo?.user_department || "Unknown"}</p>
        </CardContent>
      </Card>

      {/* Schedule Information Section */}
      <Card sx={{ boxShadow: 'none' }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 2 }}>Schedule Information</Typography>
          <TableContainer component={Paper} sx={{ marginTop: "10px" }}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Room Name</TableCell>
                  <TableCell>Subject Code</TableCell>
                  <TableCell>Section</TableCell>
                  <TableCell>Weekday</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {scheduleData
                  .filter((event: { user_name: any; }) => event.user_name === selectedUser)
                  .map((event: {
                    course_name: ReactNode;
                    days: ReactNode; room_name: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; subject_code: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; section: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; weekday: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; time_in: any; time_out: any; status: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; 
}, index: React.Key | null | undefined) => (
                    <TableRow key={index}>
                      <TableCell>{event.room_name}</TableCell>
                      <TableCell>{event.subject_code}</TableCell>
                      <TableCell>{event.course_name}</TableCell>
                      <TableCell>{event.days}</TableCell>
                      <TableCell>{`${event.time_in} - ${event.time_out}`}</TableCell>
                      <TableCell>{event.status}</TableCell>
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
              display: fixed;
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
  );
};

export default PrintablePage;
