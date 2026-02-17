import type { Config } from "tailwindcss";

const config: Config = {
	content: ["./src/**/*.{ts,tsx}"],
	theme: {
		extend: {
			/* ─────────────────────────────────────────────
			 * Color System
			 * ───────────────────────────────────────────── */
			colors: {
				/* Brand / Primary — Indigo-blue, professional yet warm */
				primary: {
					50: "#EEF2FF",
					100: "#E0E7FF",
					200: "#C7D2FE",
					300: "#A5B4FC",
					400: "#818CF8",
					500: "#6366F1",
					DEFAULT: "#4F46E5",
					600: "#4F46E5",
					700: "#4338CA",
					800: "#3730A3",
					900: "#312E81",
					950: "#1E1B4B",
				},

				/* Secondary — Warm slate for supporting elements */
				secondary: {
					50: "#F8FAFC",
					100: "#F1F5F9",
					200: "#E2E8F0",
					300: "#CBD5E1",
					400: "#94A3B8",
					DEFAULT: "#64748B",
					500: "#64748B",
					600: "#475569",
					700: "#334155",
					800: "#1E293B",
					900: "#0F172A",
				},

				/* Accent — Teal for highlights, CTAs, positive emphasis */
				accent: {
					50: "#F0FDFA",
					100: "#CCFBF1",
					200: "#99F6E4",
					300: "#5EEAD4",
					400: "#2DD4BF",
					DEFAULT: "#14B8A6",
					500: "#14B8A6",
					600: "#0D9488",
					700: "#0F766E",
					800: "#115E59",
					900: "#134E4A",
				},

				/* Semantic — Status colors */
				success: {
					50: "#F0FDF4",
					100: "#DCFCE7",
					200: "#BBF7D0",
					DEFAULT: "#22C55E",
					500: "#22C55E",
					600: "#16A34A",
					700: "#15803D",
				},
				warning: {
					50: "#FFFBEB",
					100: "#FEF3C7",
					200: "#FDE68A",
					DEFAULT: "#F59E0B",
					500: "#F59E0B",
					600: "#D97706",
					700: "#B45309",
				},
				error: {
					50: "#FEF2F2",
					100: "#FEE2E2",
					200: "#FECACA",
					DEFAULT: "#EF4444",
					500: "#EF4444",
					600: "#DC2626",
					700: "#B91C1C",
				},
				info: {
					50: "#EFF6FF",
					100: "#DBEAFE",
					DEFAULT: "#3B82F6",
					500: "#3B82F6",
					600: "#2563EB",
					700: "#1D4ED8",
				},

				/* Category Colors — Backward compatible, refined */
				salary: {
					DEFAULT: "#4CAF50",
					light: "#81C784",
					dark: "#388E3C",
				},
				savings: {
					DEFAULT: "#2196F3",
					light: "#64B5F6",
					dark: "#1976D2",
				},
				stock: {
					DEFAULT: "#FF9800",
					light: "#FFB74D",
					dark: "#F57C00",
				},
				crypto: {
					DEFAULT: "#9C27B0",
					light: "#BA68C8",
					dark: "#7B1FA2",
				},

				/* Surface colors for layered backgrounds */
				surface: {
					DEFAULT: "#FFFFFF",
					raised: "#FFFFFF",
					overlay: "rgba(0, 0, 0, 0.5)",
					subtle: "#F8FAFC",
				},
			},

			/* ─────────────────────────────────────────────
			 * Typography — Korean-optimized system font stack
			 * ───────────────────────────────────────────── */
			fontFamily: {
				sans: [
					"-apple-system",
					"BlinkMacSystemFont",
					"Apple SD Gothic Neo",
					"Pretendard",
					"Noto Sans KR",
					"Malgun Gothic",
					"맑은 고딕",
					"Segoe UI",
					"Roboto",
					"Helvetica Neue",
					"Arial",
					"sans-serif",
				],
				mono: [
					"SF Mono",
					"Fira Code",
					"Consolas",
					"D2Coding",
					"monospace",
				],
			},

			/* ─────────────────────────────────────────────
			 * Extended Spacing
			 * ───────────────────────────────────────────── */
			spacing: {
				"4.5": "1.125rem", // 18px — between 4 (16px) and 5 (20px)
				"13": "3.25rem",   // 52px
				"15": "3.75rem",   // 60px
				"18": "4.5rem",    // 72px
				"88": "22rem",     // 352px — for wider sidebar if needed
				"128": "32rem",    // 512px
			},

			/* ─────────────────────────────────────────────
			 * Border Radius — Extended scale
			 * ───────────────────────────────────────────── */
			borderRadius: {
				"2xl": "1rem",     // 16px — larger cards
				"3xl": "1.5rem",   // 24px — hero cards, feature sections
			},

			/* ─────────────────────────────────────────────
			 * Shadows — Softer, more layered for depth
			 * ───────────────────────────────────────────── */
			boxShadow: {
				"xs": "0 1px 2px 0 rgba(0, 0, 0, 0.03)",
				"sm": "0 1px 3px 0 rgba(0, 0, 0, 0.06), 0 1px 2px -1px rgba(0, 0, 0, 0.04)",
				"DEFAULT": "0 2px 6px -1px rgba(0, 0, 0, 0.06), 0 2px 4px -2px rgba(0, 0, 0, 0.04)",
				"md": "0 4px 8px -2px rgba(0, 0, 0, 0.06), 0 2px 4px -2px rgba(0, 0, 0, 0.04)",
				"lg": "0 10px 20px -4px rgba(0, 0, 0, 0.07), 0 4px 6px -4px rgba(0, 0, 0, 0.04)",
				"xl": "0 20px 40px -8px rgba(0, 0, 0, 0.08), 0 8px 16px -6px rgba(0, 0, 0, 0.04)",
				"card": "0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.03)",
				"card-hover": "0 4px 12px -2px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.04)",
				"modal": "0 24px 48px -12px rgba(0, 0, 0, 0.15), 0 12px 24px -8px rgba(0, 0, 0, 0.08)",
			},

			/* ─────────────────────────────────────────────
			 * Animations — Extend with new keyframes
			 * ───────────────────────────────────────────── */
			keyframes: {
				fadeIn: {
					from: { opacity: "0" },
					to: { opacity: "1" },
				},
				scaleIn: {
					from: { transform: "scale(0.95)", opacity: "0" },
					to: { transform: "scale(1)", opacity: "1" },
				},
				slideUp: {
					from: { transform: "translateY(8px)", opacity: "0" },
					to: { transform: "translateY(0)", opacity: "1" },
				},
				slideDown: {
					from: { transform: "translateY(-8px)", opacity: "0" },
					to: { transform: "translateY(0)", opacity: "1" },
				},
				fadeInUp: {
					from: { transform: "translateY(16px)", opacity: "0" },
					to: { transform: "translateY(0)", opacity: "1" },
				},
				shimmer: {
					"0%": { backgroundPosition: "-200% 0" },
					"100%": { backgroundPosition: "200% 0" },
				},
			},
			animation: {
				fadeIn: "fadeIn 0.2s ease",
				scaleIn: "scaleIn 0.2s ease",
				slideUp: "slideUp 0.25s ease-out",
				slideDown: "slideDown 0.25s ease-out",
				fadeInUp: "fadeInUp 0.3s ease-out",
				shimmer: "shimmer 1.5s ease-in-out infinite",
			},

			/* ─────────────────────────────────────────────
			 * Typography — Extended font sizes
			 * ───────────────────────────────────────────── */
			fontSize: {
				"2xs": ["0.6875rem", { lineHeight: "1rem" }],       // 11px
				"xs": ["0.75rem", { lineHeight: "1.125rem" }],      // 12px
				"sm": ["0.8125rem", { lineHeight: "1.25rem" }],     // 13px
				"base": ["0.875rem", { lineHeight: "1.375rem" }],   // 14px
				"md": ["0.9375rem", { lineHeight: "1.5rem" }],      // 15px
				"lg": ["1.0625rem", { lineHeight: "1.625rem" }],    // 17px
				"xl": ["1.25rem", { lineHeight: "1.75rem" }],       // 20px
				"2xl": ["1.5rem", { lineHeight: "2rem" }],          // 24px
				"3xl": ["1.875rem", { lineHeight: "2.25rem" }],     // 30px
				"4xl": ["2.25rem", { lineHeight: "2.75rem" }],      // 36px
			},

			/* ─────────────────────────────────────────────
			 * Transitions — Custom durations and easings
			 * ───────────────────────────────────────────── */
			transitionDuration: {
				"250": "250ms",
			},
			transitionTimingFunction: {
				"smooth": "cubic-bezier(0.4, 0, 0.2, 1)",
				"snappy": "cubic-bezier(0.2, 0, 0, 1)",
			},
		},
	},
	plugins: [],
};

export default config;
