"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { useAuth } from "@/contexts/AuthContext";
import { validateEmail, validatePassword } from "@/lib/validation";
import AuthLayout from "@/components/layout/AuthLayout";
import BaseCard from "@/components/base/BaseCard";
import BaseButton from "@/components/base/BaseButton";
import BaseInput from "@/components/base/BaseInput";

const SIGNUP_COOLDOWN_MS = 60_000; // 60초

export default function LoginPage() {
	const router = useRouter();
	const { isAuthenticated, initialized, signIn, signUp, loading } =
		useAuth();

	const [isSignUp, setIsSignUp] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [formError, setFormError] = useState("");
	const [formSuccess, setFormSuccess] = useState("");
	const [captchaToken, setCaptchaToken] = useState("");
	const turnstileRef = useRef<TurnstileInstance>(null);
	const lastSignUpAttempt = useRef<number>(0);

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
		setFormSuccess("");

		if (!email || !password) {
			setFormError("이메일과 비밀번호를 입력해주세요");
			return;
		}

		const emailValidation = validateEmail(email);
		if (!emailValidation.valid) {
			setFormError(emailValidation.error!);
			return;
		}

		const passwordValidation = validatePassword(password);
		if (!passwordValidation.valid) {
			setFormError(passwordValidation.error!);
			return;
		}

		if (turnstileSiteKey && !captchaToken) {
			setFormError("캡차 인증을 완료해주세요");
			return;
		}

		if (isSignUp) {
			if (password !== confirmPassword) {
				setFormError("비밀번호가 일치하지 않아요");
				return;
			}

			const now = Date.now();
			const elapsed = now - lastSignUpAttempt.current;
			if (lastSignUpAttempt.current > 0 && elapsed < SIGNUP_COOLDOWN_MS) {
				const remaining = Math.ceil(
					(SIGNUP_COOLDOWN_MS - elapsed) / 1000,
				);
				setFormError(
					`이메일 전송 제한으로 ${remaining}초 후 다시 시도해주세요.`,
				);
				return;
			}
			lastSignUpAttempt.current = now;


			const result = await signUp(email, password, captchaToken || undefined);
			// Reset captcha after each attempt to avoid timeout-or-duplicate errors
			setCaptchaToken("");
			turnstileRef.current?.reset();
			if (result.success) {
				if (result.needsEmailVerification) {
					setFormSuccess(
						"회원가입이 완료되었어요. 이메일을 확인하여 인증을 완료해주세요.",
					);
				} else {
					router.push("/");
				}
			} else {
				setFormError(
					result.error?.message || "회원가입에 실패했어요",
				);
			}
		} else {
			const result = await signIn(email, password, captchaToken || undefined);
			// Reset captcha after each attempt to avoid timeout-or-duplicate errors
			setCaptchaToken("");
			turnstileRef.current?.reset();
			if (result.success) {
				router.push("/");
			} else {
				setFormError(
					result.error?.message || "로그인에 실패했어요",
				);
			}
		}
	}

	function toggleMode() {
		setIsSignUp(!isSignUp);
		setFormError("");
		setFormSuccess("");
		setConfirmPassword("");
		setCaptchaToken("");
	}

	// Show loading while auth initializes
	if (!initialized) {
		return (
			<div className="min-h-screen bg-surface-subtle flex items-center justify-center">
				<div className="text-center" aria-busy="true">
					<div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
					<p className="mt-3 text-secondary-600 text-sm">로딩 중...</p>
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
			<BaseCard padding="lg">
				<h2 className="text-xl font-bold text-secondary-900 text-center mb-6">
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
						autoComplete="email"
					/>

					<div>
						<BaseInput
							value={password}
							onChange={(v) => setPassword(String(v))}
							type="password"
							label="비밀번호"
							placeholder="••••••••"
							required
							autoComplete={isSignUp ? "new-password" : "current-password"}
						/>
						{isSignUp && (
							<p className="mt-1.5 text-xs text-secondary-400">
								6자 이상으로 입력해주세요
							</p>
						)}
					</div>

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
							ref={turnstileRef}
							key={isSignUp ? "signup" : "signin"}
							siteKey={turnstileSiteKey}
							options={{ refreshExpired: "auto" }}
							onSuccess={(token) => setCaptchaToken(token)}
							onExpire={() => setCaptchaToken("")}
							onError={() => setCaptchaToken("")}
						/>
					)}

					{formError && (
						<div
							className="bg-error-50 border border-error-200 text-error-700 rounded-xl p-3 text-sm"
							role="alert"
						>
							{formError}
						</div>
					)}

					{formSuccess && (
						<div
							className="bg-success-50 border border-success-200 text-success-700 rounded-xl p-3 text-sm"
							role="status"
						>
							{formSuccess}
						</div>
					)}

					<BaseButton
						type="submit"
						className="w-full"
						loading={loading}
					>
						{isSignUp ? "회원가입" : "로그인"}
					</BaseButton>
				</form>

				{/* Divider */}
				<div className="border-t border-secondary-200 mt-6 pt-5">
					<p className="text-center text-sm text-secondary-500">
						{isSignUp
							? "이미 계정이 있으신가요?"
							: "계정이 없으신가요?"}{" "}
						<button
							type="button"
							className="text-primary hover:text-primary-700 font-medium transition-colors duration-200"
							onClick={toggleMode}
						>
							{isSignUp ? "로그인" : "회원가입"}
						</button>
					</p>
				</div>
			</BaseCard>
		</AuthLayout>
	);
}
