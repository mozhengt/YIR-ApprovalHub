import { useState, useEffect } from 'react'
import { taskApi } from '@/api'
import type { Task } from '@/types'

export default function TodoTasks() {
    const [tasks, setTasks] = useState<Task[]>([])
    const [loading, setLoading] = useState(false)
    const [selectedTask, setSelectedTask] = useState<Task | null>(null)
    const [approveForm, setApproveForm] = useState({
        action: 1,
        comment: '',
    })

    const fetchTasks = async () => {
        setLoading(true)
        try {
            const res = await taskApi.getTodoTasks({ pageNum: 1, pageSize: 20 })
            setTasks(res.records)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchTasks()
    }, [])

    const handleApprove = async () => {
        if (!selectedTask) return

        try {
            await taskApi.approve({
                taskId: selectedTask.taskId,
                action: approveForm.action,
                comment: approveForm.comment || undefined,
            })
            alert('审批成功')
            setSelectedTask(null)
            setApproveForm({ action: 1, comment: '' })
            fetchTasks()
        } catch (error: any) {
            alert(error?.message || '审批失败')
        }
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">待办任务</h2>

            {loading ? (
                <div className="text-center py-20 text-gray-500">加载中...</div>
            ) : tasks.length === 0 ? (
                <div className="text-center py-20 text-gray-500">暂无待办任务</div>
            ) : (
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    申请单号
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    标题
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    申请人
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    当前节点
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    接收时间
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    操作
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {tasks.map((task) => (
                                <tr key={task.taskId} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm text-gray-900">{task.appNo}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{task.title}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {task.applicantName}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{task.nodeName}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(task.createTime).toLocaleString('zh-CN')}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <button
                                            onClick={() => setSelectedTask(task)}
                                            className="text-blue-600 hover:underline"
                                        >
                                            审批
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* 审批对话框 */}
            {selectedTask && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-8 max-w-md w-full">
                        <h3 className="text-xl font-bold mb-4">审批：{selectedTask.title}</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    审批动作 *
                                </label>
                                <div className="flex gap-4">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            checked={approveForm.action === 1}
                                            onChange={() => setApproveForm({ ...approveForm, action: 1 })}
                                            className="mr-2"
                                        />
                                        同意
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            checked={approveForm.action === 2}
                                            onChange={() => setApproveForm({ ...approveForm, action: 2 })}
                                            className="mr-2"
                                        />
                                        拒绝
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    审批意见（选填）
                                </label>
                                <textarea
                                    value={approveForm.comment}
                                    onChange={(e) =>
                                        setApproveForm({ ...approveForm, comment: e.target.value })
                                    }
                                    rows={4}
                                    className="w-full px-4 py-2 border rounded-lg"
                                    placeholder="请输入审批意见"
                                />
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={handleApprove}
                                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                                >
                                    提交
                                </button>
                                <button
                                    onClick={() => setSelectedTask(null)}
                                    className="px-6 py-2 border rounded-lg hover:bg-gray-50"
                                >
                                    取消
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
