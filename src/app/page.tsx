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
	const [selectedCategory, setSelectedCategory] = useState<Category | null>(
		null,
	);
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

	// Clear modal error on close
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

	// Add saving
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

	// Edit saving
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

	// Delete saving
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

	// Category management
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

	// Monthly summary for current month
	const currentMonthSummary = useMemo(() => {
		const currentMonth = getCurrentMonth();
		return totalSummary.byMonth.find((m) => m.month === currentMonth) || {
			month: currentMonth,
			total: 0,
			byCategory: new Map<number, number>(),
		};
	}, [totalSummary.byMonth]);

	// Show portfolio only when investment categories exist
	const hasInvestmentCategories = investmentCategories.length > 0;

	// Show loading if auth not initialized
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

	// Don't render dashboard if not authenticated
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

				{/* Main content */}
				{!error && !(loading && savings.length === 0) && (
					<div className="space-y-8 animate-fadeInUp">
						{/* Section 1: Summary cards (total + this month) */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<SummaryTotal
								total={totalSummary.total}
								byCategory={totalSummary.byCategory}
							/>
							<SummaryMonthly
								summary={currentMonthSummary}
								categories={categories}
							/>
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

						{/* Section 3: Category chart */}
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

						{/* Section 4: Portfolio (only when investment categories exist) */}
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
