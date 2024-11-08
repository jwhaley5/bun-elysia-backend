import { Elysia, t } from "elysia";
import { supabase } from "../libs/supabase";

// Ideas CRUD
export const ideas = (app: Elysia) =>
	app.group("/ideas", (app) =>
		app
			// Get all ideas
			.get("", async () => {
				const { data, error } = await supabase
					.from("ideas")
					.select("*");
				if (error) return error;
				return data;
			})
			// Get a specific idea by id
			.get("/:id", async ({ params }) => {
				const { data, error } = await supabase
					.from("ideas")
					.select("*")
					.eq("id", params.id)
					.single();
				if (error) return error;
				return data;
			})
			// Create a new idea (authenticated)
			.post(
				"/create",
				async ({ body, cookie: { access_token } }) => {
					const { data: user, error: userError } =
						await supabase.auth.getUser(access_token.value);

					if (userError) return userError;

					const { error } = await supabase.from("ideas").insert({
						user_id: user.user.id,
						...body,
					});
					if (error) return error;
					return "success";
				},
				{
					body: t.Object({
						title: t.String({ maxLength: 255 }),
						content: t.String(),
						subtitle: t.Optional(t.String({ maxLength: 255 })),
					}),
				}
			)
			// Update an idea by id (only if the user is the creator)
			.put(
				"/:id",
				async ({ params, body, cookie: { access_token } }) => {
					const { data: user, error: userError } =
						await supabase.auth.getUser(access_token.value);

					if (userError) return userError;

					const { data: idea, error: ideaError } = await supabase
						.from("ideas")
						.select("user_id")
						.eq("id", params.id)
						.single();

					if (ideaError) return ideaError;
					if (idea.user_id !== user.user.id)
						return { error: "Not authorized to update this idea" };

					const { data, error } = await supabase
						.from("ideas")
						.update(body)
						.eq("id", params.id)
						.select("*");
					if (error) return error;
					return data;
				},
				{
					body: t.Object({
						title: t.Optional(t.String({ maxLength: 255 })),
						content: t.Optional(t.String()),
						subtitle: t.Optional(t.String({ maxLength: 255 })),
					}),
				}
			)
			// Delete an idea by id (only if the user is the creator)
			.delete("/:id", async ({ params, cookie: { access_token } }) => {
				const { data: user, error: userError } =
					await supabase.auth.getUser(access_token.value);

				if (userError) return userError;

				const { data: idea, error: ideaError } = await supabase
					.from("ideas")
					.select("user_id")
					.eq("id", params.id)
					.single();

				if (ideaError) return ideaError;
				if (idea.user_id !== user.user.id)
					return { error: "Not authorized to delete this idea" };

				const { data, error } = await supabase
					.from("ideas")
					.delete()
					.eq("id", params.id)
					.select("*");
				if (error) return error;
				return data;
			})
	);
