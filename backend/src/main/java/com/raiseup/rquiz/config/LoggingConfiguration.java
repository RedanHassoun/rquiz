package com.raiseup.rquiz.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InjectionPoint;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.context.annotation.*;

@Configuration
public class LoggingConfiguration {
    @Bean
    @Scope(BeanDefinition.SCOPE_PROTOTYPE)
    public Logger Logger(InjectionPoint injectionPoint) {
        Class<?> containingClass = injectionPoint.getMethodParameter().getContainingClass();
        return LoggerFactory.getLogger(containingClass);
    }
}
