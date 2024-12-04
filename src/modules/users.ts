import { Elysia, t } from "elysia";
import { supabase } from "../libs/supabase";

// Users CRUD
export const users = (app: Elysia) =>
	app.group("/users", (app) =>
		app
			.get("", async () => {
				const { data, error } = await supabase
					.from("users")
					.select("id, username, profile_image_url");
				if (error) return error;
				return data;
			})
			// Get user profile by id
			.get("/:id", async ({ params }) => {
				const { data, error } = await supabase
					.from("users")
					.select("username, profile_image_url")
					.eq("id", params.id)
					.single();
				if (error) return error;
				return data;
			})
			.post(
				"",
				async ({ body }) => {
					const {} = await supabase.from("users").insert({
						...body,
					});
				},
				{
					body: t.Object({
						email: t.Optional(t.String()),
						profile_image_url: t.Optional(t.String()),
						provider: t.Optional(t.String()),
						provider_id: t.Optional(t.String()),
						username: t.String(),
					}),
				}
			)
			// Update user's profile image
			.put(
				"/:id/update-profile-image",
				async ({ params, body, cookie: { access_token } }) => {
					const { data: user, error: userError } =
						await supabase.auth.getUser(access_token.value);

					if (userError) return userError;
					if (user.user.id !== params.id)
						return {
							error: "Not authorized to update this profile",
						};

					const { data, error } = await supabase
						.from("users")
						.update({ profile_image_url: body.profile_image_url })
						.eq("id", params.id)
						.select("*");
					if (error) return error;
					return data;
				},
				{
					body: t.Object({
						profile_image_url: t.String(),
					}),
				}
			)
	);
