import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { applicationApi } from '@/api'
import dayjs from 'dayjs'

export default function CreateLeave() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({
        leaveType: 1,
        startTime: '',
        endTime: '',
        days: 0,
        reason: '',
        attachment: '',
    })

    // 自动计算天数
    useEffect(() => {
        if (form.startTime && form.endTime) {
            const start = dayjs(form.startTime)
            const end = dayjs(form.endTime)

            if (end.isAfter(start)) {
                // 计算小时差，然后转换为天数（假设一天8小时工作制或24小时制，这里简单按24小时算或者0.5天精度）
                // 暂时按简单天数差计算，向上取整或保留1位小数
                const diffHours = end.diff(start, 'hour', true)
                const days = Math.ceil((diffHours / 24) * 2) / 2 // 0.5 step
                setForm(prev => ({ ...prev, days: days > 0 ? days : 0 }))
            }
        }
    }, [form.startTime, form.endTime])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!form.startTime || !form.endTime || !form.reason) {
            alert('请填写必填项')
            return
        }

        setLoading(true)
        try {
            // 格式化日期为 yyyy-MM-dd HH:mm:ss
            const formattedForm = {
                ...form,
                startTime: dayjs(form.startTime).format('YYYY-MM-DD HH:mm:ss'),
                endTime: dayjs(form.endTime).format('YYYY-MM-DD HH:mm:ss')
            }
            await applicationApi.createLeave(formattedForm)
            alert('提交成功')
            navigate('/dashboard/applications')
        } catch (error: any) {
            alert(error?.message || '提交失败')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">创建请假申请</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            请假类型 *
                        </label>
                        <select
                            value={form.leaveType}
                            onChange={(e) => setForm({ ...form, leaveType: Number(e.target.value) })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                            <option value={1}>事假</option>
                            <option value={2}>病假</option>
                            <option value={3}>年假</option>
                            <option value={4}>调休</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                开始时间 *
                            </label>
                            <input
                                type="datetime-local"
                                value={form.startTime}
                                onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                结束时间 *
                            </label>
                            <input
                                type="datetime-local"
                                value={form.endTime}
                                onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            请假天数 *
                        </label>
                        <input
                            type="number"
                            step="0.5"
                            value={form.days}
                            onChange={(e) => setForm({ ...form, days: Number(e.target.value) })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            请假事由 *
                        </label>
                        <textarea
                            value={form.reason}
                            onChange={(e) => setForm({ ...form, reason: e.target.value })}
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="请详细说明请假原因"
                        />
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? '提交中...' : '提交申请'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/dashboard/applications')}
                            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            取消
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
