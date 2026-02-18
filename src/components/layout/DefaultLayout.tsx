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
		<div className="min-h-screen bg-surface-subtle">
			{/* Header */}
			<header className="sticky top-0 z-40 bg-white backdrop-blur-lg supports-[backdrop-filter]:bg-white/80 border-b border-secondary-200/60 shadow-xs">
				<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between h-15">
						{/* Logo */}
						<Link
							href="/"
							className="flex items-center gap-2.5 group"
						>
							<div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center shadow-sm transition-interactive group-hover:shadow-md group-hover:scale-105">
								<svg
									className="w-5 h-5 text-white"
									width="20"
									height="20"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									aria-hidden="true"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
							</div>
							<span className="text-lg font-bold text-secondary-900 hidden sm:block tracking-tight">
								저축 관리
							</span>
						</Link>

						{/* User menu */}
						{isAuthenticated && (
							<div className="flex items-center gap-3">
								<span className="text-sm text-secondary-500 hidden sm:block">
									{user?.email}
								</span>
								<button
									type="button"
									className="text-sm font-medium text-secondary-500 hover:text-secondary-700 hover:bg-secondary-100 px-3 py-1.5 rounded-lg transition-interactive focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-400"
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
			<main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeInUp">
				{children}
			</main>
		</div>
	);
}
