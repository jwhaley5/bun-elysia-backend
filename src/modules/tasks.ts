import { Elysia, t } from "elysia";

import { supabase } from "../libs/supabase";
import { cookie } from "@elysiajs/cookie";

export const tasks = (app: Elysia) =>
	app.group("/tasks", (app) =>
		app
			.get("/", async () => {
				const { data, error } = await supabase.from("tasks").select();
				if (error) return error;
				return data;
			})
			.put(
				"/create",
				async ({ body, cookie: { access_token } }) => {
					const { data: user, error: userError } =
						await supabase.auth.getUser(access_token.value);

					if (userError) return userError;

					const { data, error } = await supabase
						.from("tasks")
						.insert({
							userId: user.user.id,
							...body,
						})
						.select("id");
				},
				{
					body: t.Object({
						title: t.String({ maxLength: 255 }),
						description: t.String(),
					}),
				}
			)
	);
