import React from "react";
import { Camera } from "lucide-react";
import type { UploadedFile } from "../types/rider";

interface FileUploadAreaProps {
  type: "pickup" | "delivery";
  fileRef: React.RefObject<HTMLInputElement>;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  title: string;
  description: string;
  uploadedFiles: UploadedFile[];
}

const FileUploadArea: React.FC<FileUploadAreaProps> = ({
  type,
  fileRef,
  onUpload,
  title,
  description,
  uploadedFiles,
}) => {
  const uploadedFile = uploadedFiles.find((f) => f.type === type);

  return (
    <div
      className="border-2 border-dashed border-[#b28341] rounded-lg p-6 md:p-8 text-center cursor-pointer hover:bg-[#f9f6ed] dark:hover:bg-[#59382a] transition-colors"
      onClick={() => fileRef.current?.click()}
    >
      {uploadedFile ? (
        <div className="space-y-3">
          <img
            src={uploadedFile.preview}
            alt="Uploaded"
            className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg mx-auto"
          />
          <p className="text-green-600 font-medium text-sm md:text-base">
            Photo uploaded successfully!
          </p>
        </div>
      ) : (
        <>
          <Camera className="w-10 h-10 md:w-12 md:h-12 text-[#b28341] mx-auto mb-3" />
          <p className="font-medium text-sm md:text-base">{title}</p>
          <p className="text-xs md:text-sm text-[#996936] dark:text-[#e1d0a7]">
            {description}
          </p>
        </>
      )}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={onUpload}
      />
    </div>
  );
};

export default FileUploadArea;
