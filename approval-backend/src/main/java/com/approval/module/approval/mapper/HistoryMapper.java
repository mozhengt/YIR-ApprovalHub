package com.approval.module.approval.mapper;

import com.approval.module.approval.entity.History;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;

/**
 * 审批历史Mapper
 */
@Mapper
public interface HistoryMapper extends BaseMapper<History> {
}
