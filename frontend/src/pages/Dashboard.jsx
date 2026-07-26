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
import Spinner from "../components/Spinner";
import EmptyState from "../components/EmptyState";

// Dashboard OWNS all business logic for Hisaab management. Every
// component it renders below is "dumb" — receiving data via props
// and reporting user actions back via callbacks. This file is the
// only one that calls hisaabService, decides create-vs-update, and
// triggers refetches. This mirrors the backend's controller layer:
// components are like views, Dashboard is like the controller.
const Dashboard = () => {
  const { user } = useAuth();

  // ── Server data + fetch status ──────────────────────────
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // ── Search / filter / sort ──────────────────────────────
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("newest");
  // debouncedSearch updates 400ms after the user stops typing.
  // fetchEntries watches THIS, not `search` directly — see useDebounce
  // for the full explanation of why.
  const debouncedSearch = useDebounce(search, 400);

  // ── Modal + selection state ──────────────────────────────
  const [selectedEntry, setSelectedEntry] = useState(null); // null = create mode
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // useCallback memoizes this function so it has a stable identity
  // across renders — useful since it's the dependency of the
  // useEffect below (without useCallback, a new function reference
  // every render would make that effect re-run constantly).
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

  // Re-fetch whenever the debounced search term, category, or sort
  // changes — this is what makes filtering/sorting/searching feel
  // "live" without a manual refresh button.
  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  // ── Create / Edit flow ───────────────────────────────────
  const openCreateModal = () => {
    setSelectedEntry(null); // null = HisaabForm renders in "create" mode
    setShowFormModal(true);
  };

  const openEditModal = (hisaab) => {
    setSelectedEntry(hisaab); // present = HisaabForm pre-fills and edits
    setShowFormModal(true);
  };

  const handleFormSubmit = async (formData) => {
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
      fetchEntries(); // refresh the list to reflect the change
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Delete flow ──────────────────────────────────────────
  const openDeleteModal = (hisaab) => {
    setSelectedEntry(hisaab);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
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
  };

  // Decide which of the 4 body states to render. Order matters:
  // loading takes priority, then error, then "empty because of
  // filters" vs "empty because there's truly nothing yet."
  const isFiltering = search.trim() !== "" || category !== "All";

  const renderBody = () => {
    if (loading) return <Spinner />;

    if (hasError) {
      return (
        <EmptyState
          icon={<FiWifiOff />}
          title="Something went wrong"
          message="We couldn't load your hisaabs. Please check your connection and try again."
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
      {/* Welcome section */}
      <div>
        <h1 className="text-2xl font-semibold">
          Welcome back, {user?.name} 👋
        </h1>
        <p className="text-(--color-text-secondary) text-sm mt-1">
          Here's what's in your ledger
        </p>
      </div>

      {/* Stats */}
      <StatsCard
        label="Total Entries"
        value={entries.length}
        icon={<FiFileText />}
      />

      {/* Controls: search, filter/sort, create button */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
        <SearchBar value={search} onChange={setSearch} />
        <FilterBar
          category={category}
          onCategoryChange={setCategory}
          sort={sort}
          onSortChange={setSort}
        />
        <button
          onClick={openCreateModal}
          className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-(--color-accent) text-white font-medium whitespace-nowrap"
        >
          <FiPlus />
          New Hisaab
        </button>
      </div>

      {/* Main content: spinner / empty states / grid */}
      {renderBody()}

      {/* Modals — always rendered, but internally return null when
          closed (see Modal.jsx). Keeping them mounted here means
          their state (via HisaabForm's useEffect) resets correctly
          each time they open. */}
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
