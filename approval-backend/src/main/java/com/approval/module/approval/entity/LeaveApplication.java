package com.approval.module.approval.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 请假申请表
 */
@Data
@TableName("bpm_leave_application")
public class LeaveApplication {

    @TableId(type = IdType.AUTO)
    private Long leaveId;

    private Long appId;

    private Integer leaveType; // 1=事假 2=病假 3=年假 4=调休

    private LocalDateTime startTime;

    private LocalDateTime endTime;

    private BigDecimal days;

    private String reason;

    private String attachment;

    private LocalDateTime createTime;

    private LocalDateTime updateTime;
}
