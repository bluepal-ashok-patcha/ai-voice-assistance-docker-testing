package com.example.service;

import com.example.entity.Conversation;
import com.example.repository.ConversationRepository;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AiService {

    // private final ChatClient chatClient;
    // private final ConversationRepository conversationRepository;

    // @Autowired
    // public AiService(ChatClient chatClient, ConversationRepository conversationRepository) {
    //     this.chatClient = chatClient;
    //     this.conversationRepository = conversationRepository;
    // }

    // public String getResponseFromOpenAI(String text) {
    //     String response = chatClient.prompt(text).call().content();

    //     Conversation conv = new Conversation();
    //     conv.setQuestion(text);
    //     conv.setAnswer(response);
    //     conv.setCreatedAt(LocalDateTime.now());
    //     conversationRepository.save(conv);

    //     return response;
    // }
}
