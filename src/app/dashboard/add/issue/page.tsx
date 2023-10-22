"use client"
import { trpc } from "@/app/_trpc/client";
import Datepicker from "@/components/dashboard/Datepicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

function AddIssue() {
  const [deadlineDate, setDeadlineDate] = useState<Date>(new Date())
  const {data: teams , error , isLoading} = trpc.getTeams.useQuery();
  console.log(teams);
  if(error){
    toast.error("Error loading teams");
  }
  return (
    <div className="mt-4 mb-2 mx-auto">
      <Separator className="mb-2" />
      <h1 className="text-lg font-medium ">New Issue</h1>
      <form className="mt-4 flex flex-col flex-wrap gap-2">
        <div>
          <Label htmlFor="issueName">Issue Name</Label>
          <Input
            className="mt-2"
            id="issueName"
            placeholder="Enter issue name"
          />
        </div>
        <div>
          <Label htmlFor="issueDescription">Description</Label>
          <Textarea className="mt-2" id="issueDescription" />
        </div>
        <div>
          <Label htmlFor="screenshots">Screenshots</Label>
          <Input className="mt-2" id="screenshots" placeholder="Enter image url" />
        </div>
        <div className="flex flex-col md:flex-row justify-between gap-2 w-full">
          {/* Deadline Date */}
          <div className="w-full flex flex-col gap-1">
            <Label className="mt-1.5" htmlFor="deadlineDate">
              Deadline Date
            </Label>
            <Datepicker
              id="deadlineDate"
              date={deadlineDate}
              setDate={setDeadlineDate}
            />
          </div>
          {/* Priority */}
          <div className="w-full">
            <Label htmlFor="priority">Priority</Label>
            <Select>
              <SelectTrigger id="priority" className="mt-2">
                <SelectValue placeholder="Assign Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem className="text-red-500" value="URGENT">
                  Urgent
                </SelectItem>
                <SelectItem className="text-yellow-500" value="HIGH">
                  High
                </SelectItem>
                <SelectItem className="text-blue-500" value="MEDIUM">
                  Medium
                </SelectItem>
                <SelectItem className="text-primary" value="LOW">
                  Low
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          {/* Team Select */}
          <Label htmlFor="team">Team</Label>
          <Select>
            <SelectTrigger disabled={isLoading} className="mt-2">
              {isLoading && (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                </>
              )}
              <SelectValue id="team" placeholder="Assign Team" />
            </SelectTrigger>
            <SelectContent>
              {teams?.map((item) => (
                <SelectItem value={item.id} key={item.id}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" className="w-max mt-2 font-semibold">
          Create
        </Button>
      </form>
    </div>
  );
}

export default AddIssue;
