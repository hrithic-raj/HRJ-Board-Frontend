'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import api, { getErrorMessage } from '@/lib/api';
import { getSocket, disconnectSocket } from '@/lib/socket';
import { Board, Item, Project, ProjectMember } from '@/types';
import Navbar from '@/components/Navbar';
import Loader from '@/components/Loader';
import BoardColumn from '@/components/BoardColumn';
import ItemModal from '@/components/ItemModal';
import MembersBar from '@/components/MembersBar';
import ConfirmDialog from '@/components/ConfirmDialog';

export default function ProjectBoardPage() {
  const { id: projectId } = useParams<{ id: string }>();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [project, setProject] = useState<Project | null>(null);
  const [myRole, setMyRole] = useState<'owner' | 'member' | null>(null);
  const [boards, setBoards] = useState<Board[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [addingBoard, setAddingBoard] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState('');

  const [itemModal, setItemModal] = useState<{ mode: 'create' | 'edit'; boardId: string; item?: Item } | null>(
    null
  );
  const [deleteBoardTarget, setDeleteBoardTarget] = useState<Board | null>(null);

  const boardsRef = useRef(boards);
  boardsRef.current = boards;

  // ---- Redirect unauthenticated users ----
  useEffect(() => {
    if (!authLoading && !user) router.replace(`/login?redirect=/projects/${projectId}`);
  }, [authLoading, user, projectId, router]);

  // ---- Initial data load ----
  const loadAll = useCallback(async () => {
    try {
      const [projectRes, boardsRes, itemsRes, membersRes] = await Promise.all([
        api.get(`/projects/${projectId}`),
        api.get(`/boards/project/${projectId}`),
        api.get(`/items/project/${projectId}`),
        api.get(`/projects/${projectId}/members`),
      ]);
      setProject(projectRes.data.project);
      setMyRole(projectRes.data.myRole);
      setBoards(boardsRes.data.boards);
      setItems(itemsRes.data.items);
      setMembers(membersRes.data.members);
    } catch (err) {
      setLoadError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    if (!user) return;
    loadAll();
  }, [user, loadAll]);

  // ---- Real-time socket wiring ----
  useEffect(() => {
    if (!user || !projectId) return;

    const socket = getSocket();
    socket.emit('project:join', projectId);

    const onBoardCreated = ({ board }: { board: Board }) =>
      setBoards((prev) => (prev.some((b) => b._id === board._id) ? prev : [...prev, board]));

    const onBoardUpdated = ({ board }: { board: Board }) =>
      setBoards((prev) => prev.map((b) => (b._id === board._id ? board : b)));

    const onBoardDeleted = ({ boardId }: { boardId: string }) => {
      setBoards((prev) => prev.filter((b) => b._id !== boardId));
      setItems((prev) => prev.filter((i) => i.board !== boardId));
    };

    const onBoardsReordered = ({ boards: newBoards }: { boards: Board[] }) => setBoards(newBoards);

    const onItemCreated = ({ item }: { item: Item }) =>
      setItems((prev) => (prev.some((i) => i._id === item._id) ? prev : [...prev, item]));

    const onItemUpdated = ({ item }: { item: Item }) =>
      setItems((prev) => prev.map((i) => (i._id === item._id ? item : i)));

    const onItemDeleted = ({ itemId }: { itemId: string }) =>
      setItems((prev) => prev.filter((i) => i._id !== itemId));

    const onItemMoved = ({ items: newItems }: { items: Item[] }) => setItems(newItems);

    const onMemberJoined = ({ user: newMember }: { user: any }) => {
      toast.success(`${newMember.name} joined the project`);
      api
        .get(`/projects/${projectId}/members`)
        .then((res) => setMembers(res.data.members))
        .catch(() => {});
    };

    const onProjectUpdated = ({ project: updated }: { project: Project }) => setProject(updated);

    const onProjectDeleted = () => {
      toast.error('This project was deleted by its owner');
      router.replace('/projects');
    };

    socket.on('board:created', onBoardCreated);
    socket.on('board:updated', onBoardUpdated);
    socket.on('board:deleted', onBoardDeleted);
    socket.on('boards:reordered', onBoardsReordered);
    socket.on('item:created', onItemCreated);
    socket.on('item:updated', onItemUpdated);
    socket.on('item:deleted', onItemDeleted);
    socket.on('item:moved', onItemMoved);
    socket.on('member:joined', onMemberJoined);
    socket.on('project:updated', onProjectUpdated);
    socket.on('project:deleted', onProjectDeleted);

    return () => {
      socket.emit('project:leave', projectId);
      socket.off('board:created', onBoardCreated);
      socket.off('board:updated', onBoardUpdated);
      socket.off('board:deleted', onBoardDeleted);
      socket.off('boards:reordered', onBoardsReordered);
      socket.off('item:created', onItemCreated);
      socket.off('item:updated', onItemUpdated);
      socket.off('item:deleted', onItemDeleted);
      socket.off('item:moved', onItemMoved);
      socket.off('member:joined', onMemberJoined);
      socket.off('project:updated', onProjectUpdated);
      socket.off('project:deleted', onProjectDeleted);
    };
  }, [user, projectId, router]);

  // Disconnect socket entirely when leaving the app (not just this page)
  useEffect(() => () => undefined, []);

  // ---- Drag and drop ----
  const handleDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId, type } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    if (type === 'BOARD') {
      const reordered = Array.from(boardsRef.current);
      const [moved] = reordered.splice(source.index, 1);
      reordered.splice(destination.index, 0, moved);
      setBoards(reordered);

      try {
        await api.put('/boards/reorder', {
          project: projectId,
          boards: reordered.map((b, idx) => ({ id: b._id, order: idx })),
        });
      } catch (err) {
        toast.error(getErrorMessage(err));
        loadAll();
      }
      return;
    }

    // Moving an item
    const sourceBoardId = source.droppableId;
    const destBoardId = destination.droppableId;

    // Optimistic local update
    setItems((prev) => {
      const itemsCopy = [...prev];
      const movingIdx = itemsCopy.findIndex((i) => i._id === draggableId);
      if (movingIdx === -1) return prev;
      const [moving] = itemsCopy.splice(movingIdx, 1);

      const destItems = itemsCopy
        .filter((i) => i.board === destBoardId)
        .sort((a, b) => a.order - b.order);
      destItems.splice(destination.index, 0, { ...moving, board: destBoardId });

      const others = itemsCopy.filter((i) => i.board !== destBoardId);
      const reNumberedDest = destItems.map((it, idx) => ({ ...it, order: idx }));

      return [...others, ...reNumberedDest];
    });

    try {
      const { data } = await api.put('/items/move', {
        project: projectId,
        itemId: draggableId,
        sourceBoardId,
        destBoardId,
        destIndex: destination.index,
      });
      setItems(data.items);
    } catch (err) {
      toast.error(getErrorMessage(err));
      loadAll();
    }
  };

  // ---- Board actions ----
  const handleCreateBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBoardTitle.trim()) return;
    try {
      const { data } = await api.post('/boards', { project: projectId, title: newBoardTitle.trim() });
      setBoards((prev) => (prev.some((b) => b._id === data.board._id) ? prev : [...prev, data.board]));
      setNewBoardTitle('');
      setAddingBoard(false);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleRenameBoard = async (boardId: string, title: string) => {
    setBoards((prev) => prev.map((b) => (b._id === boardId ? { ...b, title } : b)));
    try {
      await api.put(`/boards/${boardId}`, { title });
    } catch (err) {
      toast.error(getErrorMessage(err));
      loadAll();
    }
  };

  const handleDeleteBoard = async () => {
    if (!deleteBoardTarget) return;
    const boardId = deleteBoardTarget._id;
    setBoards((prev) => prev.filter((b) => b._id !== boardId));
    setItems((prev) => prev.filter((i) => i.board !== boardId));
    setDeleteBoardTarget(null);
    try {
      await api.delete(`/boards/${boardId}`);
      toast.success('Board deleted');
    } catch (err) {
      toast.error(getErrorMessage(err));
      loadAll();
    }
  };

  // ---- Render ----
  if (authLoading || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader label="Loading project…" />
      </div>
    );
  }

  if (loadError || !project) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50">
        <Navbar />
        <div className="flex flex-1 items-center justify-center px-4">
          <div className="card max-w-sm p-6 text-center">
            <h1 className="text-lg font-semibold text-slate-900">Can&apos;t open this project</h1>
            <p className="mt-2 text-sm text-slate-600">{loadError || 'Project not found.'}</p>
            <button className="btn-primary mt-4" onClick={() => router.push('/projects')}>
              Back to projects
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-slate-50">
      <Navbar />

      {/* Project header */}
      <div className="border-b border-slate-200 bg-white px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <button
              onClick={() => router.push('/projects')}
              className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              title="Back to projects"
            >
              ←
            </button>
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-semibold text-white"
              style={{ backgroundColor: project.color }}
            >
              {project.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-base font-semibold text-slate-900 sm:text-lg">{project.name}</h1>
              {project.description && (
                <p className="hidden truncate text-xs text-slate-500 sm:block">{project.description}</p>
              )}
            </div>
          </div>

          <MembersBar
            project={project}
            members={members}
            isOwner={myRole === 'owner'}
            onInviteTokenChanged={(token) => setProject((p) => (p ? { ...p, inviteToken: token } : p))}
          />
        </div>
      </div>

      {/* Board area */}
      <div className="flex-1 overflow-hidden">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="all-boards" direction="horizontal" type="BOARD">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex h-full items-start gap-4 overflow-x-auto px-4 py-4 sm:px-6"
              >
                {boards
                  .slice()
                  .sort((a, b) => a.order - b.order)
                  .map((board, index) => (
                    <BoardColumn
                      key={board._id}
                      board={board}
                      index={index}
                      items={items
                        .filter((i) => i.board === board._id)
                        .sort((a, b) => a.order - b.order)}
                      onRename={handleRenameBoard}
                      onDelete={(b) => setDeleteBoardTarget(b)}
                      onAddItem={(boardId) => setItemModal({ mode: 'create', boardId })}
                      onItemClick={(item) => setItemModal({ mode: 'edit', boardId: item.board, item })}
                    />
                  ))}
                {provided.placeholder}

                {/* Add board */}
                <div className="w-[280px] shrink-0 sm:w-[300px]">
                  {addingBoard ? (
                    <form onSubmit={handleCreateBoard} className="rounded-xl bg-slate-100/80 p-3">
                      <input
                        autoFocus
                        className="input"
                        placeholder="Board name"
                        value={newBoardTitle}
                        maxLength={80}
                        onChange={(e) => setNewBoardTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Escape') {
                            setAddingBoard(false);
                            setNewBoardTitle('');
                          }
                        }}
                      />
                      <div className="mt-2 flex gap-2">
                        <button type="submit" className="btn-primary !py-1.5 text-sm" disabled={!newBoardTitle.trim()}>
                          Add board
                        </button>
                        <button
                          type="button"
                          className="btn-ghost !py-1.5 text-sm"
                          onClick={() => {
                            setAddingBoard(false);
                            setNewBoardTitle('');
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <button
                      onClick={() => setAddingBoard(true)}
                      className="flex h-11 w-full items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-slate-300 text-sm font-medium text-slate-500 hover:border-brand-400 hover:text-brand-600"
                    >
                      + Add board
                    </button>
                  )}
                </div>
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      {itemModal && (
        <ItemModal
          mode={itemModal.mode}
          projectId={String(projectId)}
          boardId={itemModal.boardId}
          item={itemModal.item}
          members={members}
          onClose={() => setItemModal(null)}
          onSaved={(item) =>
            setItems((prev) => {
              const exists = prev.some((i) => i._id === item._id);
              return exists ? prev.map((i) => (i._id === item._id ? item : i)) : [...prev, item];
            })
          }
          onDeleted={(itemId) => setItems((prev) => prev.filter((i) => i._id !== itemId))}
        />
      )}

      <ConfirmDialog
        open={!!deleteBoardTarget}
        title={`Delete "${deleteBoardTarget?.title}"?`}
        message="All items in this board will be permanently deleted."
        confirmLabel="Delete board"
        onConfirm={handleDeleteBoard}
        onCancel={() => setDeleteBoardTarget(null)}
      />
    </div>
  );
}
