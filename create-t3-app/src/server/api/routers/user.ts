import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

/**
 * User router for handling user creation and management.
 * Designed to be idempotent for scalability and reliability.
 */
export const userRouter = createTRPCRouter({
  /**
   * Create or update a user from Cognito signup.
   * Idempotent: safe to call multiple times with same cognitoUserId.
   * This endpoint is called:
   * 1. By Cognito Lambda trigger (primary, most scalable)
   * 2. By client-side callback (backup/fallback)
   */
  createFromCognito: publicProcedure
    .input(
      z.object({
        cognitoUserId: z.string().min(1),
        email: z.string().email(),
        name: z.string().optional(),
        emailVerified: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if user already exists by cognitoUserId (idempotent)
      const existingUser = await ctx.db.user.findUnique({
        where: { cognitoUserId: input.cognitoUserId },
      });

      if (existingUser) {
        // User already exists, return existing user (idempotent behavior)
        return {
          success: true,
          user: existingUser,
          created: false,
        };
      }

      // Check if email already exists (edge case: different cognito user, same email)
      const existingEmailUser = await ctx.db.user.findUnique({
        where: { email: input.email },
      });

      if (existingEmailUser) {
        // Email exists but different cognitoUserId - update it
        const updatedUser = await ctx.db.user.update({
          where: { email: input.email },
          data: {
            cognitoUserId: input.cognitoUserId,
            emailVerified: input.emailVerified
              ? new Date()
              : existingEmailUser.emailVerified,
          },
        });

        return {
          success: true,
          user: updatedUser,
          created: false,
        };
      }

      // Create new user
      try {
        const newUser = await ctx.db.user.create({
          data: {
            cognitoUserId: input.cognitoUserId,
            email: input.email,
            name: input.name,
            emailVerified: input.emailVerified ? new Date() : null,
          },
        });

        return {
          success: true,
          user: newUser,
          created: true,
        };
      } catch (error) {
        // Handle race condition: another request created user between checks
        const user = await ctx.db.user.findUnique({
          where: { cognitoUserId: input.cognitoUserId },
        });

        if (user) {
          return {
            success: true,
            user,
            created: false,
          };
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create user",
        });
      }
    }),

  /**
   * Get user by Cognito ID (for verification/lookup)
   */
  getByCognitoId: publicProcedure
    .input(z.object({ cognitoUserId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.user.findUnique({
        where: { cognitoUserId: input.cognitoUserId },
      });
    }),
});

