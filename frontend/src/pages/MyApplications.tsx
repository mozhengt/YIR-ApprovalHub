import { useState, useEffect } from 'react'
import { applicationApi } from '@/api'
import type { Application } from '@/types'

const statusMap: Record<number, { text: string; color: string }> = {
    0: { text: '草稿', color: 'bg-gray-500' },
    1: { text: '待审批', color: 'bg-yellow-500' },
    2: { text: '审批中', color: 'bg-blue-500' },
    3: { text: '已通过', color: 'bg-green-500' },
    4: { text: '已拒绝', color: 'bg-red-500' },
    5: { text: '已撤回', color: 'bg-gray-500' },
}

const typeMap: Record<string, string> = {
    leave: '请假',
    reimburse: '报销',
}

export default function MyApplications() {
    const [applications, setApplications] = useState<Application[]>([])
    const [loading, setLoading] = useState(false)
    const [filter, setFilter] = useState({ appType: '', status: '' })

    const fetchApplications = async () => {
        setLoading(true)
        try {
            const res = await applicationApi.getMyApplications({
                pageNum: 1,
                pageSize: 20,
                appType: filter.appType || undefined,
                status: filter.status ? Number(filter.status) : undefined,
            })
            setApplications(res.records)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchApplications()
    }, [filter])

    const handleWithdraw = async (appId: number) => {
        if (!confirm('确定要撤回此申请吗？')) return

        try {
            await applicationApi.withdraw(appId)
            alert('撤回成功')
            fetchApplications()
        } catch (error: any) {
            alert(error?.message || '撤回失败')
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">我的申请</h2>
                <div className="flex gap-4">
                    <button
                        onClick={() => window.open('/dashboard/create/leave', '_blank')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        + 请假申请
                    </button>
                    <button
                        onClick={() => window.open('/dashboard/create/reimburse', '_blank')}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                        + 报销申请
                    </button>
                </div>
            </div>

            {/* 筛选器 */}
            <div className="bg-white p-4 rounded-lg shadow-sm flex gap-4">
                <select
                    value={filter.appType}
                    onChange={(e) => setFilter({ ...filter, appType: e.target.value })}
                    className="px-4 py-2 border rounded-lg"
                >
                    <option value="">全部类型</option>
                    <option value="leave">请假</option>
                    <option value="reimburse">报销</option>
                </select>

                <select
                    value={filter.status}
                    onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                    className="px-4 py-2 border rounded-lg"
                >
                    <option value="">全部状态</option>
                    <option value="1">待审批</option>
                    <option value="2">审批中</option>
                    <option value="3">已通过</option>
                    <option value="4">已拒绝</option>
                    <option value="5">已撤回</option>
                </select>
            </div>

            {/* 申请列表 */}
            {loading ? (
                <div className="text-center py-20 text-gray-500">加载中...</div>
            ) : applications.length === 0 ? (
                <div className="text-center py-20 text-gray-500">暂无申请记录</div>
            ) : (
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    申请单号
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    类型
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    标题
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    状态
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    提交时间
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    操作
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {applications.map((app) => (
                                <tr key={app.appId} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm text-gray-900">{app.appNo}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {typeMap[app.appType]}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{app.title}</td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`px-2 py-1 text-xs text-white rounded-full ${statusMap[app.status]?.color
                                                }`}
                                        >
                                            {statusMap[app.status]?.text}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(app.submitTime).toLocaleString('zh-CN')}
                                    </td>
                                    <td className="px-6 py-4 text-sm space-x-2">
                                        <button className="text-blue-600 hover:underline">查看</button>
                                        {app.status === 1 && (
                                            <button
                                                onClick={() => handleWithdraw(app.appId)}
                                                className="text-red-600 hover:underline"
                                            >
                                                撤回
                                            </button>
                                        )}
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
