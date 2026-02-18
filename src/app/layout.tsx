import type { Metadata } from "next";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "@/components/feedback/FeedbackToast";
import "./globals.css";

export const metadata: Metadata = {
	title: "저축 관리",
	description: "나의 자산을 한눈에",
	icons: {
		icon: "/favicon.svg",
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="ko">
			<body>
				<AuthProvider>
					<ToastProvider>{children}</ToastProvider>
				</AuthProvider>
			</body>
		</html>
	);
}
