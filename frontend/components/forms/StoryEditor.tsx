// start of frontend/components/forms/StoryEditor.tsx
'use client';
import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface StoryEditorProps {
    value: string;
    onChange: (value: string) => void;
    label?: string;
    required?: boolean;
    error?: string;
    placeholder?: string;
}

const StoryEditor: React.FC<StoryEditorProps> = ({
    value,
    onChange,
    label,
    required = false,
    error,
    placeholder = 'Tulis cerita atau sejarah di sini...'
}) => {
    // Konfigurasi toolbar yang relevan
    const modules = {
        toolbar: [
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['clean']
        ]
    };

    // Format yang diizinkan
    const formats = [
        'header',
        'bold', 'italic', 'underline',
        'list', 'bullet'
    ];

    return (
        <div className="form-field">
            {label && (
                <label className="mb-1 block text-sm font-medium">
                    {label}
                    {required && <span className="text-danger">*</span>}
                </label>
            )}

            <div className={`
                relative rounded-lg border transition-all
                ${error ? 'border-danger' : 'border-[#e0e6ed] hover:border-primary focus-within:border-primary dark:border-[#17263c]'}
            `}>
                <ReactQuill
                    theme="snow"
                    value={value}
                    onChange={onChange}
                    modules={modules}
                    formats={formats}
                    placeholder={placeholder}
                    className="bg-white dark:bg-[#1b2e4b]"
                />
            </div>

            {error && (
                <p className="mt-1 text-sm text-danger">
                    {error}
                </p>
            )}
        </div>
    );
};

export default StoryEditor;
// end of frontend/components/forms/StoryEditor.tsx