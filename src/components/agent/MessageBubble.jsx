import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { CheckCircle2, Loader2, XCircle, ChevronDown, ChevronUp } from "lucide-react";

function FunctionDisplay({ toolCall }) {
  const [expanded, setExpanded] = useState(false);
  const status = toolCall.status;
  const isFailed = status === "failed" || status === "error";
  const isPending = ["pending", "running", "in_progress"].includes(status);

  let icon;
  if (isFailed) icon = <XCircle className="w-3.5 h-3.5 text-red-400" />;
  else if (isPending) icon = <Loader2 className="w-3.5 h-3.5 text-amber-400 animate-spin" />;
  else icon = <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;

  const dp = toolCall.display_projection || {};
  const hideDetails = dp.hide_details && dp.details_redacted;
  const label = isPending
    ? (dp.active_label || "Spracúvam...")
    : isFailed
    ? (dp.error_label || "Chyba")
    : (dp.label || "Hotovo");

  let parsedArgs = toolCall.arguments_string;
  try { parsedArgs = JSON.parse(toolCall.arguments_string); } catch {}
  let parsedResults = toolCall.results;
  if (typeof parsedResults === "string") {
    try { parsedResults = JSON.parse(parsedResults); } catch {}
  }

  return (
    <div className="mt-2 text-xs">
      <button
        onClick={() => !hideDetails && setExpanded(!expanded)}
        className={`flex items-center gap-1.5 ${hideDetails ? "cursor-default" : "hover:text-white"}`}
      >
        {icon}
        <span className="text-white/50">{label}</span>
        {!hideDetails && (expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
      </button>
      {expanded && !hideDetails && (
        <div className="mt-1.5 space-y-1.5 pl-5">
          {parsedArgs && (
            <div>
              <p className="text-white/30 text-[10px] uppercase tracking-wide">Parametre:</p>
              <pre className="text-white/50 bg-black/30 rounded p-2 overflow-x-auto text-[10px]">{JSON.stringify(parsedArgs, null, 2)}</pre>
            </div>
          )}
          {parsedResults != null && (
            <div>
              <p className="text-white/30 text-[10px] uppercase tracking-wide">Výsledok:</p>
              <pre className="text-white/50 bg-black/30 rounded p-2 overflow-x-auto text-[10px]">{JSON.stringify(parsedResults, null, 2)}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function MessageBubble({ message }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${isUser ? "bg-[#c9a84c] text-black" : "bg-[#132039] text-white/90"}`}>
        {message.content && (
          isUser
            ? <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            : <div className="text-sm prose prose-sm prose-invert max-w-none"><ReactMarkdown>{message.content}</ReactMarkdown></div>
        )}
        {message.tool_calls?.map((tc, i) => <FunctionDisplay key={i} toolCall={tc} />)}
      </div>
    </div>
  );
}