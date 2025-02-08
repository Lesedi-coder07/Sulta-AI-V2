import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useForm } from "react-hook-form"

export default function Settings () {
    const form = useForm({
        defaultValues: {
            accountSettings: {
                name: "",
                email: "",
                language: "en"
            }
        }
    })

    return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account and application preferences
          </p>
        </div>

        <div className="rounded-lg border border-neutral-200 p-6 dark:border-neutral-800">
          <h3 className="text-lg font-semibold">Account Settings</h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Update your account information and preferences
          </p>
          <Form {...form}>
            <div className="mt-6 space-y-6">
              <FormField
                control={form.control}
                name="accountSettings.name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your name" {...field} />
                    </FormControl>
                    <FormDescription>
                      Your display name visible to other users
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="accountSettings.email" 
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormDescription>
                      Your email address for notifications and account recovery
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="accountSettings.language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Language</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Your preferred language for the application interface
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Form>
          <div className="mt-6 space-y-6">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Keep us up to date!
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-neutral-200 p-6 dark:border-neutral-800">
          <h3 className="text-lg font-semibold">Appearance</h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Customize how the application looks and feels
          </p>

          <div className="mt-6 space-y-6">
            {/* Appearance settings form fields will go here */}
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Appearance settings coming soon
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-neutral-200 p-6 dark:border-neutral-800">
          <h3 className="text-lg font-semibold">Notifications</h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Configure your notification preferences
          </p>

          <div className="mt-6 space-y-6">
            {/* Notification settings form fields will go here */}
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Notification settings coming soon
            </p>
          </div>
        </div>
      </div>
    </div>
    )
} 