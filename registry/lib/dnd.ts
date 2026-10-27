type Identifier = string | number;
export interface SortableEntry {
  id: Identifier;
  label: string;
  disabled?: boolean;
}
export interface KanbanColumn {
  id: string;
  title: string;
  items: SortableEntry[];
}
