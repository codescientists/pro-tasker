"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useToast } from "../ui/use-toast"
import { Select, SelectContent,  SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Textarea } from "../ui/textarea"
import { DialogClose } from "@radix-ui/react-dialog"
import { editTask } from "@/lib/actions/task.action"
import { usePathname } from "next/navigation"
import { revalidatePath } from "next/cache"

const addTaskFormSchema = z.object({
  taskName: z
    .string()
    .min(2, {
      message: "Task Name must be at least 2 characters.",
    })
    .max(30, {
      message: "Task Name must not be longer than 30 characters.",
    }),
  description: z.string(),
  status: z.string().optional(),
  priority: z.string().optional(),
  dueDate: z.date().optional(),
})

type AccountFormValues = z.infer<typeof addTaskFormSchema>


const EditTaskForm = ({task}) => {
 
    const { toast } = useToast();
    const pathname = usePathname();
    
    const defaultValues: Partial<AccountFormValues> = {
      taskName: task?.taskName,
      description: task?.description,
      dueDate: task?.dueDate,
      status: task?.status,
      priority: task?.priority,
    }

    const form = useForm<AccountFormValues>({
        resolver: zodResolver(addTaskFormSchema),
        defaultValues,
    })

    async function onSubmit(data: AccountFormValues) {
        await editTask({
            taskId: task._id, 
            taskName: data.taskName,
            description: data.description,
            status: data?.status || 'to-do',
            priority: data?.priority || 'low',
            dueDate: data?.dueDate || '',
            path: pathname
        })
        
        toast({
            title: "Success",
            description: "Task updated successfully",
        })  
    }

    return (
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
            control={form.control}
            name="taskName"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Task Name</FormLabel>
                <FormControl>
                    <Input placeholder="Task name" {...field} />
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
                <FormLabel>Description</FormLabel>
                <FormControl>
                    <Textarea placeholder="Description" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
                <FormItem className="flex flex-col">
                <FormLabel>Due Date</FormLabel>
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
                            <span>Pick Task's Due Date</span>
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
                <FormMessage />
                </FormItem>
            )}
            />
            <div className="flex space-x-4 justify-between">
                <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue defaultValue="to-do" placeholder="To do"/>
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            <SelectItem value="to-do">To do</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormDescription>
                            Enter your task's status{" "}
                        </FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Low" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormDescription>
                        Enter your task's priority{" "}
                    </FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>

            <div className="flex ml-auto w-full justify-end">
                <DialogClose>
                    <Button type="button" variant="secondary" className="w-full">Close</Button>
                </DialogClose>
                <Button type="submit" className="ml-2">Update</Button>
            </div>
           
        </form>
        </Form>
  )
}


export default EditTaskForm