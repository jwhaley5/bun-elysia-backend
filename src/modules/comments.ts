import { Elysia, t } from "elysia";
import { supabase } from "../libs/supabase";

// Comments CRUD
export const comments = (app: Elysia) =>
	app.group("/comments", (app) =>
		app
			// Get all comments for an idea
			.get("/:ideaId", async ({ params }) => {
				const { data, error } = await supabase
					.from("comments")
					.select("*")
					.eq("idea_id", params.ideaId);
				if (error) return error;
				return data;
			})
			// Create a comment for an idea
			.post(
				"/:ideaId/create",
				async ({ params, body, cookie: { access_token } }) => {
					const { data: user, error: userError } =
						await supabase.auth.getUser(access_token.value);

					if (userError) return userError;

					const { data, error } = await supabase
						.from("comments")
						.insert({
							user_id: user.user.id,
							idea_id: params.ideaId,
							content: body.content,
							parent_comment_id: body.parent_comment_id || null,
						})
						.select("*");
					if (error) return error;
					return data;
				},
				{
					body: t.Object({
						content: t.String(),
						parent_comment_id: t.Optional(t.String()),
					}),
				}
			)
			// Delete a comment by id (only by the creator)
			.delete("/:id", async ({ params, cookie: { access_token } }) => {
				const { data: user, error: userError } =
					await supabase.auth.getUser(access_token.value);

				if (userError) return userError;

				const { data: comment, error: commentError } = await supabase
					.from("comments")
					.select("user_id")
					.eq("id", params.id)
					.single();

				if (commentError) return commentError;
				if (comment.user_id !== user.user.id)
					return { error: "Not authorized to delete this comment" };

				const { data, error } = await supabase
					.from("comments")
					.delete()
					.eq("id", params.id)
					.select("*");
				if (error) return error;
				return data;
			})
	);
