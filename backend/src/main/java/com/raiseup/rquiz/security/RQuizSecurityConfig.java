package com.raiseup.rquiz.security;

import com.raiseup.rquiz.common.JwtHelper;
import com.raiseup.rquiz.services.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.context.annotation.Bean;
import java.util.Arrays;

@EnableWebSecurity
public class RQuizSecurityConfig extends WebSecurityConfigurerAdapter {

    @Value("${rquiz.serverAddress}")
    private String serverAddress;

    @Value("${rquiz.clientAddress}")
    private String clientAddress;

    private UserDetailsServiceImpl userDetailsService;
    private BCryptPasswordEncoder bCryptPasswordEncoder;
    private JwtHelper jwtHelper;

    public RQuizSecurityConfig(UserDetailsServiceImpl userDetailsService,
                               BCryptPasswordEncoder bCryptPasswordEncoder,
                               JwtHelper jwtHelper) {
        this.userDetailsService = userDetailsService;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
        this.jwtHelper = jwtHelper;
    }

    @Bean
    public JWTAuthenticationFilter jWTAuthorizationFilter() {
        return new JWTAuthenticationFilter(this.jwtHelper);
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.cors().and().csrf().disable().authorizeRequests()
                 .antMatchers( "/api/**").authenticated()
                .and()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);
        http.addFilterAfter(jWTAuthorizationFilter(), UsernamePasswordAuthenticationFilter.class);
    }

    @Override
    public void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userDetailsService).passwordEncoder(bCryptPasswordEncoder);
    }

    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList(this.serverAddress, this.clientAddress));
        configuration.setAllowedMethods(Arrays.asList("GET","POST","PUT","DELETE", "PATCH"));
        configuration.setAllowedHeaders(Arrays.asList("content-type", "Authorization"));
        configuration.setAllowCredentials(true);

        final UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
