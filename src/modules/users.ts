import { Elysia, t } from "elysia";
import { supabase } from "../libs/supabase";

// Users CRUD
export const users = (app: Elysia) =>
	app.group("/users", (app) =>
		app
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
