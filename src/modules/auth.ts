import { Elysia, t } from "elysia";
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
			.delete(
				"/:id",
				async ({ params: { id }, cookie: { access_token } }) => {
					const { error } = await supabase.auth.admin.deleteUser(id);
					if (error) return error;
					return `deleted ${id}`;
				}
			)
			.get("", async () => {
				const { data, error } = await supabase.auth.admin.listUsers();
				if (error) return error;
				return data.users;
			})
			.post(
				"/sign-up",
				async ({ body, cookie: { access_token, refresh_token } }) => {
					const { data, error } = await supabase.auth.signUp(body);
					if (error) return error;
					const { error: userCreationError } = await supabase
						.from("users")
						.insert({
							email: body.email,
							username: body.userName,
						});

					if (userCreationError) return userCreationError;

					const { data: user, error: userError } = await supabase
						.from("users")
						.select()
						.eq("email", data.user?.email ?? "");

					if (userError) return userError;

					if (!data.session)
						return { message: "something went wrong", status: 500 };

					access_token.value = data.session.access_token;
					refresh_token.value = data.session.refresh_token;

					return user;
				},
				{
					body: t.Object({
						email: t.String({
							format: "email",
						}),
						password: t.String({
							minLength: 8,
						}),
						userName: t.String(),
					}),
				}
			)
			.post(
				"/sign-in",
				async ({ body, cookie: { access_token, refresh_token } }) => {
					const { data, error } =
						await supabase.auth.signInWithPassword(body);

					if (error) return error;

					const { data: user, error: userError } = await supabase
						.from("users")
						.select()
						.eq("email", data.user?.email ?? "");

					if (userError) return userError;

					access_token.value = data.session.access_token;
					refresh_token.value = data.session.refresh_token;

					return user;
				},
				{
					body: "sign",
				}
			)
			.get(
				"/refresh",
				async ({ cookie: { access_token, refresh_token } }) => {
					const { data, error } = await supabase.auth.refreshSession({
						refresh_token: refresh_token.value ?? "",
					});

					if (error) return error;
					access_token.value = data.session?.access_token;
					refresh_token.value = data.session!.refresh_token;

					return data.user;
				}
			)
	);
