package com.approval.module.approval.vo;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 审批历史视图对象
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationHistoryVo {

    /** 申请主键 */
    private Long appId;

    /** 申请单号 */
    private String appNo;

    /** 申请类型（leave/reimburse） */
    private String appType;

    /** 申请标题 */
    private String title;

    /** 申请状态 */
    private Integer status;

    /** 申请人姓名 */
    private String applicantName;

    /** 申请人所属部门 */
    private String deptName;

    /** 当前/最后审批节点 */
    private String currentNode;

    /** 审批人姓名，用于历史过滤 */
    private String approverName;

    /** 审批动作：1=同意 2=拒绝等 */
    private Integer action;

    /** 审批意见 */
    private String comment;

    /** 请假类型（仅请假单使用） */
    private Integer leaveType;

    /** 请假天数 */
    private BigDecimal leaveDays;

    /** 报销类型（仅报销单使用） */
    private Integer expenseType;

    /** 报销金额 */
    private BigDecimal expenseAmount;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime submitTime;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime approveTime;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime finishTime;
}
