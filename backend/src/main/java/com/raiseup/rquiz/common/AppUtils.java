package com.raiseup.rquiz.common;

import com.auth0.jwt.JWT;
import com.auth0.jwt.interfaces.DecodedJWT;
import javafx.util.Pair;
import org.json.JSONObject;

import java.util.HashMap;

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

    public static HashMap<String, Object> createQueryParametersMap(Pair<String, Object> ... pairs){
        if(pairs == null){
            return null;
        }

        HashMap<String, Object> paramsMap = new HashMap<>();

        for (Pair<String, Object> pair : pairs) {
            paramsMap.put(pair.getKey(), pair.getValue());
        }

        return paramsMap;
    }
}
