package com.approval.module.approval.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 审批历史表
 */
@Data
@TableName("bpm_history")
public class History {

    @TableId(type = IdType.AUTO)
    private Long historyId;

    private Long appId;

    private Long taskId;

    private String nodeName;

    private Long approverId;

    private String approverName;

    private Integer action; // 1=同意 2=拒绝

    private String comment;

    private LocalDateTime approveTime;

    private String nextNode;

    private LocalDateTime createTime;
}
