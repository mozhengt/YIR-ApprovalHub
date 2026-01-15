package com.approval.module.approval.service.impl;

import com.approval.common.exception.BusinessException;
import com.approval.module.approval.dto.CreateLeaveDto;
import com.approval.module.approval.dto.CreateReimburseDto;
import com.approval.module.approval.entity.Application;
import com.approval.module.approval.entity.LeaveApplication;
import com.approval.module.approval.entity.ReimburseApplication;
import com.approval.module.approval.mapper.ApplicationMapper;
import com.approval.module.approval.mapper.LeaveApplicationMapper;
import com.approval.module.approval.mapper.ReimburseApplicationMapper;
import com.approval.module.approval.service.IApplicationService;
import com.approval.module.approval.vo.ApplicationVo;
import com.approval.module.system.entity.User;
import com.approval.module.system.mapper.UserMapper;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

/**
 * 申请服务实现
 */
@Service
@RequiredArgsConstructor
public class ApplicationServiceImpl implements IApplicationService {

    private final ApplicationMapper applicationMapper;
    private final LeaveApplicationMapper leaveApplicationMapper;
    private final ReimburseApplicationMapper reimburseApplicationMapper;
    private final UserMapper userMapper;
    private final com.approval.module.approval.mapper.TaskMapper taskMapper;
    private final com.approval.module.approval.mapper.HistoryMapper historyMapper;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long createLeaveApplication(CreateLeaveDto dto, Long userId) {
        // 1. 获取用户信息
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new BusinessException("用户不存在");
        }

        // 2. 创建申请主表
        Application application = new Application();
        application.setAppNo(generateAppNo());
        application.setAppType("leave");
        application.setTitle(
                "请假申请-" + (dto.getReason().length() > 10 ? dto.getReason().substring(0, 10) + "..." : dto.getReason()));
        application.setApplicantId(userId);
        application.setDeptId(user.getDeptId());
        application.setStatus(1); // 待审批
        application.setCurrentNode("部门经理审批");
        application.setSubmitTime(LocalDateTime.now());

        applicationMapper.insert(application);

        // 3. 创建请假详情
        LeaveApplication leave = new LeaveApplication();
        leave.setAppId(application.getAppId());
        leave.setLeaveType(dto.getLeaveType());
        leave.setStartTime(dto.getStartTime());
        leave.setEndTime(dto.getEndTime());
        leave.setDays(dto.getDays());
        leave.setReason(dto.getReason());
        leave.setAttachment(dto.getAttachment());

        leaveApplicationMapper.insert(leave);

        // 4. 创建审批任务 (自动指派给经理，ID=2)
        createTask(application, 2L, "技术部经理");

        return application.getAppId();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long createReimburseApplication(CreateReimburseDto dto, Long userId) {
        // 1. 获取用户信息
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new BusinessException("用户不存在");
        }

        // 2. 创建申请主表
        Application application = new Application();
        application.setAppNo(generateAppNo());
        application.setAppType("reimburse");
        application.setTitle(
                "报销申请-" + (dto.getReason().length() > 10 ? dto.getReason().substring(0, 10) + "..." : dto.getReason()));
        application.setApplicantId(userId);
        application.setDeptId(user.getDeptId());
        application.setStatus(1); // 待审批
        application.setCurrentNode("部门经理审批");
        application.setSubmitTime(LocalDateTime.now());

        applicationMapper.insert(application);

        // 3. 创建报销详情
        ReimburseApplication reimburse = new ReimburseApplication();
        reimburse.setAppId(application.getAppId());
        reimburse.setExpenseType(dto.getExpenseType());
        reimburse.setAmount(dto.getAmount());
        reimburse.setReason(dto.getReason());
        reimburse.setInvoiceAttachment(dto.getInvoiceAttachment());
        reimburse.setOccurDate(dto.getOccurDate());

        reimburseApplicationMapper.insert(reimburse);

        // 4. 创建审批任务
        createTask(application, 2L, "技术部经理");

