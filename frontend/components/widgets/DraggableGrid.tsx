// start of frontend/components/widgets/DraggableGrid.tsx
'use client';
import React, { useState } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy
} from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';

interface DraggableGridProps {
    children: React.ReactNode[];
    onOrderChange?: (newOrder: number[]) => void;
}

const DraggableGrid: React.FC<DraggableGridProps> = ({ 
    children,
    onOrderChange 
}) => {
    const [items, setItems] = useState(
        children.map((_, index) => ({ id: `widget-${index}`, index }))
    );

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        
        if (!over) return;

        if (active.id !== over.id) {
            setItems((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);

                const newOrder = arrayMove(items, oldIndex, newIndex);
                onOrderChange?.(newOrder.map(item => item.index));
                return newOrder;
            });
        }
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext 
                items={items.map(item => item.id)}
                strategy={rectSortingStrategy}
            >
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                    {items.map((item) => (
                        <SortableItem key={item.id} id={item.id}>
                            {children[item.index]}
                        </SortableItem>
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    );
};

export default DraggableGrid;
// end of frontend/components/widgets/DraggableGrid.tsx