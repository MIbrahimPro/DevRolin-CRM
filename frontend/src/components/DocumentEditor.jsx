import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine"; // Change this
import "@blocknote/mantine/style.css"; // Change this
import "@blocknote/core/fonts/inter.css";
import { useState } from 'react';

export default function DocumentEditor({ documentId, initialContent, onSave }) {
    // 1. useBlockNote is replaced by useCreateBlockNote
    const editor = useCreateBlockNote({
        initialContent: initialContent || undefined,
    });

    // 2. Monitoring changes is now handled via the onChange prop in BlockNoteView
    // or via the editor's event listeners.
    const handleChange = () => {
        if (onSave) {
            onSave(editor.document);
        }
    };

    return (
        <div className="min-h-[500px] border rounded-lg p-4">
            <BlockNoteView
                editor={editor}
                onChange={handleChange}
            />
        </div>
    );
}