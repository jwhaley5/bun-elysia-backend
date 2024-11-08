import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { auth } from "./modules/auth";
import { claps } from "./modules/claps";
import { comments } from "./modules/comments";
import { ideas } from "./modules/ideas";
import { users } from "./modules/users";

const { PORT } = process.env;

const app = new Elysia()
	.use(
		swagger({
			documentation: {
				info: {
					title: "Ideas API",
					description: "API for Ideas",
					version: "1.0.0",
				},
			},
		})
	)
	.use(auth)
	.use(ideas)
	.use(comments)
	.use(users)
	.use(claps)
	.listen(PORT || 4000);

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
