"use client";

import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import type { User } from "@/types";
import { getSupabase } from "@/lib/supabase";

interface AuthContextValue {
	user: User | null;
	loading: boolean;
	error: Error | null;
	isAuthenticated: boolean;
	initialized: boolean;
	signIn: (
		email: string,
		password: string,
		captchaToken?: string,
	) => Promise<{ success: boolean; error?: Error }>;
	signUp: (
		email: string,
		password: string,
		captchaToken?: string,
	) => Promise<{
		success: boolean;
		error?: Error;
		needsEmailVerification?: boolean;
	}>;
	signOut: () => Promise<{ success: boolean; error?: Error }>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function getAuthErrorMessage(err: unknown): string {
	const code =
		(err as { code?: string }).code ||
		(err as { message?: string }).message ||
		"";
	if (
		code === "over_email_send_rate_limit" ||
		code.includes("email rate limit")
	) {
		return "이메일 전송 횟수를 초과했습니다. 잠시 후 다시 시도해주세요.";
	}
	if (code === "user_already_exists") {
		return "이미 가입된 이메일입니다.";
	}
	return (err as Error).message || "알 수 없는 오류가 발생했습니다.";
}

function transformUser(supabaseUser: SupabaseUser | null): User | null {
	if (!supabaseUser) return null;
	return {
		id: supabaseUser.id,
		email: supabaseUser.email || "",
		created_at: supabaseUser.created_at,
	};
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);
	const [initialized, setInitialized] = useState(false);
	const initStarted = useRef(false);

	// Initialize auth state
	useEffect(() => {
		if (initStarted.current) return;
		initStarted.current = true;

		const supabase = getSupabase();

		async function init() {
			try {
				setLoading(true);
				const {
					data: { session },
				} = await supabase.auth.getSession();
				setUser(transformUser(session?.user || null));
			} catch (err) {
				setError(err as Error);
			} finally {
				setLoading(false);
				setInitialized(true);
			}
		}

		init();

		// Listen for auth changes
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			setUser(transformUser(session?.user || null));
		});

		return () => {
			subscription.unsubscribe();
		};
	}, []);

	const signIn = useCallback(
		async (email: string, password: string, captchaToken?: string) => {
			const supabase = getSupabase();
			try {
				setLoading(true);
				setError(null);

				const { data, error: signInError } =
					await supabase.auth.signInWithPassword({
						email,
						password,
						options: captchaToken ? { captchaToken } : undefined,
					});

				if (signInError) throw signInError;

				setUser(transformUser(data.user));
				return { success: true };
			} catch (err) {
				setError(err as Error);
				return { success: false, error: err as Error };
			} finally {
				setLoading(false);
			}
		},
		[],
	);

	const signUp = useCallback(
		async (email: string, password: string, captchaToken?: string) => {
			const supabase = getSupabase();
			try {
				setLoading(true);
				setError(null);

				const { data, error: signUpError } = await supabase.auth.signUp({
					email,
					password,
					options: captchaToken ? { captchaToken } : undefined,
				});

				if (signUpError) throw signUpError;

				// Supabase는 이미 존재하는 이메일로 signUp 시 에러를 던지지 않음
				// 대신 user.identities가 빈 배열로 반환됨
				if (
					data.user &&
					data.user.identities &&
					data.user.identities.length === 0
				) {
					throw new Error("이미 가입된 이메일입니다");
				}

				// 세션이 없으면 이메일 인증이 필요한 상태
				if (!data.session) {
					return { success: true, needsEmailVerification: true };
				}

				setUser(transformUser(data.user));
				return { success: true };
			} catch (err) {
				const friendlyError = new Error(getAuthErrorMessage(err));
				setError(friendlyError);
				return { success: false, error: friendlyError };
			} finally {
				setLoading(false);
			}
		},
		[],
	);

	const signOut = useCallback(async () => {
		const supabase = getSupabase();
		try {
			setLoading(true);
			setError(null);

			const { error: signOutError } = await supabase.auth.signOut();
			if (signOutError) throw signOutError;

			setUser(null);
			return { success: true };
		} catch (err) {
			setError(err as Error);
			return { success: false, error: err as Error };
		} finally {
			setLoading(false);
		}
	}, []);

	const isAuthenticated = !!user;

	const value = useMemo<AuthContextValue>(
		() => ({
			user,
			loading,
			error,
			isAuthenticated,
			initialized,
			signIn,
			signUp,
			signOut,
		}),
		[user, loading, error, isAuthenticated, initialized, signIn, signUp, signOut],
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
