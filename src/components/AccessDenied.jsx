import React, { useState } from "react";
import PartnerRequestForm from "./PartnerRequestForm";

export default function AccessDenied() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#0a1628] gap-6 px-4 py-8 overflow-y-auto">
      <div className="text-center">
        <p className="text-white/80 text-lg font-semibold">Prístup zamietnutý</p>
        <p className="text-white/40 text-sm mt-2 max-w-sm">Na túto sekciu nemáte oprávnenie. Ak chcete spolupracovať s Globeya, môžete požiadať o partnerský prístup.</p>
      </div>
      {!showForm ? (
        <button onClick={() => setShowForm(true)} className="text-[#c9a84c] text-sm hover:underline">
          Požiadať o registráciu ako partner
        </button>
      ) : (
        <PartnerRequestForm />
      )}
    </div>
  );
}