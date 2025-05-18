import React, { useEffect, useRef } from 'react';
import EditorJS from '@editorjs/editorjs';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const DraggableBlock = ({ id, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
};

const EditorWithDragAndDrop = () => {
  const editorRef = useRef(null);
  const [blocks, setBlocks] = React.useState([]);

  useEffect(() => {
    const editor = new EditorJS({
      holder: 'editorjs',
      onChange: async () => {
        const savedData = await editor.save();
        setBlocks(savedData.blocks);
      },
      // Add your tools here
    });

    editorRef.current = editor;

    return () => {
      editor.destroy();
    };
  }, []);

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setBlocks((blocks) => {
        const oldIndex = blocks.findIndex((block) => block.id === active.id);
        const newIndex = blocks.findIndex((block) => block.id === over.id);

        return arrayMove(blocks, oldIndex, newIndex);
      });
    }
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={blocks.map((block) => block.id)} strategy={verticalListSortingStrategy}>
        {blocks.map((block) => (
          <DraggableBlock key={block.id} id={block.id}>
            {/* Render the block content here */}
            <div>{block.data.text}</div>
          </DraggableBlock>
        ))}
      </SortableContext>
      <div id="editorjs" />
    </DndContext>
  );
};

export default EditorWithDragAndDrop; 