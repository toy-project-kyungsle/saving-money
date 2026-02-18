"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Category, CategoryInput, Saving, SavingInput } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { useCategories } from "@/hooks/useCategories";
import { useSavings } from "@/hooks/useSavings";
import { usePortfolio } from "@/hooks/usePortfolio";
import { useToast } from "@/components/feedback/FeedbackToast";
import { getCurrentMonth } from "@/lib/date";
import DefaultLayout from "@/components/layout/DefaultLayout";
import BaseButton from "@/components/base/BaseButton";
import BaseCard from "@/components/base/BaseCard";
import FeedbackError from "@/components/feedback/FeedbackError";
import FeedbackLoading from "@/components/feedback/FeedbackLoading";
import SummaryTotal from "@/components/summary/SummaryTotal";
import SummaryMonthly from "@/components/summary/SummaryMonthly";
import ChartCategoryPie from "@/components/chart/ChartCategoryPie";
import ChartMonthlyBar from "@/components/chart/ChartMonthlyBar";
import PortfolioTargetTable from "@/components/portfolio/PortfolioTargetTable";
import PortfolioSummaryCard from "@/components/portfolio/PortfolioSummaryCard";
import SavingList from "@/components/saving/SavingList";
import SavingAddModal from "@/components/saving/SavingAddModal";
import SavingEditModal from "@/components/saving/SavingEditModal";
import SavingDeleteConfirm from "@/components/saving/SavingDeleteConfirm";
import CategoryManagerModal from "@/components/category/CategoryManagerModal";

