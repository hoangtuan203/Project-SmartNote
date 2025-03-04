import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import { useEffect, useState } from 'react';

const TiptapEditor = () => {
    const [isReady, setIsReady] = useState(false);
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            TextStyle,
            Color.configure({ types: ['textStyle'] }) // Cho phép đổi màu chữ
        ],
    });

    useEffect(() => {
        if (editor?.isInitialized) {
            setIsReady(true);
            console.log("Editor đã khởi tạo!");
        }
    }, [editor]);

    if (!editor || !isReady) {
        return <p>Loading editor...</p>;
    }

    return (
        <div className="editor-container p-4 border rounded-md shadow-md bg-white">
            {editor && (
                <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
                    <div className="flex space-x-2 p-2 bg-gray-100 border rounded-md shadow-md">
                        {/* In đậm */}
                        <button 
                            onClick={() => editor.chain().focus().toggleBold().run()} 
                            className={`px-2 py-1 ${editor.isActive('bold') ? 'bg-gray-300' : ''}`}
                        >
                            B
                        </button>

                        {/* In nghiêng */}
                        <button 
                            onClick={() => editor.chain().focus().toggleItalic().run()} 
                            className={`px-2 py-1 ${editor.isActive('italic') ? 'bg-gray-300' : ''}`}
                        >
                            I
                        </button>

                        {/* Gạch dưới */}
                        <button 
                            onClick={() => editor.chain().focus().toggleUnderline().run()} 
                            className={`px-2 py-1 ${editor.isActive('underline') ? 'bg-gray-300' : ''}`}
                        >
                            U
                        </button>

                        {/* Đổi màu chữ */}
                        <input 
                            type="color" 
                            onChange={(e) => editor.chain().focus().setColor(e.target.value).run()} 
                        />
                    </div>
                </BubbleMenu>
            )}

            <EditorContent editor={editor} className="p-2 border rounded-md" />
        </div>
    );
};

export default TiptapEditor;
