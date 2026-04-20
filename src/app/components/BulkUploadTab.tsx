import React, { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  X,
  Download,
  Info,
  FileText,
  Loader2,
  Trash2,
} from "lucide-react";

const ff = "'Plus Jakarta Sans', sans-serif";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  status: "uploading" | "processing" | "completed" | "error";
  progress: number;
  rowCount?: number;
  errorMessage?: string;
}

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const BulkUploadTab: React.FC = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const simulateUpload = useCallback((file: File) => {
    const id = `file-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const newFile: UploadedFile = {
      id,
      name: file.name,
      size: file.size,
      status: "uploading",
      progress: 0,
    };

    setFiles((prev) => [...prev, newFile]);

    /* Simulate upload progress */
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 25 + 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setFiles((prev) =>
          prev.map((f) =>
            f.id === id ? { ...f, progress: 100, status: "processing" } : f
          )
        );
        /* Simulate processing */
        setTimeout(() => {
          const success = Math.random() > 0.15;
          setFiles((prev) =>
            prev.map((f) =>
              f.id === id
                ? success
                  ? {
                      ...f,
                      status: "completed",
                      rowCount: Math.floor(Math.random() * 200) + 10,
                    }
                  : {
                      ...f,
                      status: "error",
                      errorMessage: "Invalid file format or corrupted data",
                    }
                : f
            )
          );
        }, 1500 + Math.random() * 1000);
      } else {
        setFiles((prev) =>
          prev.map((f) => (f.id === id ? { ...f, progress } : f))
        );
      }
    }, 300);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const droppedFiles = Array.from(e.dataTransfer.files);
      droppedFiles.forEach(simulateUpload);
    },
    [simulateUpload]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = Array.from(e.target.files || []);
      selectedFiles.forEach(simulateUpload);
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    [simulateUpload]
  );

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const completedCount = files.filter((f) => f.status === "completed").length;
  const errorCount = files.filter((f) => f.status === "error").length;
  const processingCount = files.filter(
    (f) => f.status === "uploading" || f.status === "processing"
  ).length;

  return (
    <div className="flex flex-col" style={{ gap: 20, padding: "20px 24px" }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col" style={{ gap: 4 }}>
          <span
            style={{
              fontFamily: ff,
              fontSize: "var(--text-lg)",
              fontWeight: 600,
              color: "var(--text-heading)",
              lineHeight: 1.4,
              letterSpacing: "0.4%",
            }}
          >
            Bulk Upload
          </span>
          <span
            style={{
              fontFamily: ff,
              fontSize: "var(--text-sm)",
              fontWeight: "var(--font-weight-normal)",
              color: "var(--text-muted-themed)",
              lineHeight: 1.4,
              letterSpacing: "0.4%",
            }}
          >
            Upload CSV or Excel files to create multiple cases at once
          </span>
        </div>

        {/* Download Template */}
        <button
          className="flex items-center cursor-pointer"
          style={{
            height: 36,
            padding: "0 14px",
            gap: 6,
            borderRadius: "var(--radius)",
            backgroundColor: "var(--surface-card)",
            border: "1px solid var(--border-default)",
            fontFamily: ff,
            fontSize: "var(--text-sm)",
            fontWeight: "var(--font-weight-medium)",
            color: "var(--text-body)",
            lineHeight: 1.4,
            letterSpacing: "0.4%",
            transition: "all 0.15s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "var(--surface-hover)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "var(--surface-card)";
          }}
        >
          <Download style={{ width: 14, height: 14 }} />
          Download Template
        </button>
      </div>

      {/* Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className="flex flex-col items-center justify-center cursor-pointer"
        style={{
          padding: "48px 24px",
          borderRadius: "var(--radius)",
          border: `2px dashed ${isDragging ? "var(--primary)" : "var(--border-default)"}`,
          backgroundColor: isDragging
            ? "color-mix(in srgb, var(--primary) 4%, transparent)"
            : "var(--surface-inset-subtle)",
          transition: "all 0.2s ease",
          gap: 12,
        }}
      >
        <div
          className="flex items-center justify-center"
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            backgroundColor: isDragging
              ? "color-mix(in srgb, var(--primary) 12%, transparent)"
              : "var(--icon-box-bg)",
            color: isDragging ? "var(--primary)" : "var(--text-muted-themed)",
            transition: "all 0.2s ease",
          }}
        >
          <Upload style={{ width: 22, height: 22 }} />
        </div>

        <div className="flex flex-col items-center" style={{ gap: 4 }}>
          <span
            style={{
              fontFamily: ff,
              fontSize: "var(--text-md)",
              fontWeight: 600,
              color: "var(--text-heading)",
              lineHeight: 1.4,
              letterSpacing: "0.4%",
            }}
          >
            {isDragging ? "Drop files here" : "Drag & drop files here"}
          </span>
          <span
            style={{
              fontFamily: ff,
              fontSize: "var(--text-sm)",
              fontWeight: "var(--font-weight-normal)",
              color: "var(--text-muted-themed)",
              lineHeight: 1.4,
              letterSpacing: "0.4%",
            }}
          >
            or{" "}
            <span
              style={{
                color: "var(--primary)",
                fontWeight: "var(--font-weight-medium)",
              }}
            >
              browse files
            </span>{" "}
            from your computer
          </span>
        </div>

        <div className="flex items-center" style={{ gap: 16, marginTop: 4 }}>
          {[
            { icon: FileSpreadsheet, label: ".CSV" },
            { icon: FileSpreadsheet, label: ".XLSX" },
            { icon: FileText, label: ".XLS" },
          ].map((t) => (
            <span
              key={t.label}
              className="flex items-center"
              style={{
                gap: 4,
                fontFamily: ff,
                fontSize: "var(--text-xs)",
                fontWeight: "var(--font-weight-medium)",
                color: "var(--text-muted-themed)",
                backgroundColor: "var(--surface-card)",
                border: "1px solid var(--border-subtle)",
                borderRadius: 999,
                padding: "3px 10px",
                lineHeight: 1.4,
                letterSpacing: "0.4%",
              }}
            >
              <t.icon style={{ width: 11, height: 11 }} />
              {t.label}
            </span>
          ))}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          multiple
          onChange={handleFileSelect}
          style={{ display: "none" }}
        />
      </div>

      {/* Info banner */}
      <div
        className="flex items-start"
        style={{
          padding: "12px 16px",
          borderRadius: "var(--radius)",
          backgroundColor: "var(--info-50)",
          border: "1px solid var(--info-200)",
          gap: 10,
        }}
      >
        <Info
          className="shrink-0"
          style={{
            width: 16,
            height: 16,
            color: "var(--info-600)",
            marginTop: 1,
          }}
        />
        <div className="flex flex-col" style={{ gap: 4 }}>
          <span
            style={{
              fontFamily: ff,
              fontSize: "var(--text-sm)",
              fontWeight: "var(--font-weight-medium)",
              color: "var(--info-800)",
              lineHeight: 1.4,
              letterSpacing: "0.4%",
            }}
          >
            File Requirements
          </span>
          <span
            style={{
              fontFamily: ff,
              fontSize: "var(--text-sm)",
              fontWeight: "var(--font-weight-normal)",
              color: "var(--info-600)",
              lineHeight: 1.6,
              letterSpacing: "0.4%",
            }}
          >
            Each row should contain: Company Name, CIN, PAN, Industry,
            Loan Amount, and Purpose. Maximum 500 rows per file. Download the
            template for the correct format.
          </span>
        </div>
      </div>

      {/* Upload Stats */}
      {files.length > 0 && (
        <div className="flex items-center" style={{ gap: 16 }}>
          <span
            style={{
              fontFamily: ff,
              fontSize: "var(--text-base)",
              fontWeight: 600,
              color: "var(--text-heading)",
              lineHeight: 1.4,
              letterSpacing: "0.4%",
            }}
          >
            Uploaded Files ({files.length})
          </span>
          <div className="flex items-center" style={{ gap: 12, marginLeft: "auto" }}>
            {completedCount > 0 && (
              <span
                className="flex items-center"
                style={{
                  gap: 4,
                  fontFamily: ff,
                  fontSize: "var(--text-xs)",
                  fontWeight: "var(--font-weight-medium)",
                  color: "var(--success-700)",
                  backgroundColor: "var(--success-50)",
                  borderRadius: 999,
                  padding: "3px 10px",
                  lineHeight: 1.4,
                  letterSpacing: "0.4%",
                }}
              >
                <CheckCircle2 style={{ width: 11, height: 11 }} />
                {completedCount} completed
              </span>
            )}
            {processingCount > 0 && (
              <span
                className="flex items-center"
                style={{
                  gap: 4,
                  fontFamily: ff,
                  fontSize: "var(--text-xs)",
                  fontWeight: "var(--font-weight-medium)",
                  color: "var(--info-600)",
                  backgroundColor: "var(--info-50)",
                  borderRadius: 999,
                  padding: "3px 10px",
                  lineHeight: 1.4,
                  letterSpacing: "0.4%",
                }}
              >
                <Loader2
                  style={{
                    width: 11,
                    height: 11,
                    animation: "spin 1s linear infinite",
                  }}
                />
                {processingCount} processing
              </span>
            )}
            {errorCount > 0 && (
              <span
                className="flex items-center"
                style={{
                  gap: 4,
                  fontFamily: ff,
                  fontSize: "var(--text-xs)",
                  fontWeight: "var(--font-weight-medium)",
                  color: "var(--destructive-700)",
                  backgroundColor: "color-mix(in srgb, var(--destructive-500) 6%, transparent)",
                  borderRadius: 999,
                  padding: "3px 10px",
                  lineHeight: 1.4,
                  letterSpacing: "0.4%",
                }}
              >
                <AlertCircle style={{ width: 11, height: 11 }} />
                {errorCount} failed
              </span>
            )}
          </div>
        </div>
      )}

      {/* File List */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col"
            style={{
              borderRadius: "var(--radius)",
              border: "1px solid var(--border-subtle)",
              backgroundColor: "var(--surface-card)",
              boxShadow: "var(--shadow-card)",
              overflow: "hidden",
            }}
          >
            {files.map((file, idx) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center"
                style={{
                  padding: "14px 18px",
                  gap: 14,
                  borderBottom:
                    idx < files.length - 1
                      ? "1px solid var(--border-subtle)"
                      : "none",
                }}
              >
                {/* File icon */}
                <div
                  className="shrink-0 flex items-center justify-center"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    backgroundColor:
                      file.status === "completed"
                        ? "var(--success-50)"
                        : file.status === "error"
                          ? "color-mix(in srgb, var(--destructive-500) 8%, transparent)"
                          : "var(--icon-box-bg)",
                    color:
                      file.status === "completed"
                        ? "var(--success-500)"
                        : file.status === "error"
                          ? "var(--destructive-500)"
                          : "var(--text-muted-themed)",
                  }}
                >
                  {file.status === "completed" ? (
                    <CheckCircle2 style={{ width: 18, height: 18 }} />
                  ) : file.status === "error" ? (
                    <AlertCircle style={{ width: 18, height: 18 }} />
                  ) : (
                    <FileSpreadsheet style={{ width: 18, height: 18 }} />
                  )}
                </div>

                {/* File info */}
                <div className="flex-1 flex flex-col min-w-0" style={{ gap: 4 }}>
                  <div className="flex items-center" style={{ gap: 8 }}>
                    <span
                      className="truncate"
                      style={{
                        fontFamily: ff,
                        fontSize: "var(--text-sm)",
                        fontWeight: "var(--font-weight-medium)",
                        color: "var(--text-heading)",
                        lineHeight: 1.4,
                        letterSpacing: "0.4%",
                      }}
                    >
                      {file.name}
                    </span>
                    <span
                      style={{
                        fontFamily: ff,
                        fontSize: "var(--text-xs)",
                        fontWeight: "var(--font-weight-normal)",
                        color: "var(--text-muted-themed)",
                        lineHeight: 1.4,
                        letterSpacing: "0.4%",
                      }}
                    >
                      {formatFileSize(file.size)}
                    </span>
                  </div>

                  {/* Progress bar for uploading */}
                  {file.status === "uploading" && (
                    <div
                      style={{
                        width: "100%",
                        height: 4,
                        borderRadius: 999,
                        backgroundColor: "var(--surface-inset)",
                        overflow: "hidden",
                      }}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${file.progress}%` }}
                        transition={{ duration: 0.3 }}
                        style={{
                          height: "100%",
                          borderRadius: 999,
                          backgroundColor: "var(--primary)",
                        }}
                      />
                    </div>
                  )}

                  {/* Status text */}
                  {file.status === "processing" && (
                    <span
                      className="flex items-center"
                      style={{
                        gap: 4,
                        fontFamily: ff,
                        fontSize: "var(--text-xs)",
                        fontWeight: "var(--font-weight-normal)",
                        color: "var(--info-600)",
                        lineHeight: 1.4,
                        letterSpacing: "0.4%",
                      }}
                    >
                      <Loader2
                        style={{
                          width: 11,
                          height: 11,
                          animation: "spin 1s linear infinite",
                        }}
                      />
                      Processing file…
                    </span>
                  )}
                  {file.status === "completed" && file.rowCount && (
                    <span
                      style={{
                        fontFamily: ff,
                        fontSize: "var(--text-xs)",
                        fontWeight: "var(--font-weight-normal)",
                        color: "var(--success-700)",
                        lineHeight: 1.4,
                        letterSpacing: "0.4%",
                      }}
                    >
                      {file.rowCount} cases created successfully
                    </span>
                  )}
                  {file.status === "error" && (
                    <span
                      style={{
                        fontFamily: ff,
                        fontSize: "var(--text-xs)",
                        fontWeight: "var(--font-weight-normal)",
                        color: "var(--destructive-600)",
                        lineHeight: 1.4,
                        letterSpacing: "0.4%",
                      }}
                    >
                      {file.errorMessage}
                    </span>
                  )}
                </div>

                {/* Remove button */}
                <button
                  onClick={() => removeFile(file.id)}
                  className="shrink-0 flex items-center justify-center cursor-pointer"
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 6,
                    backgroundColor: "transparent",
                    border: "none",
                    color: "var(--text-muted-themed)",
                    transition: "all 0.1s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      "color-mix(in srgb, var(--destructive-500) 8%, transparent)";
                    e.currentTarget.style.color = "var(--destructive-500)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "var(--text-muted-themed)";
                  }}
                >
                  <Trash2 style={{ width: 14, height: 14 }} />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
