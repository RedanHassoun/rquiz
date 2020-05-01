package com.raiseup.rquiz.common;

import com.auth0.jwt.JWT;
import com.raiseup.rquiz.exceptions.AppException;
import com.raiseup.rquiz.exceptions.IllegalOperationException;
import com.raiseup.rquiz.exceptions.InvalidTokenException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import java.util.Calendar;
import java.util.Date;
import static com.auth0.jwt.algorithms.Algorithm.HMAC512;
import static com.raiseup.rquiz.common.AppConstants.*;

@Component
public class JwtHelper {
    private static final Logger logger = LoggerFactory.getLogger(JwtHelper.class);
    private final String secret = AppUtils.getEnvironmentVariable(TOKEN_SECRET_KEY);

    public String generateJsonWebToken(String userId, String username) throws AppException {
        if (this.secret == null) {
            throw new NullPointerException(String.format(
                    "Cannot generate token because environment variable '%s' is not defined",
                    TOKEN_SECRET_KEY));
        }
        if (username == null) {
            throw new IllegalOperationException(
                    "Cannot generate token because username is not defined");
        }
        return JWT.create()
                .withSubject(this.buildTokenSubject(userId, username))
                .withExpiresAt(this.addDaysFromNow(TOKEN_EXPIRATION_IN_DAYS))
                .sign(HMAC512(this.secret.getBytes()));
    }

    private String buildTokenSubject(String userId, String username){
        JSONObject jsonUser = new JSONObject();

        jsonUser.put("id", userId);
        jsonUser.put("username", username);

        return jsonUser.toString();
    }

    private Date addDaysFromNow(int numOfDays) {
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.DATE, numOfDays);
        return calendar.getTime();
    }

    public String extractSubjectFromAuthHeader(String authHeader) throws AppException {
        if (this.secret == null) {
            throw new NullPointerException(String.format(
                    "Cannot handle token because environment variable '%s' is not defined",
                    TOKEN_SECRET_KEY));
        }

        String token = this.extractJsonWebToken(authHeader);
        if (token == null) {
            throw new InvalidTokenException("Cannot extract token from request");
        }

        try {
            return JWT.require(HMAC512(this.secret.getBytes()))
                    .build()
                    .verify(token)
                    .getSubject();
        } catch (Exception ex) {
            logger.error(String.format(
                    "An error occurred while parsing the token, returning null, Error: %s", ex.getMessage()));
            throw ex;
        }
    }

    private String extractJsonWebToken(String authHeader) {
       if (authHeader == null) {
           return null;
       }

        if (StringUtils.hasText(authHeader) && authHeader.startsWith(TOKEN_PREFIX)) {
            return authHeader.substring(TOKEN_PREFIX.length(), authHeader.length());
        }

        return null;
    }
}
