// start of frontend/components/forms/FileUpload.tsx
'use client';
import React, { useState } from 'react';
import IconX from '@/components/icon/icon-x';

interface FileUploadProps {
    label?: string;
    multiple?: boolean;
    value?: any[];
    onChange?: (imageList: any[]) => void;
    maxNumber?: number;
    maxFileSize?: number;
    required?: boolean;
    error?: string;
    accept?: string;
    className?: string;
    showPreview?: boolean;
    previewClassName?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
    label = 'Upload',
    multiple = false,
    value = [],
    onChange,
    maxNumber = 10,
    maxFileSize = 10485760, // 10MB default
    required = false,
    error,
    accept = 'image/*',
    className = '',
    showPreview = true,
    previewClassName = ''
}) => {
    const [dragActive, setDragActive] = useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFiles(e.dataTransfer.files);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFiles(e.target.files);
        }
    };

    const handleFiles = (files: FileList) => {
        const validFiles = Array.from(files).filter(file => {
            // Check file size
            if (file.size > maxFileSize) {
                console.error(`File ${file.name} is too large`);
                return false;
            }
            // Check file type
            if (!file.type.match(accept.replace('/*', ''))) {
                console.error(`File ${file.name} is not an accepted type`);
                return false;
            }
            return true;
        });

        if (!multiple) {
            onChange?.(validFiles.slice(0, 1));
        } else {
            const newFiles = [...(value || []), ...validFiles].slice(0, maxNumber);
            onChange?.(newFiles);
        }
    };

    const handleClearAll = () => {
        onChange?.([]);
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    const handleRemoveFile = (index: number) => {
        const newFiles = (value || []).filter((_, i) => i !== index);
        onChange?.(newFiles);
    };

    return (
        <div className={`custom-file-container ${className}`}>
            {/* Header dengan Label dan Clear Button */}
            <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium">
                    {label}
                    {required && <span className="text-danger">*</span>}
                </label>
                {Array.isArray(value) && value.length > 0 && (
                    <button
                        type="button"
                        onClick={handleClearAll}
                        className="text-gray-400 hover:text-danger"
                        title="Clear All"
                    >
                        <IconX className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Drop Zone */}
            <div
                className={`border-2 border-dashed rounded-lg p-4 text-center 
                    ${dragActive ? 'border-primary bg-primary/10' : 'border-gray-200 hover:border-primary/70'}
                    dark:border-gray-700 dark:hover:border-primary/70 transition-colors`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <input
                    ref={inputRef}
                    type="file"
                    multiple={multiple}
                    accept={accept}
                    onChange={handleChange}
                    className="hidden"
                />

                <div className="flex flex-col items-center space-y-2" onClick={() => inputRef.current?.click()}>
                    <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Click to upload</span> or drag and drop
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        {accept.replace('image/*', 'PNG, JPG, GIF up to 10MB')}
                    </p>
                </div>
            </div>

            {/* Preview Area */}
            {showPreview && Array.isArray(value) && value.length > 0 && (
                <div className={`grid gap-4 mt-4 ${multiple ? 'sm:grid-cols-3 grid-cols-1' : 'grid-cols-1'} ${previewClassName}`}>
                    {value.map((file: File, index: number) => (
                        <div key={index} className="relative group">
                            <img
                                src={URL.createObjectURL(file)}
                                alt={`preview ${index + 1}`}
                                className="w-full rounded-lg object-cover shadow-sm h-48"
                                onLoad={() => URL.revokeObjectURL(URL.createObjectURL(file))}
                            />
                            <button
                                type="button"
                                onClick={() => handleRemoveFile(index)}
                                className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 text-gray-700 
                                    opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                            >
                                <IconX className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Error Message */}
            {error && (
                <p className="mt-1 text-sm text-danger">
                    {error}
                </p>
            )}
        </div>
    );
};

export default FileUpload;
// end of frontend/components/forms/FileUpload.tsx