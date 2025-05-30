package com.example.apiLibrary.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService; // Spring's UserDetailsService
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component // So it can be injected into SecurityConfig
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger LOGGER_FILTER = LoggerFactory.getLogger(JwtAuthenticationFilter.class);


    private final JwtTokenProvider tokenProvider;
    private final UserDetailsService userDetailsService; // Use Spring's interface

    @Autowired
    public JwtAuthenticationFilter(JwtTokenProvider tokenProvider, UserDetailsService userDetailsService) {
        this.tokenProvider = tokenProvider;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        try {
            String jwt = getJwtFromRequest(request);

            if (StringUtils.hasText(jwt) && tokenProvider.validateToken(jwt)) {
                String username = tokenProvider.getUsernameFromToken(jwt);

                // Load UserDetails (authorities are loaded by UserDetailsService)
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                
                // Note: If you don't want to reload UserDetails every time, 
                // you could trust the roles from the token (getAuthoritiesFromToken)
                // but this requires ensuring token roles are always up-to-date.
                // For simplicity and stronger consistency, reloading UserDetails is common.

                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authentication);
                LOGGER_FILTER.debug("Set authentication for user: {}", username);

            }
        } catch (Exception ex) {
            LOGGER_FILTER.error("Could not set user authentication in security context", ex);
            // Allow unauthenticated request to proceed, downstream rules will catch it if auth is required.
        }

        filterChain.doFilter(request, response);
    }

    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
