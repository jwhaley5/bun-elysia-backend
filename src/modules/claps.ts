import { Elysia, t } from "elysia";
import { supabase } from "../libs/supabase";

// Claps CRUD
export const claps = (app: Elysia) =>
	app.group("/claps", (app) =>
		app
			// Get clap count for an idea
			.get("/:ideaId", async ({ params }) => {
				const { data, error } = await supabase
					.from("claps")
					.select("clap_count")
					.eq("idea_id", params.ideaId);

				if (error) return error;
				const totalClaps = data.reduce(
					(acc, clap) => acc + (clap?.clap_count ?? 0),
					0
				);

				return { idea_id: params.ideaId, total_claps: totalClaps };
			})
			// Add a clap to an idea
			.post(
				"/:ideaId/add",
				async ({ params, cookie: { access_token } }) => {
					const { data: user, error: userError } =
						await supabase.auth.getUser(access_token.value);

					if (userError) return userError;

					const { data, error } = await supabase
						.from("claps")
						.insert({
							idea_id: params.ideaId,
							user_id: user ? user.user.id : null,
							clap_count: 1,
						})
						.select("*");
					if (error) return error;
					return data;
				}
			)
	);
