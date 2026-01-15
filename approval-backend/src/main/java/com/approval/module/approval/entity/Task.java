package com.approval.module.approval.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 审批任务表
 */
@Data
@TableName("bpm_task")
public class Task {

    @TableId(type = IdType.AUTO)
    private Long taskId;

    private Long appId;

    private String nodeName;

    private Long assigneeId;

    private String assigneeName;

    private Integer status; // 0=待处理 1=已处理

    private LocalDateTime createTime;

    private LocalDateTime finishTime;
}
