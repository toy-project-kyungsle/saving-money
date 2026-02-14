"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Turnstile } from "@marsidev/react-turnstile";
import { useAuth } from "@/contexts/AuthContext";
import AuthLayout from "@/components/layout/AuthLayout";
import BaseCard from "@/components/base/BaseCard";
import BaseButton from "@/components/base/BaseButton";
import BaseInput from "@/components/base/BaseInput";

export default function LoginPage() {
	const router = useRouter();
	const { isAuthenticated, initialized, signIn, signUp, loading } =
		useAuth();

	const [isSignUp, setIsSignUp] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [formError, setFormError] = useState("");
	const [captchaToken, setCaptchaToken] = useState("");

	// Redirect if already authenticated at page load time only
	// (signIn/signUp 완료 후 onAuthStateChange로 인한 중복 리다이렉트 방지)
	const checkedInitialAuth = useRef(false);
	useEffect(() => {
		if (initialized && !checkedInitialAuth.current) {
			checkedInitialAuth.current = true;
			if (isAuthenticated) {
				router.push("/");
			}
		}
	}, [initialized, isAuthenticated, router]);

	const turnstileSiteKey =
		process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setFormError("");

		if (!email || !password) {
			setFormError("이메일과 비밀번호를 입력해주세요");
			return;
		}

		if (turnstileSiteKey && !captchaToken) {
			setFormError("캡차 인증을 완료해주세요");
			return;
		}

		if (isSignUp) {
			if (password !== confirmPassword) {
				setFormError("비밀번호가 일치하지 않습니다");
				return;
			}

			if (password.length < 6) {
				setFormError("비밀번호는 6자 이상이어야 합니다");
				return;
			}

			const result = await signUp(email, password, captchaToken || undefined);
			if (result.success) {
				router.push("/");
			} else {
				setFormError(
					result.error?.message || "회원가입에 실패했습니다",
				);
			}
		} else {
			const result = await signIn(email, password, captchaToken || undefined);
			if (result.success) {
				router.push("/");
			} else {
				setFormError(
					result.error?.message || "로그인에 실패했습니다",
				);
			}
		}
	}

	function toggleMode() {
		setIsSignUp(!isSignUp);
		setFormError("");
		setConfirmPassword("");
		setCaptchaToken("");
	}

	// Show loading while auth initializes
	if (!initialized) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
					<p className="mt-2 text-gray-600">로딩 중...</p>
				</div>
			</div>
		);
	}

	// Don't render login if already authenticated
	if (isAuthenticated) {
		return null;
	}

	return (
		<AuthLayout>
			<BaseCard>
				<h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
					{isSignUp ? "회원가입" : "로그인"}
				</h2>

				<form className="space-y-4" onSubmit={handleSubmit}>
					<BaseInput
						value={email}
						onChange={(v) => setEmail(String(v))}
						type="email"
						label="이메일"
						placeholder="email@example.com"
						required
					/>

					<BaseInput
						value={password}
						onChange={(v) => setPassword(String(v))}
						type="password"
						label="비밀번호"
						placeholder="••••••••"
						required
					/>

					{isSignUp && (
						<BaseInput
							value={confirmPassword}
							onChange={(v) => setConfirmPassword(String(v))}
							type="password"
							label="비밀번호 확인"
							placeholder="••••••••"
							required
						/>
					)}

					{turnstileSiteKey && (
						<Turnstile
							key={isSignUp ? "signup" : "signin"}
							siteKey={turnstileSiteKey}
							onSuccess={(token) => setCaptchaToken(token)}
							onExpire={() => setCaptchaToken("")}
							onError={() => setCaptchaToken("")}
						/>
					)}

					{formError && (
						<p className="text-sm text-red-500">{formError}</p>
					)}

					<BaseButton
						type="submit"
						className="w-full"
						loading={loading}
					>
						{isSignUp ? "회원가입" : "로그인"}
					</BaseButton>
				</form>

				<div className="mt-6 text-center">
					<button
						type="button"
						className="text-sm text-blue-600 hover:text-blue-800"
						onClick={toggleMode}
					>
						{isSignUp
							? "이미 계정이 있으신가요? 로그인"
							: "계정이 없으신가요? 회원가입"}
					</button>
				</div>
			</BaseCard>
		</AuthLayout>
	);
}
