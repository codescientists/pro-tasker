"use client"

import { zodResolver } from "@hookform/resolvers/zod" 
import { useForm } from "react-hook-form"
import * as z from "zod"

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
import { createProject } from "@/lib/actions/project.action"

const addProjectFormSchema = z.object({
  title: z
    .string()
    .min(2, {
      message: "Title must be at least 2 characters.",
    })
    .max(30, {
      message: "Title must not be longer than 30 characters.",
    }),
  description: z.string().optional(),
})

type AccountFormValues = z.infer<typeof addProjectFormSchema>

const defaultValues: Partial<AccountFormValues> = {

}

const AddProjectForm = ({user}) => {

    const { toast } = useToast();

    const form = useForm<AccountFormValues>({
        resolver: zodResolver(addProjectFormSchema),
        defaultValues,
    })

    async function onSubmit(data: AccountFormValues) {
        await createProject({
            userId: user._id,  
            title: data.title,
            description: data.description || '',
        })

        toast({
            title: "Success",
            description: "Task added successfully",
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

            <div className="flex ml-auto w-full justify-end">
                <DialogClose>
                    <Button type="button" variant="secondary" className="w-full">Close</Button>
                </DialogClose>
                <Button type="submit" className="ml-2">Create Project</Button>
            </div>
           
        </form>
        </Form>
  )
}


export default AddProjectForm