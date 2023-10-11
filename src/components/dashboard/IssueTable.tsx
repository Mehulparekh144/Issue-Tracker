import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "../ui/badge";

interface IssueData {
  issueNo: number;
  issueTitle: string;
  teamAssigned: string;
  assigner: string;
  assignedDate: string;
  deadlineDate: string;
  priority: string;
}

function IssueTable() {
  const priorityObject : {[key:string] : string} = {
    urgent: "bg-red-500",
    high: "bg-yellow-500",
    medium: "bg-blue-500",
    low: "bg-primary",
  };

  const dummyData = [
    {
      issueNo: 1,
      issueTitle: "Critical Bug Fix",
      teamAssigned: "Development",
      assigner: "John Doe",
      assignedDate: "2023-10-11",
      deadlineDate: "2023-10-15",
      priority: "urgent",
    },
    {
      issueNo: 2,
      issueTitle: "Feature Enhancement",
      teamAssigned: "Product Management",
      assigner: "Jane Smith",
      assignedDate: "2023-10-10",
      deadlineDate: "2023-10-20",
      priority: "high",
    },
    {
      issueNo: 3,
      issueTitle: "Documentation Update",
      teamAssigned: "Documentation Team",
      assigner: "David Johnson",
      assignedDate: "2023-10-12",
      deadlineDate: "2023-10-18",
      priority: "low",
    },
    {
      issueNo: 4,
      issueTitle: "UI Design Review",
      teamAssigned: "Design Team",
      assigner: "Emily Brown",
      assignedDate: "2023-10-13",
      deadlineDate: "2023-10-17",
      priority: "medium",
    },
    {
      issueNo: 5,
      issueTitle: "Database Optimization",
      teamAssigned: "Database Team",
      assigner: "Michael Wilson",
      assignedDate: "2023-10-14",
      deadlineDate: "2023-10-22",
      priority: "high",
    },
  ];

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px] ">Issue No.</TableHead>
          <TableHead>Issue Title</TableHead>
          <TableHead>Team Assigned</TableHead>
          <TableHead>Assigner</TableHead>
          <TableHead>Assigned Date</TableHead>
          <TableHead>Deadline Date</TableHead>
          <TableHead className="text-right">Priority</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {dummyData.map((item: IssueData) => (
          <TableRow key={item.issueNo}>
            <TableCell>{item.issueNo}</TableCell>
            <TableCell>{item.issueTitle}</TableCell>
            <TableCell>{item.teamAssigned}</TableCell>
            <TableCell>{item.assigner}</TableCell>
            <TableCell>{item.assignedDate}</TableCell>
            <TableCell>{item.deadlineDate}</TableCell>
            <TableCell className="text-right">
              <Badge
                className={`${priorityObject[item.priority]} hover:bg-${
                  priorityObject[item.priority]
                }`}
              >
                {item.priority}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default IssueTable;
