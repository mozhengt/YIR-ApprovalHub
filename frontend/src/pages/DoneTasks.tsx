import { useState, useEffect } from 'react'
import { taskApi } from '@/api'
import type { Task } from '@/types'

const actionMap: Record<number, { text: string; color: string }> = {
    1: { text: '同意', color: 'text-green-600' },
    2: { text: '拒绝', color: 'text-red-600' },
}

export default function DoneTasks() {
    const [tasks, setTasks] = useState<Task[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchTasks = async () => {
            setLoading(true)
            try {
                const res = await taskApi.getDoneTasks({ pageNum: 1, pageSize: 20 })
                setTasks(res.records)
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }

        fetchTasks()
    }, [])

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">已办任务</h2>

            {loading ? (
                <div className="text-center py-20 text-gray-500">加载中...</div>
            ) : tasks.length === 0 ? (
                <div className="text-center py-20 text-gray-500">暂无已办任务</div>
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
                                    审批结果
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    审批意见
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    完成时间
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
                                    <td className="px-6 py-4 text-sm">
                                        <span className={actionMap[task.action || 1]?.color}>
                                            {actionMap[task.action || 1]?.text}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {task.comment || '-'}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {task.finishTime
                                            ? new Date(task.finishTime).toLocaleString('zh-CN')
                                            : '-'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
