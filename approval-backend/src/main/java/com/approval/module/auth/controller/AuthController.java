package com.approval.module.auth.controller;

import com.approval.common.result.Result;
import com.approval.common.utils.JwtUtils;
import com.approval.module.auth.dto.LoginDto;
import com.approval.module.auth.dto.RegisterDto;
import com.approval.module.auth.service.IAuthService;
import com.approval.module.auth.vo.LoginVo;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

/**
 * 认证控制器
 */
@Tag(name = "认证管理")
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final IAuthService authService;
    private final JwtUtils jwtUtils;

    @Operation(summary = "用户注册")
    @PostMapping("/register")
    public Result<LoginVo> register(@Valid @RequestBody RegisterDto registerDto) {
        LoginVo loginVo = authService.register(registerDto);
        return Result.success(loginVo);
    }

    @Operation(summary = "用户登录")
    @PostMapping("/login")
    public Result<LoginVo> login(@Valid @RequestBody LoginDto loginDto) {
        LoginVo loginVo = authService.login(loginDto);
        return Result.success(loginVo);
    }

    @Operation(summary = "获取用户信息")
    @GetMapping("/userinfo")
    public Result<LoginVo.UserInfoVo> getUserInfo(@RequestHeader("Authorization") String token) {
        // 从token中提取用户名
        String actualToken = token.replace("Bearer ", "");
        String username = jwtUtils.getUsernameFromToken(actualToken);

        LoginVo.UserInfoVo userInfo = authService.getUserInfo(username);
        return Result.success(userInfo);
    }

    @Operation(summary = "用户登出")
    @PostMapping("/logout")
    public Result<Void> logout() {
        // JWT是无状态的，前端删除token即可
        // 如果使用Redis，可以在这里将token加入黑名单
        return Result.success();
    }
}
