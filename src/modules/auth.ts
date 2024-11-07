import { Elysia, t, Cookie } from "elysia";
import { supabase } from "../libs/supabase";
import { cookie } from "@elysiajs/cookie";

export const auth = (app: Elysia) =>
	app.group("/auth", (app) =>
		app
			.use(
				cookie({
					httpOnly: true,
				})
			)
			.model({
				sign: t.Object({
					email: t.String({
						format: "email",
					}),
					password: t.String({
						minLength: 8,
					}),
				}),
			})
			.delete("/:id", async ({ params: { id } }) => {
				const { error } = await supabase.auth.admin.deleteUser(id);
				if (error) return error;
				return `deleted ${id}`;
			})
			.get("/", async () => {
				const { data, error } = await supabase.auth.admin.listUsers();
				if (error) return error;
				return data.users;
			})
			.post(
				"/sign-up",
				async ({ body, cookie: { access_token, refresh_token } }) => {
					const { data, error } = await supabase.auth.signUp(body);
					if (error) return error;

					console.log(data);
					if (!data.session)
						return { message: "something went wrong", status: 500 };

					access_token.value = data.session.access_token;
					refresh_token.value = data.session.refresh_token;

					return data.user;
				},
				{ body: "sign" }
			)
			.post(
				"/sign-in",
				async ({ body, cookie: { access_token, refresh_token } }) => {
					const { data, error } =
						await supabase.auth.signInWithPassword(body);

					if (error) return error;

					access_token.value = data.session.access_token;
					refresh_token.value = data.session.refresh_token;
					return data.user;
				},
				{
					body: "sign",
				}
			)
			.get("/refresh", async ({ cookie: { refresh_token } }) => {
				const { data, error } = await supabase.auth.refreshSession({
					refresh_token: refresh_token.value ?? "",
				});

				if (error) return error;

				refresh_token.value = data.session!.refresh_token;

				return data.user;
			})
	);
