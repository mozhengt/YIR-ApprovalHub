package com.approval.module.approval.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 审批申请主表
 */
@Data
@TableName("bpm_application")
public class Application {

    @TableId(type = IdType.AUTO)
    private Long appId;

    private String appNo;

    private String appType; // leave, reimburse

    private String title;

    private Long applicantId;

    private Long deptId;

    private Integer status; // 0=草稿 1=待审批 2=审批中 3=已通过 4=已拒绝 5=已撤回

    private String currentNode;

    private LocalDateTime submitTime;

    private LocalDateTime finishTime;

    @TableLogic
    private Integer delFlag;

    private LocalDateTime createTime;

    private LocalDateTime updateTime;
}
