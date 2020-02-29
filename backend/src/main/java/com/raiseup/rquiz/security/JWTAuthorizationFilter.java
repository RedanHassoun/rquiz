package com.raiseup.rquiz.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.raiseup.rquiz.common.AppUtils;
import com.raiseup.rquiz.config.BeanConfiguration;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import static com.raiseup.rquiz.common.AppConstants.HEADER_STRING;
import static com.raiseup.rquiz.common.AppConstants.TOKEN_PREFIX;

public class JWTAuthorizationFilter extends BasicAuthenticationFilter {
    private Logger logger = LoggerFactory.getLogger(JWTAuthorizationFilter.class);
    private String secret = AppUtils.getEnvironmentVariable("RQUIZ_TOKEN_SECRET");

    public JWTAuthorizationFilter(AuthenticationManager authManager) {
        super(authManager);
    }

    @Override
    protected void doFilterInternal(HttpServletRequest req,
                                    HttpServletResponse res,
                                    FilterChain chain) throws IOException,
                                                              ServletException {
        String header = req.getHeader(HEADER_STRING);

        if (header == null || !header.startsWith(TOKEN_PREFIX)) {
            chain.doFilter(req, res);
            return;
        }

        UsernamePasswordAuthenticationToken authentication = getAuthentication(req);

        SecurityContextHolder.getContext().setAuthentication(authentication);

        res.setHeader("Access-Control-Expose-Headers","Authorization");

        chain.doFilter(req, res);
    }

    private UsernamePasswordAuthenticationToken getAuthentication(HttpServletRequest request) {
        if (this.secret == null) {
            throw new NullPointerException(
                    "RQUIZ_TOKEN_SECRET environment variable should be defined");
        }

        String token = request.getHeader(HEADER_STRING);
        if (token != null) {
            String user = null;
            try {
                user = JWT.require(Algorithm.HMAC512(this.secret.getBytes()))
                        .build()
                        .verify(token.replace(TOKEN_PREFIX, ""))
                        .getSubject();
            } catch (Exception ex) {
                this.logger.error("An error occurred while parsing the token, returning null", ex);
                return null;
            }

            if (user != null) {
                return new UsernamePasswordAuthenticationToken(user, null, new ArrayList<>());
            }
            return null;
        }
        return null;
    }
}
