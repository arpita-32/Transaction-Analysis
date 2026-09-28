import React, { useState } from "react";
import { ArrowLeft, LogOut, Trash2, Plus, AlertCircle, CheckCircle2, RotateCcw } from "lucide-react";

export interface DraftMerchantItem {
  draftId: string;
  businessLegalName: string;
  createdDate: string;
  status: string;
  brandName?: string;
  category?: string;
  step?: number;
}

interface DraftMerchantViewProps {
  onBack?: () => void;
  drafts?: DraftMerchantItem[];
  onResumeDraft?: (draft: DraftMerchantItem) => void;
  onDeleteDraft?: (draftId: string) => void;
  onNavigateToCreate?: () => void;
}

const defaultInitialDrafts: DraftMerchantItem[] = [
  {
    businessLegalName: "Ayush Acharya",
    draftId: "DRAFT-PT-20260616-309",
    createdDate: "16.06.2026",
    status: "Draft",
    brandName: "Ayush Enterprises",
    category: "UPI",
    step: 2
  }
];

export function DraftMerchantView({
  onBack,
  drafts: externalDrafts,
  onResumeDraft,
  onDeleteDraft,
  onNavigateToCreate
}: DraftMerchantViewProps) {
  // If externalDrafts is provided and has items, use it; otherwise use defaultInitialDrafts containing Ayush Acharya
  const [internalDrafts, setInternalDrafts] = useState<DraftMerchantItem[]>(() => {
    if (externalDrafts && externalDrafts.length > 0) {
      return externalDrafts;
    }
    return defaultInitialDrafts;
  });

  const [draftToDelete, setDraftToDelete] = useState<DraftMerchantItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [lastRemovedDraft, setLastRemovedDraft] = useState<DraftMerchantItem | null>(null);

  const drafts = externalDrafts && externalDrafts.length > 0 ? externalDrafts : internalDrafts;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleResume = (draft: DraftMerchantItem) => {
    showToast(`Resuming draft application for ${draft.businessLegalName} (${draft.draftId})...`);
    if (onResumeDraft) {
      onResumeDraft(draft);
    } else if (onNavigateToCreate) {
      onNavigateToCreate();
    }
  };

  const confirmDelete = () => {
    if (!draftToDelete) return;
    const item = draftToDelete;
    setLastRemovedDraft(item);

    if (onDeleteDraft) {
      onDeleteDraft(item.draftId);
    } else {
      setInternalDrafts((prev) => prev.filter((d) => d.draftId !== item.draftId));
    }

    setDraftToDelete(null);
    showToast(`Draft ${item.draftId} removed successfully.`);
  };

  const handleUndoRemove = () => {
    if (!lastRemovedDraft) return;
    setInternalDrafts((prev) => [lastRemovedDraft, ...prev]);
    setLastRemovedDraft(null);
    showToast(`Restored draft ${lastRemovedDraft.draftId}.`);
  };

  const handleAddSampleDraft = () => {
    if (drafts.length >= 5) {
      showToast("Maximum limit of 5 drafts has been reached.");
      return;
    }

    const sampleNames = [
      "Pratik Retailers Pvt Ltd",
      "Kalinga Supermart",
      "Green Valley Organics",
      "Apex Infotech Solutions"
    ];

    const nextIndex = drafts.length;
    const name = sampleNames[nextIndex % sampleNames.length];
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();

    const newDraft: DraftMerchantItem = {
      businessLegalName: name,
      draftId: `DRAFT-PT-${year}${month}${day}-${Math.floor(300 + Math.random() * 600)}`,
      createdDate: `${day}.${month}.${year}`,
      status: "Draft",
      brandName: name,
      category: "UPI",
      step: 1
    };

    setInternalDrafts((prev) => [newDraft, ...prev]);
    showToast(`Added new draft for ${name}. (${drafts.length + 1}/5)`);
  };

  return (
    <div className="bg-white min-h-[600px] p-6 sm:p-8 rounded-xl border border-gray-100 shadow-2xs select-none">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-[10000] bg-gray-900 text-white px-4 py-2.5 rounded-lg shadow-xl text-xs font-medium flex items-center space-x-3 animate-fade-in border border-gray-700">
          <CheckCircle2 className="w-4 h-4 text-[#447837] shrink-0" />
          <span>{toastMessage}</span>
          {lastRemovedDraft && (
            <button
              onClick={handleUndoRemove}
              className="text-[#D4E12C] underline hover:text-white font-semibold cursor-pointer ml-2 flex items-center space-x-1"
            >
              <RotateCcw className="w-3 h-3 inline" />
              <span>Undo</span>
            </button>
          )}
        </div>
      )}

      {/* Top Back Navigation Link */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            if (onBack) onBack();
          }}
          className="inline-flex items-center space-x-2 text-sm font-semibold text-gray-900 hover:text-gray-600 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-gray-900 stroke-[2.5]" />
          <span>Draft Merchant</span>
        </button>

        {/* Action Controls for Demo / Simulation */}
        <div className="flex items-center space-x-2">
          {drafts.length < 5 ? (
            <button
              onClick={handleAddSampleDraft}
              className="text-[11px] text-gray-600 hover:text-[#447837] border border-gray-200 hover:border-[#447837] px-2.5 py-1 rounded transition flex items-center space-x-1 cursor-pointer bg-gray-50 hover:bg-white"
              title="Add sample draft (up to 5 max)"
            >
              <Plus className="w-3 h-3 text-[#447837]" />
              <span>Add Draft ({drafts.length}/5)</span>
            </button>
          ) : (
            <span className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded font-medium">
              Draft Limit Reached (5/5)
            </span>
          )}

          {drafts.length === 0 && (
            <button
              onClick={() => setInternalDrafts(defaultInitialDrafts)}
              className="text-[11px] text-[#447837] hover:underline px-2 py-1 transition cursor-pointer"
            >
              Reset Default
            </button>
          )}
        </div>
      </div>

      {/* Decorative Accent Strip (matches TA brand pattern in screenshot) */}
      <div className="flex items-center space-x-1.5 mt-2">
        <div className="h-[3.5px] w-14 bg-[#D4E12C] rounded-full"></div>
        <div className="h-[3.5px] w-3.5 bg-[#447837] rounded-full"></div>
        <div className="h-[3.5px] w-1.5 bg-[#D4E12C] rounded-full"></div>
        <div className="h-[3.5px] w-1.5 bg-[#D4E12C] rounded-full"></div>
      </div>

      {/* Title & Max Drafts Subtitle */}
      <div className="mt-3">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Draft Merchant
        </h1>
        <p className="text-[13px] text-gray-500 font-normal mt-1">
          Note: The maximum number of allowed drafts has been set to 5.
        </p>
      </div>

      {/* Draft Merchant Table in TA Green Theme */}
      <div className="mt-6 border border-gray-200 rounded-none overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#447837] text-white text-[13.5px]">
                <th className="py-3 px-4 text-center font-normal border-r border-white/20 whitespace-nowrap w-[25%]">
                  Business Legal Name
                </th>
                <th className="py-3 px-4 text-center font-normal border-r border-white/20 whitespace-nowrap w-[25%]">
                  Draft ID
                </th>
                <th className="py-3 px-4 text-center font-normal border-r border-white/20 whitespace-nowrap w-[18%]">
                  Created Date
                </th>
                <th className="py-3 px-4 text-center font-normal border-r border-white/20 whitespace-nowrap w-[14%]">
                  Status
                </th>
                <th className="py-3 px-4 text-center font-normal whitespace-nowrap w-[18%]">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {drafts.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-16 text-center text-sm text-gray-500 font-normal"
                  >
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <p className="text-gray-500 text-sm">No draft merchants found.</p>
                      <button
                        onClick={handleAddSampleDraft}
                        className="px-4 py-1.5 bg-[#447837] text-white hover:bg-[#37632b] rounded text-xs font-medium cursor-pointer transition shadow-2xs"
                      >
                        + Create Sample Draft
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                drafts.map((draft) => (
                  <tr
                    key={draft.draftId}
                    className="border-b border-gray-200 bg-white hover:bg-gray-50/70 transition"
                  >
                    {/* Business Legal Name */}
                    <td className="py-3.5 px-4 text-center text-[13px] text-gray-800 border-r border-gray-200 font-normal">
                      {draft.businessLegalName}
                    </td>

                    {/* Draft ID */}
                    <td className="py-3.5 px-4 text-center text-[13px] text-gray-800 border-r border-gray-200 font-normal">
                      {draft.draftId}
                    </td>

                    {/* Created Date */}
                    <td className="py-3.5 px-4 text-center text-[13px] text-gray-800 border-r border-gray-200 font-normal">
                      {draft.createdDate}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 text-center border-r border-gray-200">
                      <span className="text-[#1D4ED8] font-bold text-[13px]">
                        {draft.status}
                      </span>
                    </td>

                    {/* Action Buttons */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center space-x-2.5">
                        {/* Resume Button in Green Theme */}
                        <button
                          onClick={() => handleResume(draft)}
                          className="px-3.5 py-1.5 rounded-[4px] border border-[#447837] text-[#447837] bg-white hover:bg-[#447837]/10 text-xs font-medium inline-flex items-center space-x-1.5 transition cursor-pointer shadow-2xs"
                          title="Resume Application"
                        >
                          <span>Resume</span>
                          <LogOut className="w-3.5 h-3.5 text-[#447837] stroke-[2]" />
                        </button>

                        {/* Remove Button */}
                        <button
                          onClick={() => setDraftToDelete(draft)}
                          className="px-3.5 py-1.5 rounded-[4px] border border-red-200 text-red-600 bg-white hover:bg-red-50 text-xs font-medium inline-flex items-center space-x-1.5 transition cursor-pointer shadow-2xs"
                          title="Remove Draft"
                        >
                          <span>Remove</span>
                          <Trash2 className="w-3.5 h-3.5 text-red-600 stroke-[2]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal for Removing Draft */}
      {draftToDelete && (
        <div className="fixed inset-0 z-[100000] bg-black/40 backdrop-blur-[1px] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-gray-200 space-y-4 animate-scale-in">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0 text-red-600">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-gray-900">Remove Draft Merchant</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Are you sure you want to remove the draft application for{" "}
                  <span className="font-semibold text-gray-800">{draftToDelete.businessLegalName}</span>{" "}
                  (<span className="font-mono text-gray-700">{draftToDelete.draftId}</span>)?
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2.5 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setDraftToDelete(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg text-xs font-medium transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold transition cursor-pointer shadow-2xs"
              >
                Yes, Remove Draft
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
