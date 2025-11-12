import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { pollCommits } from "~/lib/github";

const formSchema = z.object({
  projectName: z
    .string()
    .min(3, "project name must be at least 3 characters.")
    .max(16, "project name must be at most 16 characters."),
  repoUrl: z.string(),
  githubToken: z.optional(z.string()),
});

export const projectRouter = createTRPCRouter({
  createProject: protectedProcedure
    .input(formSchema)
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { clerkId: ctx.user.userId! },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `DB user not found for clerkId ${ctx.user.userId}`,
        });
      }

      const project = await ctx.db.project.create({
        data: {
          repoUrl: input.repoUrl,
          projectName: input.projectName,
          userProjects: {
            create: { userId: user.id },
          },
        },
      });
      await pollCommits(project.id);
      return project;
    }),
  getProjects: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { clerkId: ctx.user.userId! },
    });

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `DB user not found for clerkId ${ctx.user.userId}`,
      });
    }

    return await ctx.db.project.findMany({
      where: {
        userProjects: {
          some: {
            userId: user.id,
          },
        },
        deletedAt: null,
      },
    });
  }),

  getCommits: protectedProcedure.input(z.object({
    projectId: z.string()
  })).query(async ({ctx,input}) => {
    pollCommits(input.projectId).then().catch(console.error)
    return await ctx.db.commit.findMany({
      where: {projectId: input.projectId}
    })
  })

});
