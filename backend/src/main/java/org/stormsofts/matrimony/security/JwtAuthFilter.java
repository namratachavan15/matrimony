package org.stormsofts.matrimony.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

/**
 * Reads the "Authorization: Bearer <token>" header, validates the JWT, and if
 * valid, populates the SecurityContext with an authenticated principal whose
 * name is the numeric user id and whose single authority is ROLE_<role>.
 *
 * Downstream controllers/services should read the current user id via
 * {@link AuthUtil#currentUserId()} rather than trusting any id supplied by
 * the client in the request body/params.
 */
@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    public JwtAuthFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                     @NonNull HttpServletResponse response,
                                     @NonNull FilterChain filterChain) throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            try {
                if (jwtService.isTokenValid(token)) {
                    Integer userId = jwtService.extractUserId(token);
                    String role = jwtService.extractRole(token);
                    String authority = "ROLE_" + (role != null ? role.toUpperCase() : "USER");

                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(
                                    String.valueOf(userId),
                                    null,
                                    List.of(new SimpleGrantedAuthority(authority))
                            );
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            } catch (Exception ex) {
                // Invalid/expired token: leave context unauthenticated; downstream
                // authorizeHttpRequests rules will reject protected endpoints with 401/403.
                SecurityContextHolder.clearContext();
            }
        }

        filterChain.doFilter(request, response);
    }
}
