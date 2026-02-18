"use client";

import { useRouter } from "next/navigation";
import BaseButton from "@/components/base/BaseButton";

export default function NotFound() {
	const router = useRouter();

	return (
		<div className="min-h-screen bg-surface-subtle flex flex-col items-center justify-center px-4">
			<div className="text-center max-w-sm">
				<div className="flex items-center justify-center w-16 h-16 mb-6 bg-primary-50 rounded-full mx-auto">
					<svg
						className="w-8 h-8 text-primary"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						aria-hidden="true"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
				</div>

				<h1 className="text-4xl font-bold text-secondary-900 mb-2">404</h1>

				<p className="text-lg text-secondary-600 mb-8">
					페이지를 찾을 수 없어요
				</p>

				<BaseButton onClick={() => router.push("/")}>
					홈으로 돌아가기
				</BaseButton>
			</div>
		</div>
	);
}
