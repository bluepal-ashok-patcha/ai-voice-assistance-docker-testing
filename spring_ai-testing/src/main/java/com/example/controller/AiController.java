package com.example.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.entity.Conversation;
import com.example.repository.ConversationRepository;
import com.example.service.AiService;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/ai")
public class AiController {
	
	
	@Autowired
	private AiService aiService;
	
	@Autowired
	private ConversationRepository conversationRepository;
	
	@PostMapping("/ask")
	public String postAiResponse(@RequestBody String question) {
	    return aiService.getResponseFromOpenAI(question);
	}
	
	
	@GetMapping("/history")
	public List<Conversation> getHistory() {
	    return conversationRepository.findAll();
	}



}
