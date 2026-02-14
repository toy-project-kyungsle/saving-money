"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

interface DefaultLayoutProps {
	children: React.ReactNode;
}

export default function DefaultLayout({ children }: DefaultLayoutProps) {
	const { user, isAuthenticated, signOut } = useAuth();
	const router = useRouter();

	async function handleSignOut() {
		await signOut();
		router.push("/login");
	}

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<header className="bg-white border-b border-gray-200">
				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between h-16">
						{/* Logo */}
						<Link href="/" className="flex items-center gap-2">
							<div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
								<svg
									className="w-5 h-5 text-white"
									width="20"
									height="20"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
							</div>
							<span className="text-lg font-bold text-gray-900 hidden sm:block">
								저축 관리
							</span>
						</Link>

						{/* User menu */}
						{isAuthenticated && (
							<div className="flex items-center gap-4">
								<span className="text-sm text-gray-600 hidden sm:block">
									{user?.email}
								</span>
								<button
									type="button"
									className="text-sm text-gray-500 hover:text-gray-700"
									onClick={handleSignOut}
								>
									로그아웃
								</button>
							</div>
						)}
					</div>
				</div>
			</header>

			{/* Main content */}
			<main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{children}
			</main>
		</div>
	);
}
