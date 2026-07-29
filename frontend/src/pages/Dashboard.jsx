import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import {
  FiPlus,
  FiInbox,
  FiSearch,
  FiWifiOff,
  FiFileText,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import * as hisaabService from "../services/hisaabService";
import useDebounce from "../hooks/useDebounce";
import getErrorMessage from "../utils/getErrorMessage";

import StatsCard from "../components/StatsCard";
import SearchBar from "../components/SearchBar";
import FilterBar from "../components/FilterBar";
import HisaabCard from "../components/HisaabCard";
import HisaabForm from "../components/HisaabForm";
import DeleteModal from "../components/DeleteModal";
import SkeletonCard from "../components/SkeletonCard";
import EmptyState from "../components/EmptyState";
import Button from "../components/Button";
import useDocumentTitle from "../hooks/useDocumentTitle";

// Dashboard OWNS all business logic. Every component it renders is
// "dumb" — receiving data via props and reporting actions back via
// callbacks. This file is the only one that calls hisaabService.
const Dashboard = () => {
  useDocumentTitle("Dashboard");
  const { user } = useAuth();

  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("newest");
  const debouncedSearch = useDebounce(search, 400);

  const [selectedEntry, setSelectedEntry] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchEntries = useCallback(async () => {
    setLoading(true);
    setHasError(false);
    try {
      const response = await hisaabService.getAllHisaab({
        search: debouncedSearch,
        category,
        sort,
      });
      setEntries(response.data);
    } catch (error) {
      setHasError(true);
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, category, sort]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  // ── Stable callbacks (useCallback) ───────────────────────
  // Each has an empty (or minimal) dependency array, meaning React
  // reuses the SAME function reference across renders. This is what
  // makes HisaabCard's React.memo actually effective — without this,
  // every Dashboard re-render (e.g., from typing in search) would
  // pass a "new" onEdit/onDelete to every card, forcing all of them
  // to re-render regardless of memo.
  const openCreateModal = useCallback(() => {
    setSelectedEntry(null);
    setShowFormModal(true);
  }, []);

  const openEditModal = useCallback((hisaab) => {
    setSelectedEntry(hisaab);
    setShowFormModal(true);
  }, []);

  const openDeleteModal = useCallback((hisaab) => {
    setSelectedEntry(hisaab);
    setShowDeleteModal(true);
  }, []);

  const handleFormSubmit = useCallback(
    async (formData) => {
      setIsSubmitting(true);
      try {
        if (selectedEntry) {
          await hisaabService.updateHisaab(selectedEntry._id, formData);
          toast.success("Hisaab updated successfully");
        } else {
          await hisaabService.createHisaab(formData);
          toast.success("Hisaab created successfully");
        }
        setShowFormModal(false);
        fetchEntries();
      } catch (error) {
        toast.error(getErrorMessage(error));
      } finally {
        setIsSubmitting(false);
      }
    },
    [selectedEntry, fetchEntries],
  );

  const handleDeleteConfirm = useCallback(async () => {
    setIsDeleting(true);
    try {
      await hisaabService.deleteHisaab(selectedEntry._id);
      toast.success("Hisaab deleted successfully");
      setShowDeleteModal(false);
      fetchEntries();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsDeleting(false);
    }
  }, [selectedEntry, fetchEntries]);

  const isFiltering = search.trim() !== "" || category !== "All";

  const renderBody = () => {
    // Skeleton grid instead of a spinner: mimics the actual card
    // layout about to appear, so the loading→loaded transition feels
    // seamless rather than a jarring swap from "spinner" to "grid."
    if (loading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      );
    }

    if (hasError) {
      return (
        <EmptyState
          icon={<FiWifiOff />}
          title="Something went wrong"
          message="We couldn't load your hisaabs. Please check your connection and try again."
          action={
            <Button variant="secondary" onClick={fetchEntries}>
              Retry
            </Button>
          }
        />
      );
    }

    if (entries.length === 0 && isFiltering) {
      return (
        <EmptyState
          icon={<FiSearch />}
          title="No matching entries"
          message="Try a different search term or clear your filters."
        />
      );
    }

    if (entries.length === 0) {
      return (
        <EmptyState
          icon={<FiInbox />}
          title="No hisaabs yet"
          message='Click "New Hisaab" to create your first entry.'
        />
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {entries.map((hisaab) => (
          <HisaabCard
            key={hisaab._id}
            hisaab={hisaab}
            onEdit={openEditModal}
            onDelete={openDeleteModal}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold">
          Welcome back, {user?.name} 👋
        </h1>
        <p className="text-(--color-text-secondary) text-sm mt-1">
          Here's what's in your ledger
        </p>
      </div>

      <StatsCard
        label="Total Entries"
        value={entries.length}
        icon={<FiFileText />}
      />

      {/* flex-col on mobile (stacked controls, full width, no
          horizontal scrolling), flex-row from sm up. */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
        <SearchBar value={search} onChange={setSearch} />
        <FilterBar
          category={category}
          onCategoryChange={setCategory}
          sort={sort}
          onSortChange={setSort}
        />
        <Button onClick={openCreateModal} className="whitespace-nowrap">
          <FiPlus />
          New Hisaab
        </Button>
      </div>

      {/* aria-busy tells assistive tech this region is updating —
          announced once when loading starts/ends, rather than the
          skeleton grid's individual (aria-hidden) blocks being read
          out one by one. */}
      <div aria-busy={loading} aria-live="polite">
        {renderBody()}
      </div>

      <HisaabForm
        isOpen={showFormModal}
        onClose={() => setShowFormModal(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedEntry}
        isSubmitting={isSubmitting}
      />

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        entryTitle={selectedEntry?.title}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default Dashboard;
