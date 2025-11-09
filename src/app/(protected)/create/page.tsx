"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "~/components/ui/input-group";
import { Button } from "~/components/ui/button";
import Image from "next/image";
import { api } from "~/trpc/react";
import UseRefetch from "~/hooks/use-refetch";

const formSchema = z.object({
  projectName: z
    .string()
    .min(3, "project name must be at least 3 characters.")
    .max(16, "project name must be at most 16 characters."),
  repoUrl: z.string(),
  githubToken: z.optional(z.string()),
});

export default function CreatePage() {
  const createProject = api.project.createProject.useMutation();
  const refetch = UseRefetch();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectName: "",
      repoUrl: "",
      githubToken: "",
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    // this is for testing later ill call actions...
    // toast("You submitted the following values:", {
    //   description: (
    //     <pre className="bg-code text-code-foreground mt-2 w-[320px] overflow-x-auto rounded-md p-4">
    //       <code>{JSON.stringify(data, null, 2)}</code>
    //     </pre>
    //   ),
    //   position: "bottom-right",
    //   classNames: {
    //     content: "flex flex-col gap-2",
    //   },
    //   style: {
    //     "--border-radius": "calc(var(--radius)  + 4px)",
    //   } as React.CSSProperties,
    // });

    createProject.mutate(data, {
      onSuccess: () => {
        toast.success("Project created Successfully");
        refetch();
      },
      onError: () => {
        toast.error("Failed to create project");
      },
    });
  }

  return (
    <div className="flex h-screen items-center justify-center gap-2">
      <Image src={"/work.svg"} height={460} width={460} alt="Create Project" />
      <Card className="w-full sm:max-w-md">
        <CardHeader>
          <CardTitle>Link your Github Repository</CardTitle>
          <CardDescription>
            Enter the URL of your GitHub repository to link it to LazyStash
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="projectName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    {/* <FieldLabel htmlFor="form-rhf-demo-title">
                    Bug Title
                  </FieldLabel> */}
                    <Input
                      {...field}
                      id="project-name"
                      aria-invalid={fieldState.invalid}
                      placeholder="Project Name"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="repoUrl"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    {/* <FieldLabel htmlFor="form-rhf-demo-title">
                    Bug Title
                  </FieldLabel> */}
                    <Input
                      {...field}
                      id="repo-url"
                      aria-invalid={fieldState.invalid}
                      placeholder="Github Repository URL"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="githubToken"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    {/* <FieldLabel htmlFor="form-rhf-demo-title">
                    Bug Title
                  </FieldLabel> */}
                    <Input
                      {...field}
                      id="github-token"
                      aria-invalid={fieldState.invalid}
                      placeholder="GitHub Token (optional for private repositories)"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter>
          <Field orientation="horizontal">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
              disabled={createProject.isPending}
            >
              Reset
            </Button>
            <Button
              type="submit"
              form="form-rhf-demo"
              disabled={createProject.isPending}
            >
              Submit
            </Button>
          </Field>
        </CardFooter>
      </Card>
    </div>
  );
}
