import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let supabaseClient: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
	if (!supabaseClient) {
		const supabaseUrl =
			process.env.NEXT_PUBLIC_SUPABASE_URL || "";
		const supabaseKey =
			process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

		if (!supabaseUrl || !supabaseKey) {
			console.warn(
				"Supabase credentials not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env",
			);
		}

		// 빌드 시 빈 값이 넘어올 수 있으므로 placeholder 사용
		supabaseClient = createClient(
			supabaseUrl || "https://placeholder.supabase.co",
			supabaseKey || "placeholder-key",
		);
	}

	return supabaseClient;
}
