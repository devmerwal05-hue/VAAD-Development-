import { DragDropContext, Draggable, Droppable, type DropResult } from 'react-beautiful-dnd';

export default function DndGallery({
  items,
  onReorder,
  onRemove,
}: {
  items: string[];
  onReorder: (next: string[]) => void;
  onRemove: (index: number) => void;
}) {
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const next = Array.from(items);
    const [reorderedItem] = next.splice(result.source.index, 1);
    next.splice(result.destination.index, 0, reorderedItem);

    onReorder(next);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="gallery" direction="horizontal">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef} className="flex flex-wrap gap-2">
            {items.map((src, index) => (
              <Draggable key={src} draggableId={src} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="relative group"
                  >
                    <img src={src} alt="" className="h-16 w-24 rounded-lg border border-white/8 object-cover" loading="lazy" />
                    <button
                      type="button"
                      onClick={() => onRemove(index)}
                      className="absolute top-1 right-1 p-0.5 rounded bg-black/70 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
