package com.raiseup.rquiz.security;

import com.auth0.jwt.JWT;
import com.raiseup.rquiz.models.ApplicationUser;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.raiseup.rquiz.repo.ApplicationUserRepository;
import org.json.JSONObject;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import static com.auth0.jwt.algorithms.Algorithm.HMAC512;
import static com.raiseup.rquiz.security.SecurityConstants.*;

public class JWTAuthenticationFilter extends UsernamePasswordAuthenticationFilter {
    private AuthenticationManager authenticationManager;
    private ApplicationUserRepository applicationUserRepository;

    public JWTAuthenticationFilter(AuthenticationManager authenticationManager,
                                   ApplicationUserRepository applicationUserRepository) {
        this.authenticationManager = authenticationManager;
        this.applicationUserRepository = applicationUserRepository;
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest req,
                                                HttpServletResponse res) throws AuthenticationException {
        try {
            ApplicationUser creds = new ObjectMapper()
                    .readValue(req.getInputStream(), ApplicationUser.class);

            return authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            creds.getUsername(),
                            creds.getPassword(),
                            new ArrayList<>())
            );
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest req,
                                            HttpServletResponse res,
                                            FilterChain chain,
                                            Authentication auth) throws IOException, ServletException {
        String username = ((User) auth.getPrincipal()).getUsername();

        String token = JWT.create()
                .withSubject(this.buildTokenSubject(username))
                .withExpiresAt(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .sign(HMAC512(SECRET.getBytes()));

        res.setHeader("Access-Control-Expose-Headers","Authorization");
        res.setHeader(HEADER_STRING, TOKEN_PREFIX + token);
    }

    private String buildTokenSubject(String username){
        ApplicationUser user = this.applicationUserRepository.findByUsername(username);

        JSONObject jsonUser = new JSONObject();

        jsonUser.put("id", user.getId());
        jsonUser.put("username", username);

        return jsonUser.toString();
    }
}
