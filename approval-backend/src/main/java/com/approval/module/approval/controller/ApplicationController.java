package com.approval.module.approval.controller;

import com.approval.common.result.Result;
import com.approval.common.utils.JwtUtils;
import com.approval.module.approval.dto.CreateLeaveDto;
import com.approval.module.approval.dto.CreateReimburseDto;
import com.approval.module.approval.service.IApplicationService;
import com.approval.module.approval.vo.ApplicationVo;
import com.approval.module.system.entity.User;
import com.approval.module.system.mapper.UserMapper;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

/**
 * 申请管理控制器
 */
@Tag(name = "申请管理")
@RestController
@RequestMapping("/application")
@RequiredArgsConstructor
public class ApplicationController {

    private final IApplicationService applicationService;
    private final JwtUtils jwtUtils;
    private final UserMapper userMapper;

    @Operation(summary = "创建请假申请")
    @PostMapping("/leave")
    public Result<Long> createLeaveApplication(
            @Valid @RequestBody CreateLeaveDto dto,
            @RequestHeader("Authorization") String token) {
        Long userId = getUserIdFromToken(token);
        Long appId = applicationService.createLeaveApplication(dto, userId);
        return Result.success(appId);
    }

    @Operation(summary = "创建报销申请")
    @PostMapping("/reimburse")
    public Result<Long> createReimburseApplication(
            @Valid @RequestBody CreateReimburseDto dto,
            @RequestHeader("Authorization") String token) {
        Long userId = getUserIdFromToken(token);
        Long appId = applicationService.createReimburseApplication(dto, userId);
        return Result.success(appId);
    }

    @Operation(summary = "查询我的申请列表")
    @GetMapping("/my")
    public Result<Page<ApplicationVo>> getMyApplications(
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) String appType,
            @RequestParam(required = false) Integer status,
            @RequestHeader("Authorization") String token) {
        Long userId = getUserIdFromToken(token);
        Page<ApplicationVo> page = applicationService.getMyApplications(userId, pageNum, pageSize, appType, status);
        return Result.success(page);
    }

    @Operation(summary = "查询申请详情")
    @GetMapping("/{appId}")
    public Result<Object> getApplicationDetail(@PathVariable Long appId) {
        Object detail = applicationService.getApplicationDetail(appId);
        return Result.success(detail);
    }

    @Operation(summary = "撤回申请")
    @PutMapping("/withdraw/{appId}")
    public Result<Void> withdrawApplication(
            @PathVariable Long appId,
            @RequestHeader("Authorization") String token) {
        Long userId = getUserIdFromToken(token);
        applicationService.withdrawApplication(appId, userId);
        return Result.success();
    }

    /**
     * 从Token中获取用户ID
     */
    private Long getUserIdFromToken(String token) {
        String actualToken = token.replace("Bearer ", "");
        String username = jwtUtils.getUsernameFromToken(actualToken);
        User user = userMapper.selectOne(
                new LambdaQueryWrapper<User>().eq(User::getUsername, username));
        return user != null ? user.getUserId() : null;
    }
}
