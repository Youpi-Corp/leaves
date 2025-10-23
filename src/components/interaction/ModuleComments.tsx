import React, { useState } from 'react'
import { useModuleComments, useCreateModuleComment, useUpdateModuleComment, useDeleteModuleComment } from '../../api/module/module-comment.services'
import { useCurrentUser } from '../../api/user/user.services'
import UserDisplay from '../user/UserDisplay'

interface ModuleCommentsProps {
    moduleId: number
}

const ModuleComments: React.FC<ModuleCommentsProps> = ({ moduleId }) => {
    const [newComment, setNewComment] = useState('')
    const [editingId, setEditingId] = useState<number | null>(null)
    const [editContent, setEditContent] = useState('')
    
    const { data: currentUser } = useCurrentUser()
    const { data: comments, isLoading } = useModuleComments(moduleId)
    const createComment = useCreateModuleComment()
    const updateComment = useUpdateModuleComment()
    const deleteComment = useDeleteModuleComment()

    const isAdminUser = currentUser?.roles?.includes('admin') ?? false
    const canEditComment = (commentUserId: number) => currentUser?.id === commentUserId
    const canDeleteComment = (commentUserId: number) => canEditComment(commentUserId) || isAdminUser

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newComment.trim()) return

        createComment.mutate({
            module_id: moduleId,
            content: newComment.trim()
        }, {
            onSuccess: () => setNewComment('')
        })
    }

    const handleEdit = (commentId: number, content: string) => {
        setEditingId(commentId)
        setEditContent(content)
    }

    const handleUpdate = () => {
        if (!editContent.trim() || !editingId) return

        const currentComment = comments?.find((commentItem) => commentItem.id === editingId)
        if (currentComment && currentComment.content.trim() === editContent.trim()) {
            setEditingId(null)
            setEditContent('')
            return
        }

        updateComment.mutate({
            commentId: editingId,
            content: editContent.trim()
        }, {
            onSuccess: () => {
                setEditingId(null)
                setEditContent('')
            }
        })
    }

    const handleDelete = (commentId: number) => {
        if (confirm('Delete this comment?')) {
            deleteComment.mutate(commentId)
        }
    }

    const normalizeDate = (rawDate: string | null | undefined) => {
        if (!rawDate) return null

        const candidates: string[] = [rawDate]

        if (!rawDate.includes('T')) {
            const withT = rawDate.replace(' ', 'T')
            candidates.push(withT)
            candidates.push(`${withT}Z`)
        } else if (!/[zZ]|[+-]\d{2}:?\d{2}$/.test(rawDate)) {
            candidates.push(`${rawDate}Z`)
        }

        candidates.push(...candidates.map((value) => value.replace(/(\.\d{3})\d+/, '$1')))

        for (const value of candidates) {
            const parsed = new Date(value)
            if (!Number.isNaN(parsed.getTime())) {
                return parsed
            }
        }

        return null
    }

    const formatCommentDate = (rawDate: string | null | undefined) => {
        const parsed = normalizeDate(rawDate)
        if (!parsed) return 'Unknown date'

        return new Intl.DateTimeFormat(undefined, {
            dateStyle: 'medium',
            timeStyle: 'short',
        }).format(parsed)
    }

    const isCommentEdited = (createdAt: string, updatedAt: string) => {
        const created = normalizeDate(createdAt)
        const updated = normalizeDate(updatedAt)

        if (!created || !updated) return false

        return Math.abs(updated.getTime() - created.getTime()) > 1000
    }

    if (isLoading) {
        return <div className="text-center py-4">Loading comments...</div>
    }

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">
                Comments ({comments?.length || 0})
            </h3>

            {/* Formulaire nouveau commentaire */}
            {currentUser && (
                <form onSubmit={handleSubmit} className="mb-6">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
                        rows={3}
                        disabled={createComment.isPending}
                    />
                    <button
                        type="submit"
                        disabled={!newComment.trim() || createComment.isPending}
                        className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                        {createComment.isPending ? 'Posting...' : 'Post'}
                    </button>
                </form>
            )}

            {/* Liste des commentaires */}
            <div className="space-y-4">
                {comments?.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">
                        No comments yet.
                    </p>
                ) : (
                    comments?.map((comment) => (
                        <div key={comment.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                                <div className="text-sm text-gray-600">
                                    <UserDisplay userId={comment.user_id} /> • {formatCommentDate(comment.created_at)}
                                    {isCommentEdited(comment.created_at, comment.updated_at) ? ' (edited)' : ''}
                                </div>
                                {(canEditComment(comment.user_id) || canDeleteComment(comment.user_id)) && (
                                    <div className="flex space-x-2">
                                        {canEditComment(comment.user_id) && (
                                            <button
                                                onClick={() => handleEdit(comment.id, comment.content)}
                                                className="text-green-600 hover:text-green-800 text-sm"
                                            >
                                                Edit
                                            </button>
                                        )}
                                        {canDeleteComment(comment.user_id) && (
                                            <button
                                                onClick={() => handleDelete(comment.id)}
                                                className="text-red-600 hover:text-red-800 text-sm"
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>

                            {editingId === comment.id ? (
                                <div>
                                    <textarea
                                        value={editContent}
                                        onChange={(e) => setEditContent(e.target.value)}
                                        className="w-full p-2 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
                                        rows={3}
                                    />
                                    <div className="flex space-x-2 mt-2">
                                        <button
                                            onClick={handleUpdate}
                                            disabled={updateComment.isPending}
                                            className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={() => setEditingId(null)}
                                            className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-800">{comment.content}</p>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default ModuleComments