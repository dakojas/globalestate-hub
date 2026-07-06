import React, { useState, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { Upload, X, FileText, Image as ImageIcon, Loader2, Paperclip } from "lucide-react";

export default function AttachmentUploader({ attachments, onAdd, onRemove }) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFiles = async (fileList) => {
    const files = Array.from(fileList);
    if (files.length === 0) return;
    setUploading(true);
    try {
      for (const file of files) {
        const { file_url } = await base44.integrations.Core.UploadFile({ file });
        onAdd({ name: file.name, url: file_url, size: file.size, type: file.type });
      }
    } catch (e) {
      console.error("Upload failed", e);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-3">
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleFiles(e.dataTransfer.files);
        }}
        className="border-2 border-dashed border-gray-300 rounded-xl p-5 text-center cursor-pointer hover:border-[#c9a84c] hover:bg-[#c9a84c]/5 transition-all duration-200"
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-2 py-2">
            <Loader2 className="w-6 h-6 text-[#c9a84c] animate-spin" />
            <p className="text-sm text-gray-500">Nahrávam...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-2">
            <div className="w-10 h-10 rounded-full bg-[#c9a84c]/10 flex items-center justify-center">
              <Upload className="w-5 h-5 text-[#c9a84c]" />
            </div>
            <p className="text-sm font-medium text-gray-700">
              Kliknite alebo pretiahnite súbory sem
            </p>
            <p className="text-xs text-gray-400">Fotky, PDF, dokumenty</p>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          accept="image/*,.pdf,.doc,.docx"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {attachments.length > 0 && (
        <div className="space-y-2">
          {attachments.map((att, idx) => {
            const isImage = att.type?.startsWith("image/");
            return (
              <div key={idx} className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-lg border border-gray-100">
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
                  {isImage ? <ImageIcon className="w-4 h-4 text-[#c9a84c]" /> : <FileText className="w-4 h-4 text-gray-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{att.name}</p>
                  <p className="text-xs text-gray-400">{formatSize(att.size)}</p>
                </div>
                <button
                  onClick={() => onRemove(idx)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            );
          })}
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Paperclip className="w-3 h-3" />
            {attachments.length} {attachments.length === 1 ? "príloha" : "prílohy"} — budú pridané do emailu
          </div>
        </div>
      )}
    </div>
  );
}