export default function DashboardPage() {
	const router = useRouter();
	const { isAuthenticated, initialized } = useAuth();
	const showToast = useToast();

	const {
		categories,
		loading: categoriesLoading,
		fetchCategories,
		initDefaultCategories,
		addCategory,
		updateCategory,
		deleteCategory,
		investmentCategories,
		savingsCategories,
	} = useCategories();

	const {
		savings,
		loading: savingsLoading,
		error,
		totalSummary,
		fetchSavings,
		addSaving,
		updateSaving,
		deleteSaving,
		investmentTypeSavings,
	} = useSavings(categories, investmentCategories, savingsCategories);

	const { portfolioSummary, totalTargetPercent } = usePortfolio(
		investmentCategories,
		investmentTypeSavings,
	);

	// Modal states
	const [showAddModal, setShowAddModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
	const [showCategoryModal, setShowCategoryModal] = useState(false);
	const [selectedSaving, setSelectedSaving] = useState<Saving | null>(null);
	const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [modalError, setModalError] = useState("");
	const [categoryModalError, setCategoryModalError] = useState("");

	// Auth guard
	useEffect(() => {
		if (initialized && !isAuthenticated) {
			router.push("/login");
		}
	}, [initialized, isAuthenticated, router]);

	// Fetch data on mount
	const [dataLoaded, setDataLoaded] = useState(false);
	useEffect(() => {
		if (!isAuthenticated || dataLoaded) return;

		async function loadData() {
			const fetchedCategories = await fetchCategories();
			if (fetchedCategories.length === 0) {
				await initDefaultCategories();
			}
			await fetchSavings();
			setDataLoaded(true);
		}
		loadData();
	}, [isAuthenticated, dataLoaded, fetchCategories, initDefaultCategories, fetchSavings]);

	function clearAndCloseAddModal() {
		setShowAddModal(false);
		setModalError("");
	}
	function clearAndCloseEditModal() {
		setShowEditModal(false);
		setSelectedSaving(null);
		setModalError("");
	}
	function clearAndCloseDeleteModal() {
		setShowDeleteConfirm(false);
		setSelectedSaving(null);
	}
	function clearAndCloseCategoryModal() {
		setShowCategoryModal(false);
		setSelectedCategory(null);
		setCategoryModalError("");
	}

	const handleAddSaving = useCallback(
		async (data: SavingInput) => {
			setIsSubmitting(true);
			setModalError("");
			const result = await addSaving(data);
			setIsSubmitting(false);
			if (result.success) {
				setShowAddModal(false);
				setModalError("");
				showToast("success", "저축이 추가되었어요");
			} else {
				setModalError(result.error?.message || "저축 추가에 실패했어요");
			}
		},
		[addSaving, showToast],
	);

	const openEditModal = useCallback((saving: Saving) => {
		setSelectedSaving(saving);
		setShowEditModal(true);
		setModalError("");
	}, []);

	const handleEditSaving = useCallback(
		async (data: SavingInput) => {
			if (!selectedSaving) return;
			setIsSubmitting(true);
			setModalError("");
			const result = await updateSaving(selectedSaving.id, data);
			setIsSubmitting(false);
			if (result.success) {
				setShowEditModal(false);
				setSelectedSaving(null);
				setModalError("");
				showToast("success", "수정되었어요");
			} else {
				setModalError(result.error?.message || "수정에 실패했어요");
			}
		},
		[selectedSaving, updateSaving, showToast],
	);

	const openDeleteConfirm = useCallback((saving: Saving) => {
		setSelectedSaving(saving);
		setShowDeleteConfirm(true);
	}, []);

	const handleDeleteSaving = useCallback(async () => {
		if (!selectedSaving) return;
		setIsSubmitting(true);
		const result = await deleteSaving(selectedSaving.id);
		setIsSubmitting(false);
		if (result.success) {
			setShowDeleteConfirm(false);
			setSelectedSaving(null);
			showToast("success", "삭제되었어요");
		} else {
			showToast("error", "삭제에 실패했어요");
		}
	}, [selectedSaving, deleteSaving, showToast]);

	const openCategoryModal = useCallback((category?: Category) => {
		setSelectedCategory(category || null);
		setShowCategoryModal(true);
		setCategoryModalError("");
	}, []);

	const handleSaveCategory = useCallback(
		async (data: CategoryInput) => {
			setIsSubmitting(true);
			setCategoryModalError("");
			let result;
			if (selectedCategory) {
				result = await updateCategory(selectedCategory.id, data);
			} else {
				result = await addCategory(data);
			}
			setIsSubmitting(false);
			if (result.success) {
				setShowCategoryModal(false);
				setSelectedCategory(null);
				setCategoryModalError("");
				showToast("success", selectedCategory ? "카테고리가 수정되었어요" : "카테고리가 추가되었어요");
			} else {
				setCategoryModalError(result.error?.message || "카테고리 저장에 실패했어요");
			}
		},
		[selectedCategory, updateCategory, addCategory, showToast],
	);

	const handleDeleteCategory = useCallback(
		async (id: number) => {
			setIsSubmitting(true);
			setCategoryModalError("");
			const result = await deleteCategory(id);
			setIsSubmitting(false);
			if (result.success) {
				setShowCategoryModal(false);
				setSelectedCategory(null);
				setCategoryModalError("");
				showToast("success", "카테고리가 삭제되었어요");
			} else {
				setCategoryModalError(result.error?.message || "카테고리 삭제에 실패했어요");
			}
		},
		[deleteCategory, showToast],
	);

	const loading = categoriesLoading || savingsLoading;

	const categoryBreakdown = useMemo(
		() => totalSummary.byCategory.filter((c) => c.total > 0),
		[totalSummary.byCategory],
	);

	const currentMonthSummary = useMemo(() => {
		const currentMonth = getCurrentMonth();
		return totalSummary.byMonth.find((m) => m.month === currentMonth) || {
			month: currentMonth,
			total: 0,
			byCategory: new Map<number, number>(),
		};
	}, [totalSummary.byMonth]);

	const prevMonthSummary = useMemo(() => {
		const sorted = [...totalSummary.byMonth].sort((a, b) =>
			b.month.localeCompare(a.month),
		);
		const currentMonth = getCurrentMonth();
		const currentIdx = sorted.findIndex((m) => m.month === currentMonth);
		return currentIdx >= 0 && sorted[currentIdx + 1]
			? sorted[currentIdx + 1]
			: sorted.length >= 2
				? sorted[1]
				: null;
	}, [totalSummary.byMonth]);

	const hasInvestmentCategories = investmentCategories.length > 0;
	const isFirstTimeUser = dataLoaded && savings.length === 0;

	if (!initialized) {
		return (
			<div className="min-h-screen bg-surface-subtle flex items-center justify-center">
				<div className="text-center">
					<div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
					<p className="mt-3 text-sm text-secondary-600">로딩 중...</p>
				</div>
			</div>
		);
	}

	if (!isAuthenticated) {
		return null;
	}

	return (
		<DefaultLayout>
			<div className="space-y-8">
				{/* Header */}
				<div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
					<div>
						<h1 className="text-2xl font-bold text-secondary-900 tracking-tight">
							저축현황
						</h1>
						<p className="mt-1 text-sm text-secondary-400">
							나의 자산을 한눈에 관리하세요
						</p>
					</div>
					<div className="flex gap-2">
						<BaseButton
							variant="secondary"
							size="sm"
							onClick={() => openCategoryModal()}
						>
							카테고리 관리
						</BaseButton>
						<BaseButton
							size="sm"
							onClick={() => setShowAddModal(true)}
						>
							+ 새 저축
						</BaseButton>
					</div>
				</div>

				{/* Error state */}
				{error && (
					<FeedbackError
						message={error.message}
						onRetry={fetchSavings}
					/>
				)}

				{/* Loading state */}
				{!error && loading && savings.length === 0 && (
					<div className="py-12" aria-busy="true">
						<FeedbackLoading text="데이터를 불러오는 중..." />
					</div>
				)}

				{/* First-time user welcome */}
				{!error && isFirstTimeUser && !loading && (
					<div className="animate-fadeInUp">
						<div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 via-primary to-primary-800 text-white p-8 sm:p-10 shadow-lg">
							<div className="absolute top-0 right-0 w-72 h-72 opacity-10" aria-hidden="true">
								<svg viewBox="0 0 200 200" fill="none">
									<circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="0.5" />
									<circle cx="100" cy="100" r="60" stroke="currentColor" strokeWidth="0.5" />
									<circle cx="100" cy="100" r="40" stroke="currentColor" strokeWidth="0.5" />
								</svg>
							</div>
							<div className="relative space-y-6 max-w-md">
								<div>
									<h2 className="text-2xl font-bold mb-2">
										저축 관리를 시작해볼까요?
									</h2>
									<p className="text-white/70 leading-relaxed">
										매달 저축 내역을 기록하고, 카테고리별로 자산을 관리해보세요. 포트폴리오 분석도 자동으로 해드려요.
									</p>
								</div>
								<div className="flex flex-col sm:flex-row gap-3">
									<BaseButton
										className="bg-white text-primary-700 hover:bg-white/90 shadow-md"
										onClick={() => setShowAddModal(true)}
									>
										첫 저축 기록하기
									</BaseButton>
									<BaseButton
										variant="ghost"
										className="text-white/80 hover:text-white hover:bg-white/10"
										onClick={() => openCategoryModal()}
									>
										카테고리 설정하기
									</BaseButton>
								</div>
								<div className="flex flex-wrap gap-4 sm:gap-6 pt-2 text-sm text-white/50">
									<div className="flex items-center gap-2">
										<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
										</svg>
										카테고리별 분류
									</div>
									<div className="flex items-center gap-2">
										<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
										</svg>
										월별 추이 분석
									</div>
									<div className="flex items-center gap-2">
										<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
										</svg>
										포트폴리오 관리
									</div>
								</div>
							</div>
						</div>
					</div>
				)}

				{/* Main content */}
				{!error && !(loading && savings.length === 0) && !isFirstTimeUser && (
					<div className="space-y-8 animate-fadeInUp">
						{/* Section 1: Hero total (wider) + monthly card */}
						<div className="grid grid-cols-1 md:grid-cols-5 gap-4">
							<div className="md:col-span-3">
								<SummaryTotal
									total={totalSummary.total}
									byCategory={totalSummary.byCategory}
									byMonth={totalSummary.byMonth}
								/>
							</div>
							<div className="md:col-span-2">
								<SummaryMonthly
									summary={currentMonthSummary}
									prevSummary={prevMonthSummary}
									categories={categories}
								/>
							</div>
						</div>

						{/* Section 2: Savings list */}
						<section>
							<h2 className="text-lg font-semibold text-secondary-900 mb-4">
								전체 내역
							</h2>
							<BaseCard>
								<SavingList
									savings={savings}
									categories={categories}
									loading={loading}
									onEdit={openEditModal}
									onDelete={openDeleteConfirm}
									onAdd={() => setShowAddModal(true)}
								/>
							</BaseCard>
						</section>

						{/* Section 3: Analysis charts */}
						<section>
							<h2 className="text-lg font-semibold text-secondary-900 mb-4">
								분석
							</h2>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<ChartCategoryPie
									data={categoryBreakdown}
									onAdd={() => setShowAddModal(true)}
								/>
								<ChartMonthlyBar
									data={totalSummary.byMonth}
									categories={categories}
								/>
							</div>
						</section>

						{/* Section 4: Portfolio */}
						{hasInvestmentCategories && (
							<section>
								<h2 className="text-lg font-semibold text-secondary-900 mb-4">
									포트폴리오
								</h2>
								<div className="space-y-4">
									<PortfolioTargetTable
										allocations={portfolioSummary.allocations}
										totalTargetPercent={totalTargetPercent}
										onEditCategory={openCategoryModal}
									/>
									<PortfolioSummaryCard summary={portfolioSummary} />
								</div>
							</section>
						)}
					</div>
				)}

				{/* Modals */}
				<SavingAddModal
					open={showAddModal}
					onClose={clearAndCloseAddModal}
					categories={categories}
					loading={isSubmitting}
					error={modalError}
					onSubmit={handleAddSaving}
				/>

				<SavingEditModal
					open={showEditModal}
					onClose={clearAndCloseEditModal}
					saving={selectedSaving}
					categories={categories}
					loading={isSubmitting}
					error={modalError}
					onSubmit={handleEditSaving}
				/>

				<SavingDeleteConfirm
					open={showDeleteConfirm}
					onClose={clearAndCloseDeleteModal}
					saving={selectedSaving}
					loading={isSubmitting}
					onConfirm={handleDeleteSaving}
				/>

				<CategoryManagerModal
					open={showCategoryModal}
					onClose={clearAndCloseCategoryModal}
					categories={categories}
					category={selectedCategory}
					loading={isSubmitting}
					error={categoryModalError}
					onSave={handleSaveCategory}
					onDelete={handleDeleteCategory}
				/>
			</div>
		</DefaultLayout>
	);
}
