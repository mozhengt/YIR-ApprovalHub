import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { applicationApi } from '@/api'

export default function CreateReimburse() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({
        expenseType: 1,
        amount: 0,
        reason: '',
        invoiceAttachment: '',
        occurDate: '',
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!form.amount || !form.reason || !form.invoiceAttachment) {
            alert('请填写必填项')
            return
        }

        setLoading(true)
        try {
            await applicationApi.createReimburse(form)
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
                <h2 className="text-2xl font-bold text-gray-800 mb-6">创建报销申请</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            费用类型 *
                        </label>
                        <select
                            value={form.expenseType}
                            onChange={(e) => setForm({ ...form, expenseType: Number(e.target.value) })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                            <option value={1}>差旅费</option>
                            <option value={2}>餐饮费</option>
                            <option value={3}>办公费</option>
                            <option value={4}>其他</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            报销金额 *
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">¥</span>
                            <input
                                type="number"
                                step="0.01"
                                value={form.amount}
                                onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            发生日期
                        </label>
                        <input
                            type="date"
                            value={form.occurDate}
                            onChange={(e) => setForm({ ...form, occurDate: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            发票附件 *
                        </label>
                        <input
                            type="text"
                            value={form.invoiceAttachment}
                            onChange={(e) => setForm({ ...form, invoiceAttachment: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="请上传发票后填写文件路径，如：/upload/invoice_001.pdf"
                        />
                        <p className="mt-1 text-sm text-gray-500">
                            提示：实际项目中这里应该是文件上传组件
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            报销事由 *
                        </label>
                        <textarea
                            value={form.reason}
                            onChange={(e) => setForm({ ...form, reason: e.target.value })}
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="请详细说明报销原因"
                        />
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50"
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
