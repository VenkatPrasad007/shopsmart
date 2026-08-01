package com.shopsmart.apigateway.filter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import com.shopsmart.apigateway.util.JwtUtil;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class AuthenticationFilter extends
        AbstractGatewayFilterFactory<AuthenticationFilter.Config> {

    @Autowired
    private ApplicationContext applicationContext;

    public AuthenticationFilter() {
        super(Config.class);
    }

    private JwtUtil getJwtUtil() {
        return applicationContext.getBean(JwtUtil.class);
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            String authHeader = exchange.getRequest()
                    .getHeaders()
                    .getFirst(HttpHeaders.AUTHORIZATION);

            // No token provided
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                log.warn("Missing or invalid Authorization header");
                exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                return exchange.getResponse().setComplete();
            }

            String token = authHeader.substring(7);

            // Token invalid or expired
            if (!getJwtUtil().isTokenValid(token)) {
                log.warn("Invalid JWT token");
                exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                return exchange.getResponse().setComplete();
            }

            // Token valid — pass user email downstream
            String email = getJwtUtil().extractEmail(token);
            log.info("Authenticated request from: {}", email);

            return chain.filter(
                exchange.mutate()
                    .request(r -> r.header("X-User-Email", email))
                    .build()
            );
        };
    }

    public static class Config {}
}