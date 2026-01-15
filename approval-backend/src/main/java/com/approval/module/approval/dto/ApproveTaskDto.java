package com.approval.module.approval.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * 审批任务DTO
 */
@Data
public class ApproveTaskDto {

    @NotNull(message = "任务ID不能为空")
    private Long taskId;

    @NotNull(message = "审批动作不能为空")
    private Integer action; // 1=同意 2=拒绝

    private String comment; // 审批意见（选填）
}
