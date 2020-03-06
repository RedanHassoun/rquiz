package com.raiseup.rquiz.common;

import com.auth0.jwt.JWT;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.raiseup.rquiz.exceptions.AppException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.HashMap;

public class AppUtils {
    private static Logger logger = LoggerFactory.getLogger(AppUtils.class);

    public static String getUserIdFromAuthorizationHeader(String authorization){
        if(authorization == null){
            throw new NullPointerException("Authorization string cannot be null");
        }

        String arr[] = authorization.split(" ", 2);

        if(arr.length != 2){
            throw new IllegalArgumentException("authorization section must start " +
                    "with 'Bearer' and then the json web token");
        }

        String token = arr[1];
        DecodedJWT decodedToken = JWT.decode(token);
        String tokenSubject = decodedToken.getSubject();
        JSONObject subjectJson = new JSONObject(tokenSubject);
        return subjectJson.get("id").toString();
    }

    public static boolean isPaginationParamsValid(Integer page, Integer size)
    {
        if(page == null && size == null)
            return true;

        if(page != null && size != null)
            return true;

        return false;
    }

    public static String toStringNullSafe(Object object) {
        if(object == null){
            return null;
        }
        return object.toString();
    }

    public static void throwAndLogException(AppException exceptionToThrow) throws AppException {
        logger.error(exceptionToThrow.getMessage());
        throw exceptionToThrow;
    }

    public static String getEnvironmentVariable(String variableName) {
        String variableValue = null;
        try{
            variableValue = System.getenv(variableName);
            if (variableValue == null) {
                logger.error(String.format("Environment variable '%s' must be defined", variableName));
            }
            return variableValue;
        }catch (Exception ex) {
            logger.error(String.format("Cannot get variable %s from system environment",
                    variableName), ex);
            return null;
        }
    }

    public static String paramsMapToString(HashMap<String, Object> map) {
        if (map == null) {
            return null;
        }
        StringBuilder stringBuilder = new StringBuilder();
        stringBuilder.append("[ ");
        map.entrySet().forEach(entry-> {
            stringBuilder.append(entry.getKey());
            stringBuilder.append(" : ");
            stringBuilder.append(entry.getValue());
            stringBuilder.append(" , ");
        });
        stringBuilder.append(" ]");

        return stringBuilder.toString();
    }
}