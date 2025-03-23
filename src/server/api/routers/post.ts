import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ 
      name: z.string().min(1, "Post content cannot be empty").max(1000, "Post is too long (max 1000 characters)") 
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        // simulate a slow db call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        return await ctx.db.post.create({
          data: {
            name: input.name,
          },
        });
      } catch (error) {
        console.error("Error creating post:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create post. Please try again.",
          cause: error,
        });
      }
    }),

  getPosts: publicProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.db.post.findMany({
        orderBy: { createdAt: "desc" },
      });
    } catch (error) {
      console.error("Error fetching posts:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch posts. Please refresh the page.",
        cause: error,
      });
    }
  }),

  addReply: publicProcedure
    .input(
      z.object({
        postId: z.number(),
        reply: z.string().min(1, "Reply cannot be empty").max(500, "Reply is too long (max 500 characters)"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { postId, reply } = input;
        
        // Check if post exists
        const existingPost = await ctx.db.post.findUnique({
          where: { id: postId },
        });
        
        if (!existingPost) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Post not found",
          });
        }
        
        return await ctx.db.post.update({
          where: { id: postId },
          data: {
            replies: {
              push: reply,
            },
          },
        });
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        
        console.error("Error adding reply:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to add reply. Please try again.",
          cause: error,
        });
      }
    }),
});
