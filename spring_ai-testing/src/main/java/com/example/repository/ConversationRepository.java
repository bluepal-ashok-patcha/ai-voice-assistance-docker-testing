package com.example.repository;



import org.springframework.data.jpa.repository.JpaRepository;
import com.example.entity.Conversation;

public interface ConversationRepository extends JpaRepository<Conversation, Long> {
}
