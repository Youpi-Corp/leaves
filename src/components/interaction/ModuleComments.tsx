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
        if (confirm('Supprimer ce commentaire ?')) {
            deleteComment.mutate(commentId)
        }
    }

    if (isLoading) {
        return <div className="text-center py-4">Chargement des commentaires...</div>
    }

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">
                Commentaires ({comments?.length || 0})
            </h3>

            {/* Formulaire nouveau commentaire */}
            {currentUser && (
                <form onSubmit={handleSubmit} className="mb-6">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Ajouter un commentaire..."
                        className="w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
                        rows={3}
                        disabled={createComment.isPending}
                    />
                    <button
                        type="submit"
                        disabled={!newComment.trim() || createComment.isPending}
                        className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                        {createComment.isPending ? 'Publication...' : 'Publier'}
                    </button>
                </form>
            )}

            {/* Liste des commentaires */}
            <div className="space-y-4">
                {comments?.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">
                        Aucun commentaire pour le moment.
                    </p>
                ) : (
                    comments?.map((comment) => (
                        <div key={comment.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                                <div className="text-sm text-gray-600">
                                    <UserDisplay userId={comment.user_id} /> • {new Date(comment.dtc).toLocaleDateString()}
                                </div>
                                {currentUser?.id === comment.user_id && (
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleEdit(comment.id, comment.content)}
                                            className="text-green-600 hover:text-green-800 text-sm"
                                        >
                                            Modifier
                                        </button>
                                        <button
                                            onClick={() => handleDelete(comment.id)}
                                            className="text-red-600 hover:text-red-800 text-sm"
                                        >
                                            Supprimer
                                        </button>
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
                                            Sauvegarder
                                        </button>
                                        <button
                                            onClick={() => setEditingId(null)}
                                            className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
                                        >
                                            Annuler
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