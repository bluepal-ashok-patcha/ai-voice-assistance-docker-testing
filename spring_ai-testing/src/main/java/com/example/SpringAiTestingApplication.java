package com.example;


import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class SpringAiTestingApplication {

	public static void main(String[] args) {
		SpringApplication.run(SpringAiTestingApplication.class, args);
	}
	
//	@Bean
//	public CommandLineRunner runner(ChatClient.Builder builder) {
//	    return args -> {
//	        ChatClient chatClient = builder.build();
//	        String response = chatClient.prompt("can we build a body without protein powder and how much time it will take").call().content();							
//	        System.out.println(response);
//	    };
//	}

}
