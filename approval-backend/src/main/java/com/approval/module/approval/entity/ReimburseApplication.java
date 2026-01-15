package com.approval.module.approval.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 报销申请表
 */
@Data
@TableName("bpm_reimburse_application")
public class ReimburseApplication {

    @TableId(type = IdType.AUTO)
    private Long reimburseId;

    private Long appId;

    private Integer expenseType; // 1=差旅费 2=餐饮费 3=办公费 4=其他

    private BigDecimal amount;

    private String reason;

    private String invoiceAttachment;

    private LocalDate occurDate;

    private LocalDateTime createTime;

    private LocalDateTime updateTime;
}
