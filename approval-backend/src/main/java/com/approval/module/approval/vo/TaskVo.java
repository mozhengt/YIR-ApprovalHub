package com.approval.module.approval.vo;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 任务VO
 */
@Data
public class TaskVo {

    private Long taskId;

    private Long appId;

    private String appNo;

    private String appType;

    private String title;

    private String applicantName;

    private String nodeName;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createTime;

    // 已办任务额外字段
    private Integer action;

    private String comment;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime finishTime;
}
