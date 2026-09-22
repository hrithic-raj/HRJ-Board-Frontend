import { Board, Item } from '@/types';

const sanitizeCell = (value: unknown): string =>
  String(value ?? '')
    .replace(/\t/g, ' ')
    .replace(/\r?\n/g, ' ')
    .trim();

/**
 * Builds a tab-separated table of every item across every board, ready to be
 * pasted directly into Google Sheets, Excel, or any spreadsheet - each tab
 * becomes a new column and each newline becomes a new row.
 */
export const buildSheetsTSV = (boards: Board[], items: Item[]): string => {
  const orderedBoards = [...boards].sort((a, b) => a.order - b.order);
  const boardTitleById = new Map(orderedBoards.map((b) => [b._id, b.title]));
  const boardOrderById = new Map(orderedBoards.map((b, idx) => [b._id, idx]));

  const header = ['Board', 'Title', 'Description', 'Priority', 'Assignee', 'Due Date', 'Created By', 'Created At'];

  const rows = [...items]
    .sort((a, b) => {
      const boardDiff = (boardOrderById.get(a.board) ?? 0) - (boardOrderById.get(b.board) ?? 0);
      return boardDiff !== 0 ? boardDiff : a.order - b.order;
    })
    .map((item) =>
      [
        boardTitleById.get(item.board) || '',
        item.title,
        item.description || '',
        item.priority,
        item.assignedTo?.name || 'Unassigned',
        item.dueDate ? new Date(item.dueDate).toLocaleDateString() : '',
        item.createdBy?.name || '',
        item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '',
      ].map(sanitizeCell)
    );

  return [header, ...rows].map((row) => row.join('\t')).join('\n');
};
