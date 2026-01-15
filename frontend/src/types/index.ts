export interface User {
    userId: number
    username: string
    realName: string
    avatar?: string
    roles: string[]
}

export interface LoginRequest {
    username: string
    password: string
}

export interface RegisterRequest {
    username: string
    password: string
    confirmPassword: string
    realName: string
    phone?: string
    email?: string
}

export interface LoginResponse {
    token: string
    userInfo: User
}

export interface Application {
    appId: number
    appNo: string
    appType: string
    title: string
    applicantName: string
    deptName: string
    status: number
    currentNode: string
    submitTime: string
    finishTime?: string
}

export interface CreateLeaveRequest {
    leaveType: number
    startTime: string
    endTime: string
    days: number
    reason: string
    attachment?: string
}

export interface CreateReimburseRequest {
    expenseType: number
    amount: number
    reason: string
    invoiceAttachment: string
    occurDate: string
}

export interface Task {
    taskId: number
    appId: number
    appNo: string
    appType: string
    title: string
    applicantName: string
    nodeName: string
    createTime: string
    action?: number
    comment?: string
    finishTime?: string
}

export interface ApproveTaskRequest {
    taskId: number
    action: number
    comment?: string
}
