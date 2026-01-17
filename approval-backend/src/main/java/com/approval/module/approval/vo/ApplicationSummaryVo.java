package com.approval.module.approval.vo;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 申请概览视图对象
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationSummaryVo {

    /** 用户基础信息 */
    private Long userId;

    private String realName;

    private String deptName;

    private String postName;

    /** 总体统计 */
    private Long totalCount;

    private Long pendingCount;

    private Long approvedCount;

    private Long rejectedCount;

    private Long withdrawnCount;

    /** 按类型拆分 */
    private Long leaveCount;

    private Long reimburseCount;

    /** 数值类指标 */
    private BigDecimal totalLeaveDays;

    private BigDecimal totalReimburseAmount;

    /** 审批通过率（0-100，单位：%） */
    private BigDecimal approvalRate;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime lastSubmitTime;
}
