package org.deliverma.api.utils;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.Authentication;

public class SecurityUtils {
    private SecurityUtils(){}
    public static String currentUserEmail(){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if(auth == null || !auth.isAuthenticated()){
            throw new IllegalStateException("No authticated user found");
        }
        Object principal = auth.getPrincipal();
        if(!(principal instanceof  UserDetails userDetails)){
            throw new IllegalStateException("Invalid authentication principal");
        }
        return userDetails.getUsername();
    }
}
