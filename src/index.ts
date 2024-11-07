import { Elysia, t } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { jwt } from "@elysiajs/jwt";
import bcrypt from "bcrypt";
import { supabase } from "./libs/supabase";
import { auth } from "./modules/auth";
import { tasks } from "./modules/tasks";

console.log(process.env.SUPABASE_CONNECTION_STRING);

const app = new Elysia()
	.use(
		swagger({
			documentation: {
				info: {
					title: "Task Management API",
					description:
						"API for user authentication and task management",
					version: "1.0.0",
				},
			},
		})
	)
	.use(auth)
	.use(tasks)
	.listen(3000);

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
