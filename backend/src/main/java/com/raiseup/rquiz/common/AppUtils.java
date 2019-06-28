package com.raiseup.rquiz.common;

import com.auth0.jwt.JWT;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.json.JSONObject;

public class AppUtils {
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
}
