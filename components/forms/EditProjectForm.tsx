"use client"

import { zodResolver } from "@hookform/resolvers/zod" 
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"


import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "../ui/use-toast"
import { Textarea } from "../ui/textarea"
import { DialogClose } from "@radix-ui/react-dialog"
import { createProject, updateProject } from "@/lib/actions/project.action"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { cn } from "@/lib/utils"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "../ui/calendar"

const editProjectFormSchema = z.object({
  title: z
    .string()
    .min(2, {
      message: "Title must be at least 2 characters.",
    })
    .max(30, {
      message: "Title must not be longer than 30 characters.",
    }),
  description: z.string().optional(),
  startDate: z.date(),
  dueDate: z.date(),
})

type AccountFormValues = z.infer<typeof editProjectFormSchema>


const EditProjectForm = ({project}) => {
  
    const { toast } = useToast();

    const defaultValues: Partial<AccountFormValues> = {
      title: project?.title,
      description: project?.description,
      startDate: project?.startDate,
      dueDate: project?.dueDate,
    }

    const form = useForm<AccountFormValues>({
        resolver: zodResolver(editProjectFormSchema),
        defaultValues,
    })

    async function onSubmit(data: AccountFormValues) {
        await updateProject({
            projectId: project._id,  
            title: data.title,
            description: data.description || '',
            startDate: data.startDate,
            dueDate: data.dueDate,
        })

        toast({
            title: "Project Edited",
        })  
    }

    return (
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
              <FormItem>
              <FormLabel>Project Title</FormLabel>
              <FormControl>
                  <Input placeholder="Enter Project Title" {...field} />
              </FormControl>
              <FormMessage />
              </FormItem>
          )}
          />
          <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
              <FormItem>
              <FormLabel>Project Description</FormLabel>
              <FormControl>
                  <Textarea placeholder="Enter Project's Description" {...field} />
              </FormControl>
              <FormMessage />
              </FormItem>
          )}
          />
          <div className="flex">
          <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
              <FormItem>
              <FormLabel>Start Date</FormLabel>
              <FormControl>
              <Popover>
                  <PopoverTrigger asChild>
                  <FormControl>
                      <Button
                      variant={"outline"}
                      className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                      )}
                      >
                      {field.value ? (
                          format(field.value, "PPP")
                      ) : (
                          <span>Pick Project's Start Date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                  </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                      />
                  </PopoverContent>
              </Popover>
              </FormControl>
              <FormMessage />
              </FormItem>
          )}
          />
          <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
              <FormItem>
              <FormLabel>Due Date</FormLabel>
              <FormControl>
              <Popover>
                  <PopoverTrigger asChild>
                  <FormControl>
                      <Button
                      variant={"outline"}
                      className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                      )}
                      >
                      {field.value ? (
                          format(field.value, "PPP")
                      ) : (
                          <span>Pick Project's Due Date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                  </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                  />
                  </PopoverContent>
              </Popover>
              </FormControl>
              <FormMessage />
              </FormItem>
          )}
          />
          </div>

          <div className="flex ml-auto w-full justify-end">
              <DialogClose className="flex justify-end">
                  <Button type="button" variant="secondary" className="">Close</Button>
              <Button type="submit" className="ml-2">Update Project</Button>
              </DialogClose>
          </div>
      
      </form>
  </Form>
  )
}


export default EditProjectForm