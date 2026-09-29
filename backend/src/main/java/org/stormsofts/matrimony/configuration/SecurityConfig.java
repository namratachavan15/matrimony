package org.stormsofts.matrimony.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.stormsofts.matrimony.security.JwtAuthFilter;

import java.util.List;

@Configuration
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    /**
     * CORS is wired directly into Security here (rather than relying on
     * Spring MVC's addCorsMappings/@CrossOrigin being auto-discovered),
     * so there is no ambiguity about which config actually applies to
     * requests that go through the Security filter chain.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173", "http://localhost:5174"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // Always let CORS preflight through, regardless of path.
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // Public: signup / login, and static uploaded files (profile photos etc.)
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/uploads/**").permitAll()

                        // Spring forwards unhandled controller exceptions to /error. If /error is
                        // protected, the client sees a misleading 403 instead of the real error
                        // (e.g. a 500). Letting it through makes real failures visible.
                        .requestMatchers("/error").permitAll()

                        // Public: OTP registration happens BEFORE the user has a token.
                        // Only these two POST endpoints are opened; the rest of /api/admin/user/**
                        // still needs a JWT. (OtpService limits attempts and expires OTPs.)
                        .requestMatchers(HttpMethod.POST,
                                "/api/admin/user/send-otp", "/api/admin/user/verify-otp").permitAll()

                        // Public: read-only reference/master data and landing-page content.
                        // These are needed to render the registration form dropdowns and the
                        // public landing page (stories, testimonials, "about") *before* the
                        // user has logged in, so they must stay unauthenticated.
                        // NOTE: verified against each controller's actual @RequestMapping --
                        // almost everything in this app lives under /api/admin/*, so we
                        // whitelist these specific sub-paths individually rather than opening
                        // up /api/admin/** as a whole (which would also expose
                        // /api/admin/user/**, the real user-data endpoint).
                        .requestMatchers(HttpMethod.GET,
                                "/api/colors/**", "/api/income/**",
                                "/api/admin/country/**", "/api/admin/state/**", "/api/admin/district/**",
                                "/api/admin/education/**", "/api/admin/cast/**", "/api/admin/subcast/**",
                                "/api/admin/gotra/**", "/api/admin/gan/**", "/api/admin/nadi/**",
                                "/api/admin/rashi/**", "/api/admin/nakshtra/**",
                                "/api/admin/height/**", "/api/admin/heightbetween/**",
                                "/api/admin/blood/**", "/api/admin/family/**", "/api/admin/otherinfo/**",
                                "/api/admin/about/**", "/api/admin/story/**", "/api/admin/testimonial/**",
                                "/api/admin/marriage/**"
                        ).permitAll()

                        // Everything else requires a valid authenticated user (JWT).
                        // NOTE: /api/admin/user/** is currently shared by both the admin panel
                        // and the logged-in user's own self-service actions (profile fetch,
                        // change password, etc.), so it is intentionally left at "any authenticated
                        // user" here rather than ROLE_ADMIN, to avoid breaking those existing flows.
                        // True admin-only master-data management endpoints will be locked down to
                        // ROLE_ADMIN in a follow-up security pass once admin/user routes are cleanly
                        // separated (see Part 10 / Part 6 notes).
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}