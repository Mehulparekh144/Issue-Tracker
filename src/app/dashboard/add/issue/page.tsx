"use client";
import { trpc } from "@/app/_trpc/client";
import ScreenshotUpload from "@/components/dashboard/ScreenshotUpload";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  NewIssueValidationSchema,
  newIssueValidationSchema,
} from "@/lib/schemas/addIssueValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
interface FileProps {
  name: string;
  id: string;
  key: string;
  url: string;
}
function AddIssue() {
  const form = useForm<NewIssueValidationSchema>({
    resolver: zodResolver(newIssueValidationSchema),
  });
  const [selectedFiles, setSelectedFiles] = useState<Array<FileProps>>([]);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const router = useRouter();
  const { data: teams, error, isLoading } = trpc.getTeams.useQuery();
  if (error) {
    toast.error("Error loading teams");
  }

  const { mutate: createNewIssueMutate } = trpc.createNewIssue.useMutation({
    onSuccess(data) {
      router.push("/dashboard");
    },
    onMutate() {
      setIsCreating(true);
    },
    onSettled() {
      setIsCreating(false);
    },
  });

  const createNewIssueHandler: SubmitHandler<NewIssueValidationSchema> = (
    data
  ) => {
    createNewIssueMutate({
      issueName: data.issueName,
      issueDescription: data.issueDescription,
      deadlineDate: data.deadlineDate.toDateString(),
      priority: data.priority,
      selectedFiles: selectedFiles,
      team: data.team,
    });
  };
  return (
    <div className="mt-4 mb-2 mx-auto">
      <Separator className="mb-2" />
      <h1 className="text-lg font-medium ">New Issue</h1>
      <Form {...form}>
        <form
          className="mt-4 flex flex-col flex-wrap gap-2"
          onSubmit={form.handleSubmit(createNewIssueHandler)}
        >
          <FormField
            name="issueName"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="issueName">Issue Name</FormLabel>
                <FormControl>
                  <Input
                    className="mt-2"
                    id="issueName"
                    placeholder="Enter issue name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="issueDescription"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="issueDescription">
                  Issue Description
                </FormLabel>
                <FormControl>
                  <Textarea {...field} className="mt-2" id="issueDescription" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <Label htmlFor="screenshots">Screenshots</Label>
            <ScreenshotUpload
              selectedFiles={selectedFiles}
              setSelectedFiles={setSelectedFiles}
            />
          </div>

          <div className="flex flex-col md:flex-row justify-between gap-2 w-full">
            <FormField
              name="deadlineDate"
              control={form.control}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel htmlFor="deadlineDate">Deadline Date</FormLabel>
                  <Popover>
                    <PopoverTrigger className="flex justify-start" asChild>
                      <FormControl>
                        <Button
                          id="deadlineDate"
                          variant={"outline"}
                          className="w-full mt-2"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="priority"
              control={form.control}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel htmlFor="priority">Priority</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger id="priority" className="mt-2">
                        <SelectValue placeholder="Assign Priority" />
                      </SelectTrigger>
                    </FormControl>
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
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            name="team"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="team">Team</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger disabled={isLoading} className="mt-2">
                      {isLoading && (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                        </>
                      )}
                      <SelectValue id="team" placeholder="Assign Team" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {teams?.map((item) => (
                      <SelectItem value={item.id} key={item.id}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-max flex gap-2 items-center mt-2 font-semibold"
          >
            {isCreating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Creating
              </>
            ) : (
              "Create"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default AddIssue;
