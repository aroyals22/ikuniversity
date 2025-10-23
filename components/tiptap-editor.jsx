'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Bold, Italic, List, ListOrdered } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const TiptapEditor = ({ content, onChange, placeholder }) => {
	const editor = useEditor({
		extensions: [
			StarterKit,
			Placeholder.configure({
				placeholder: placeholder || 'Write something...',
			}),
		],
		content: content || '',
		editorProps: {
			attributes: {
				class:
					'prose prose-sm max-w-none focus:outline-none min-h-[150px] p-4 border rounded-md',
			},
		},
		onUpdate: ({ editor }) => {
			onChange(editor.getHTML());
		},
	});

	if (!editor) {
		return null;
	}

	return (
		<div className='border rounded-md'>
			{/* Toolbar */}
			<div className='flex items-center gap-2 p-2 border-b bg-gray-50'>
				<Button
					type='button'
					variant='ghost'
					size='sm'
					onClick={() => editor.chain().focus().toggleBold().run()}
					className={editor.isActive('bold') ? 'bg-gray-200' : ''}
				>
					<Bold className='h-4 w-4' />
				</Button>
				<Button
					type='button'
					variant='ghost'
					size='sm'
					onClick={() => editor.chain().focus().toggleItalic().run()}
					className={editor.isActive('italic') ? 'bg-gray-200' : ''}
				>
					<Italic className='h-4 w-4' />
				</Button>
				<Button
					type='button'
					variant='ghost'
					size='sm'
					onClick={() => editor.chain().focus().toggleBulletList().run()}
					className={editor.isActive('bulletList') ? 'bg-gray-200' : ''}
				>
					<List className='h-4 w-4' />
				</Button>
				<Button
					type='button'
					variant='ghost'
					size='sm'
					onClick={() => editor.chain().focus().toggleOrderedList().run()}
					className={editor.isActive('orderedList') ? 'bg-gray-200' : ''}
				>
					<ListOrdered className='h-4 w-4' />
				</Button>
			</div>

			{/* Editor Content */}
			<EditorContent editor={editor} />
		</div>
	);
};
