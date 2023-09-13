"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Person } from "@/app/people";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { ArrowUpDown } from "lucide-react";

export const columns: ColumnDef<Person>[] = [
  {
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === "asc");
          }}
        >
          Indigency ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    accessorKey: "indigency_id",
  },
  {
    header: "Resident ID",
    accessorKey: "resident_id",
  },
  {
    header: "Date Created",
    accessorKey: "date_created",
    cell: ({ row }) => {
      const date_created = row.getValue("date_created");
      const formatted = new Date(date_created as string).toLocaleDateString();
      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    header: "Valid Until",
    accessorKey: "valid_until",
    cell: ({ row }) => {
      const valid_until = row.getValue("valid_until");
      const formatted = new Date(valid_until as string).toLocaleDateString();
      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    header: "Last Name",
    accessorKey: "last_name",
  },
  {
    header: "First Name",
    accessorKey: "first_name",
  },
  {
    header: "Middle Name",
    accessorKey: "middle_name",
  },
  {
    header: "Reason",
    accessorKey: "reason",
  },
  {
    header: "Remarks",
    accessorKey: "remarks",
  },
  {
    header: "Issuing Officer",
    accessorKey: "issuing_officer",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const person = row.original;
      const personId = person.id;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-8 h-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => {
                navigator.clipboard.writeText(person.first_name.toString());
              }}
            >
              Copy person name
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
