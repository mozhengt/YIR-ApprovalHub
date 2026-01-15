import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import MyApplications from './MyApplications'
import TodoTasks from './TodoTasks'
import DoneTasks from './DoneTasks'
import CreateLeave from './CreateLeave'
import CreateReimburse from './CreateReimburse'

export default function Dashboard() {
    const navigate = useNavigate()
    const { user, clearAuth } = useAuthStore()

    const handleLogout = () => {
        clearAuth()
        navigate('/login')
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* 顶部导航栏 */}
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-bold text-gray-800">YIR-审批系统</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-700">欢迎，{user?.realName}</span>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 text-sm text-gray-700 hover:text-red-600"
                            >
                                退出登录
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="flex">
                {/* 侧边栏 */}
                <aside className="w-64 bg-white shadow-sm min-h-screen">
                    <nav className="p-4 space-y-2">
                        <Link
                            to="/dashboard/applications"
                            className="block px-4 py-3 rounded-lg border border-gray-500 bg-white hover:bg-blue-300 hover:text-blue-600 transition"
                        >
                            📝 我的申请
                        </Link>
                        <Link
                            to="/dashboard/todo"
                            className="block px-4 py-3 rounded-lg border border-gray-500 bg-white hover:bg-blue-300 hover:text-blue-600 transition"
                        >
                            ✅ 待审核任务
                        </Link>
                        <Link
                            to="/dashboard/done"
                            className="block px-4 py-3 rounded-lg border border-gray-500 bg-white hover:bg-blue-300 hover:text-blue-600 transition"
                        >
                            📋 已审核任务
                        </Link>
                    </nav>
                </aside>

                {/* 主内容区 */}
                <main className="flex-1 p-8">
                    <Routes>
                        <Route path="applications" element={<MyApplications />} />
                        <Route path="create/leave" element={<CreateLeave />} />
                        <Route path="create/reimburse" element={<CreateReimburse />} />
                        <Route path="todo" element={<TodoTasks />} />
                        <Route path="done" element={<DoneTasks />} />
                        <Route
                            path="/"
                            element={
                                <div className="text-center py-20">
                                    <h2 className="text-3xl font-bold text-gray-800 mb-4">
                                        欢迎使用审批系统
                                    </h2>
                                    <p className="text-gray-600">请从左侧菜单选择功能</p>
                                </div>
                            }
                        />
                    </Routes>
                </main>
            </div>
        </div>
    )
}