        return application.getAppId();
    }

    private void createTask(Application app, Long assigneeId, String assigneeName) {
        com.approval.module.approval.entity.Task task = new com.approval.module.approval.entity.Task();
        task.setAppId(app.getAppId());
        task.setNodeName(app.getCurrentNode());
        task.setAssigneeId(assigneeId);
        task.setAssigneeName(assigneeName);
        task.setStatus(0);
        task.setCreateTime(LocalDateTime.now());
        taskMapper.insert(task);
    }

    @Override
    public Page<ApplicationVo> getMyApplications(Long userId, Integer pageNum, Integer pageSize,
            String appType, Integer status) {
        Page<Application> page = new Page<>(pageNum, pageSize);

        LambdaQueryWrapper<Application> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Application::getApplicantId, userId)
                .eq(appType != null && !appType.isEmpty(), Application::getAppType, appType)
                .eq(status != null, Application::getStatus, status)
                .orderByDesc(Application::getSubmitTime);

        Page<Application> appPage = applicationMapper.selectPage(page, wrapper);

        // 转换为VO
        Page<ApplicationVo> voPage = new Page<>(appPage.getCurrent(), appPage.getSize(), appPage.getTotal());

        // 批量获取申请人信息
        User user = userMapper.selectById(userId);

        voPage.setRecords(appPage.getRecords().stream().map(app -> {
            ApplicationVo vo = new ApplicationVo();
            org.springframework.beans.BeanUtils.copyProperties(app, vo);
            vo.setApplicantName(user != null ? user.getRealName() : "");
            vo.setDeptName("技术部"); // 简化处理
            return vo;
        }).collect(java.util.stream.Collectors.toList()));

        return voPage;
    }

    @Override
    public Object getApplicationDetail(Long appId) {
        Application application = applicationMapper.selectById(appId);
        if (application == null) {
            throw new BusinessException(404, "申请不存在");
        }

        Map<String, Object> detail = new HashMap<>();
        detail.put("application", application);

        if ("leave".equals(application.getAppType())) {
            LeaveApplication leave = leaveApplicationMapper.selectOne(
                    new LambdaQueryWrapper<LeaveApplication>().eq(LeaveApplication::getAppId, appId));
            detail.put("detail", leave);
        } else if ("reimburse".equals(application.getAppType())) {
            ReimburseApplication reimburse = reimburseApplicationMapper.selectOne(
                    new LambdaQueryWrapper<ReimburseApplication>().eq(ReimburseApplication::getAppId, appId));
            detail.put("detail", reimburse);
        }

        // 查询审批历史
        java.util.List<com.approval.module.approval.entity.History> histories = historyMapper.selectList(
                new LambdaQueryWrapper<com.approval.module.approval.entity.History>()
                        .eq(com.approval.module.approval.entity.History::getAppId, appId)
                        .orderByDesc(com.approval.module.approval.entity.History::getCreateTime));
        detail.put("history", histories);

        return detail;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void withdrawApplication(Long appId, Long userId) {
        Application application = applicationMapper.selectById(appId);

        if (application == null) {
            throw new BusinessException(404, "申请不存在");
        }

        if (!application.getApplicantId().equals(userId)) {
            throw new BusinessException(403, "只能撤回自己的申请");
        }

        if (application.getStatus() != 1) {
            throw new BusinessException("只能撤回待审批状态的申请");
        }

        application.setStatus(5); // 已撤回
        applicationMapper.updateById(application);

        // 删除待办任务
        taskMapper.delete(
                new LambdaQueryWrapper<com.approval.module.approval.entity.Task>()
                        .eq(com.approval.module.approval.entity.Task::getAppId, appId)
                        .eq(com.approval.module.approval.entity.Task::getStatus, 0));
    }

    /**
     * 生成申请单号
     * 格式：AP + yyyyMMdd + 6位流水号
     */
    private String generateAppNo() {
        String date = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        // 简化处理，实际应该查询当天最大流水号
        long count = applicationMapper.selectCount(null);
        String serial = String.format("%06d", count + 1);
        return "AP" + date + serial;
    }
}
