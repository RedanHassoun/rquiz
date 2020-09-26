package com.raiseup.rquiz.security;

import com.raiseup.rquiz.common.JwtHelper;
import com.raiseup.rquiz.exceptions.InvalidTokenException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import static com.raiseup.rquiz.common.AppConstants.HEADER_STRING;

public class JWTAuthorizationFilter extends OncePerRequestFilter {
    private final Logger logger;

    private JwtHelper jwtHelper;

    public JWTAuthorizationFilter(JwtHelper jwtHelper, Logger logger) {
        this.jwtHelper = jwtHelper;
        this.logger = logger;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest req,
                                    HttpServletResponse res,
                                    FilterChain filterChain) throws IOException,
                                                              ServletException {
        try {
            String authHeader = req.getHeader(HEADER_STRING);
            final String subject = this.jwtHelper.extractSubjectFromAuthHeader(authHeader);
            UsernamePasswordAuthenticationToken authentication;
            if (subject != null) {
                authentication = new UsernamePasswordAuthenticationToken(
                        subject, null, new ArrayList<>());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(req));

                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch(InvalidTokenException ex) {
            this.logger.info(String.format("Cannot parse token for request %s", req.getRequestURL()));
        } catch (Exception ex) {
            this.logger.error(String.format("Cannot authenticate user, error: %s", ex.getMessage()));
        }

        filterChain.doFilter(req, res);
    }
}
