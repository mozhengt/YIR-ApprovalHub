package com.approval.module.auth.service;

import com.approval.module.auth.dto.LoginDto;
import com.approval.module.auth.dto.RegisterDto;
import com.approval.module.auth.vo.LoginVo;

/**
 * 认证服务接口
 */
public interface IAuthService {

    /**
     * 用户注册
     */
    LoginVo register(RegisterDto registerDto);

    /**
     * 用户登录
     */
    LoginVo login(LoginDto loginDto);

    /**
     * 获取用户信息
     */
    LoginVo.UserInfoVo getUserInfo(String username);
}
