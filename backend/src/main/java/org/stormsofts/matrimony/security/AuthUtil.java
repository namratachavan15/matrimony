package org.stormsofts.matrimony.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

/**
 * Use this everywhere a controller/service needs "who is making this request".
 * NEVER trust a userId supplied by the client (path/query/body) for
 * ownership-sensitive operations -- always resolve it from here instead.
 */
public final class AuthUtil {

    private AuthUtil() {}

    public static Integer currentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            return null;
        }
        try {
            return Integer.valueOf(auth.getName());
        } catch (NumberFormatException e) {
            return null;
        }
    }

    public static String currentRole() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) return null;
        return auth.getAuthorities().stream()
                .findFirst()
                .map(a -> a.getAuthority().replace("ROLE_", ""))
                .orElse(null);
    }

    public static boolean isAdmin() {
        return "ADMIN".equalsIgnoreCase(currentRole());
    }

    public static boolean isAuthenticated() {
        return currentUserId() != null;
    }
}
