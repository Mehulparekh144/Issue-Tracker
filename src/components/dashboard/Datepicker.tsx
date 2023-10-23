"use client";
import React, { useState } from "react";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { cn } from "@/lib/utils";

interface DateProps {
  date: Date;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
  id: string;
}

function Datepicker({ date, setDate, id }: DateProps) {
  return (
    <Popover>
      <PopoverTrigger className="flex justify-start" asChild>
        <Button id={id} variant={"outline"} className="mt-2">
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

export default Datepicker;
