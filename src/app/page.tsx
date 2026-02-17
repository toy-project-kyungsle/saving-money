"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Category, CategoryInput, Saving, SavingInput } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { useCategories } from "@/hooks/useCategories";
import { useSavings } from "@/hooks/useSavings";
import { usePortfolio } from "@/hooks/usePortfolio";
import DefaultLayout from "@/components/layout/DefaultLayout";
import BaseButton from "@/components/base/BaseButton";
import BaseCard from "@/components/base/BaseCard";
import FeedbackError from "@/components/feedback/FeedbackError";
import FeedbackLoading from "@/components/feedback/FeedbackLoading";
import SummaryTotal from "@/components/summary/SummaryTotal";
import ChartCategoryPie from "@/components/chart/ChartCategoryPie";
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

	// Auth guard — redirect to login if not authenticated
	useEffect(() => {
		if (initialized && !isAuthenticated) {
			router.push("/login");
		}
	}, [initialized, isAuthenticated, router]);

	// Fetch data on mount — sequential flow matching original Vue onMounted
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

	// Add saving
	const handleAddSaving = useCallback(
		async (data: SavingInput) => {
			setIsSubmitting(true);
			const result = await addSaving(data);
			setIsSubmitting(false);

			if (result.success) {
				setShowAddModal(false);
			}
		},
		[addSaving],
	);

	// Edit saving
	const openEditModal = useCallback((saving: Saving) => {
		setSelectedSaving(saving);
		setShowEditModal(true);
	}, []);

	const handleEditSaving = useCallback(
		async (data: SavingInput) => {
			if (!selectedSaving) return;

			setIsSubmitting(true);
			const result = await updateSaving(selectedSaving.id, data);
			setIsSubmitting(false);

			if (result.success) {
				setShowEditModal(false);
				setSelectedSaving(null);
			}
		},
		[selectedSaving, updateSaving],
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
		}
	}, [selectedSaving, deleteSaving]);

	// Category management
	const openCategoryModal = useCallback((category?: Category) => {
		setSelectedCategory(category || null);
		setShowCategoryModal(true);
	}, []);

	const handleSaveCategory = useCallback(
		async (data: CategoryInput) => {
			setIsSubmitting(true);

			if (selectedCategory) {
				await updateCategory(selectedCategory.id, data);
			} else {
				await addCategory(data);
			}

			setIsSubmitting(false);
			setShowCategoryModal(false);
			setSelectedCategory(null);
		},
		[selectedCategory, updateCategory, addCategory],
	);

	const handleDeleteCategory = useCallback(
		async (id: number) => {
			setIsSubmitting(true);
			await deleteCategory(id);
			setIsSubmitting(false);
			setShowCategoryModal(false);
			setSelectedCategory(null);
		},
		[deleteCategory],
	);

	const loading = categoriesLoading || savingsLoading;

	const categoryBreakdown = useMemo(
		() => totalSummary.byCategory.filter((c) => c.total > 0),
		[totalSummary.byCategory],
	);

	// Show loading if auth not initialized
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

	// Don't render dashboard if not authenticated
	if (!isAuthenticated) {
		return null;
	}

	return (
		<DefaultLayout>
			<div className="space-y-6">
				{/* Header */}
				<div className="flex items-center justify-between">
					<h1 className="text-2xl font-bold text-gray-900">
						저축현황
					</h1>
					<div className="flex gap-2">
						<BaseButton
							variant="secondary"
							onClick={() => openCategoryModal()}
						>
							카테고리 추가
						</BaseButton>
						<BaseButton onClick={() => setShowAddModal(true)}>
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
					<div className="py-12">
						<FeedbackLoading text="데이터를 불러오는 중..." />
					</div>
				)}

				{/* Main content */}
				{!error && !(loading && savings.length === 0) && (
					<>
						{/* Summary cards */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<SummaryTotal
								total={totalSummary.total}
								byCategory={totalSummary.byCategory}
							/>
							<ChartCategoryPie data={categoryBreakdown} />
						</div>

						{/* Portfolio Target Table */}
						<PortfolioTargetTable
							allocations={portfolioSummary.allocations}
							totalTargetPercent={totalTargetPercent}
							onEditCategory={openCategoryModal}
						/>

						{/* Portfolio Summary Card (리밸런싱 제안) */}
						<PortfolioSummaryCard summary={portfolioSummary} />

						{/* Savings list */}
						<BaseCard>
							<h2 className="text-lg font-semibold text-gray-900 mb-4">
								전체 내역
							</h2>
							<SavingList
								savings={savings}
								categories={categories}
								loading={loading}
								onEdit={openEditModal}
								onDelete={openDeleteConfirm}
							/>
						</BaseCard>
					</>
				)}

				{/* Modals */}
				<SavingAddModal
					open={showAddModal}
					onClose={() => setShowAddModal(false)}
					categories={categories}
					loading={isSubmitting}
					onSubmit={handleAddSaving}
				/>

				<SavingEditModal
					open={showEditModal}
					onClose={() => {
						setShowEditModal(false);
						setSelectedSaving(null);
					}}
					saving={selectedSaving}
					categories={categories}
					loading={isSubmitting}
					onSubmit={handleEditSaving}
				/>

				<SavingDeleteConfirm
					open={showDeleteConfirm}
					onClose={() => {
						setShowDeleteConfirm(false);
						setSelectedSaving(null);
					}}
					saving={selectedSaving}
					loading={isSubmitting}
					onConfirm={handleDeleteSaving}
				/>

				<CategoryManagerModal
					open={showCategoryModal}
					onClose={() => {
						setShowCategoryModal(false);
						setSelectedCategory(null);
					}}
					category={selectedCategory}
					loading={isSubmitting}
					onSave={handleSaveCategory}
					onDelete={handleDeleteCategory}
				/>
			</div>
		</DefaultLayout>
	);
}
