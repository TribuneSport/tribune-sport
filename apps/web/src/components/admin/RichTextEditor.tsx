"use client";

import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function RichTextEditor({
  value,
  onChange,
}: Props) {
  const editor = useEditor({
    extensions: [StarterKit],

    content: value,

    immediatelyRender: false,

    editorProps: {
      attributes: {
        class:
          "prose prose-lg max-w-none min-h-[500px] rounded-lg border border-gray-300 bg-white p-6 focus:outline-none",
      },
    },

    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;

    if (editor.getHTML() !== value) {
      editor.commands.setContent(value, false);
    }
  }, [value, editor]);

  if (!editor) return null;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 rounded-lg border bg-gray-50 p-3">
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleBold().run()
          }
          className={`rounded px-3 py-2 ${
            editor.isActive("bold")
              ? "bg-blue-600 text-white"
              : "bg-white"
          }`}
        >
          Gras
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleItalic().run()
          }
          className={`rounded px-3 py-2 ${
            editor.isActive("italic")
              ? "bg-blue-600 text-white"
              : "bg-white"
          }`}
        >
          Italique
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleStrike().run()
          }
          className={`rounded px-3 py-2 ${
            editor.isActive("strike")
              ? "bg-blue-600 text-white"
              : "bg-white"
          }`}
        >
          Barré
        </button>

        <button
          type="button"
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleHeading({ level: 1 })
              .run()
          }
          className={`rounded px-3 py-2 ${
            editor.isActive("heading", {
              level: 1,
            })
              ? "bg-blue-600 text-white"
              : "bg-white"
          }`}
        >
          H1
        </button>

        <button
          type="button"
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleHeading({ level: 2 })
              .run()
          }
          className={`rounded px-3 py-2 ${
            editor.isActive("heading", {
              level: 2,
            })
              ? "bg-blue-600 text-white"
              : "bg-white"
          }`}
        >
          H2
        </button>

        <button
          type="button"
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleHeading({ level: 3 })
              .run()
          }
          className={`rounded px-3 py-2 ${
            editor.isActive("heading", {
              level: 3,
            })
              ? "bg-blue-600 text-white"
              : "bg-white"
          }`}
        >
          H3
        </button>

        <button
          type="button"
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleBulletList()
              .run()
          }
          className={`rounded px-3 py-2 ${
            editor.isActive("bulletList")
              ? "bg-blue-600 text-white"
              : "bg-white"
          }`}
        >
          Liste
        </button>

        <button
          type="button"
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleOrderedList()
              .run()
          }
          className={`rounded px-3 py-2 ${
            editor.isActive("orderedList")
              ? "bg-blue-600 text-white"
              : "bg-white"
          }`}
        >
          Numérotation
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleBlockquote().run()
          }
          className={`rounded px-3 py-2 ${
            editor.isActive("blockquote")
              ? "bg-blue-600 text-white"
              : "bg-white"
          }`}
        >
          Citation
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().setHorizontalRule().run()
          }
          className="rounded bg-white px-3 py-2"
        >
          Séparateur
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().undo().run()
          }
          className="rounded bg-white px-3 py-2"
        >
          Annuler
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().redo().run()
          }
          className="rounded bg-white px-3 py-2"
        >
          Rétablir
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().clearNodes().run()
          }
          className="rounded bg-white px-3 py-2"
        >
          Effacer le format
        </button>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}