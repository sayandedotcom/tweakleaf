from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import HumanMessage, AIMessage

from tweak.resumes.schemas import ResumeStructuredOutput, ResumeHumanizeStructuredOutput
from tweak.resumes.prompts import human_prompt_to_tweak_resume, system_prompt_to_tweak_resume, system_prompt_to_humanize_pro_for_resume

from tweak.models.factory import ModelFactory

class ResumeNodes:
    def __init__(self): 
        self._llm_cache = {}
    
    def _get_llm(self, model: str, key: str):
        """Get or create LLM instance with improved caching"""
        cache_key = f"{model}_{hash(key)}"
        
        if cache_key not in self._llm_cache:
            # Create new LLM instance
            model_factory = ModelFactory()
            self._llm_cache[cache_key] = model_factory.create_model(provider=model, api_key=key)
            print(f"🔧 Creating new LLM with provider: {model}, key length: {len(key) if key else 0}")
        else:
            print(f"🔧 Reusing cached LLM for provider: {model}")
            
        return self._llm_cache[cache_key]
    
    def _get_llm_with_model(self, provider: str, key: str, model_name: str):
        """Get or create LLM instance with specific model name"""
        cache_key = f"{provider}_{model_name}_{hash(key)}"
        
        if cache_key not in self._llm_cache:
            # Create new LLM instance with specific model
            model_factory = ModelFactory()
            self._llm_cache[cache_key] = model_factory.create_model(provider=provider, api_key=key, model=model_name)
            print(f"🔧 Creating new LLM with provider: {provider}, model: {model_name}, key length: {len(key) if key else 0}")
        else:
            print(f"🔧 Reusing cached LLM for provider: {provider}, model: {model_name}")
            
        return self._llm_cache[cache_key]
    
    def analyze_update_context_for_resume(self, state: dict) -> dict:
        """Smart rule-based context filtering without LLM calls or database operations"""
        
        user_message = state.get("user_message", "").strip()
        existing_context = state.get("resume_context", "")
        
        print(f"🔧 Smart context filtering for message: '{user_message}'")
        print(f"🔧 Existing context length: {len(existing_context)}")
        
        # Rule-based filtering to determine if message should be appended
        should_append = self._should_append_to_context(user_message)
        
        if should_append:
            # Store user message separately instead of concatenating
            state["new_resume_context"] = user_message
            print(f"🔧 User message stored as new context: '{user_message}'")
        else:
            # Clear new context if message is filtered out
            state["new_resume_context"] = ""
            print("🔧 Message filtered out, no new context added")
        
        return state
    
    def _should_append_to_context(self, user_message: str) -> bool:
        """Rule-based logic to determine if message should be appended to context"""
        if not user_message or len(user_message.strip()) < 3:
            return False
        
        user_message_lower = user_message.lower().strip()
        
        # Simple acknowledgments to ignore
        ignore_patterns = [
            'ok', 'thanks', 'yes', 'no', 'good', 'hello', 'hi', 'hey',
            'sure', 'alright', 'fine', 'great', 'awesome', 'perfect',
            'done', 'got it', 'understood', 'cool', 'nice', 'excellent'
        ]
        
        if user_message_lower in ignore_patterns:
            return False
        
        # Keywords that indicate valuable context
        valuable_keywords = [
            'prefer', 'style', 'tone', 'add', 'remove', 'change', 'modify',
            'emphasize', 'focus', 'highlight', 'mention', 'include', 'exclude',
            'professional', 'casual', 'formal', 'technical', 'creative',
            'experience', 'skill', 'achievement', 'background', 'qualification',
            'company', 'industry', 'role', 'position', 'job', 'career',
            'leadership', 'team', 'project', 'management', 'development',
            'shorter', 'longer', 'brief', 'detailed', 'specific', 'general'
        ]
        
        # Check if message contains valuable keywords
        has_valuable_keywords = any(keyword in user_message_lower for keyword in valuable_keywords)
        
        # Check if message is substantial (not just single words)
        is_substantial = len(user_message.split()) >= 2
        
        # Check if message contains specific instructions or preferences
        has_instructions = any(word in user_message_lower for word in [
            'make', 'do', 'should', 'want', 'need', 'like', 'dislike',
            'instead', 'rather', 'better', 'worse', 'more', 'less'
        ])
        
        # Append if it has valuable keywords, is substantial, or contains instructions
        should_append = has_valuable_keywords or (is_substantial and has_instructions)
        
        print(f"🔧 Context decision - Valuable keywords: {has_valuable_keywords}, "
              f"Substantial: {is_substantial}, Instructions: {has_instructions}, "
              f"Append: {should_append}")
        
        return should_append
    
    def llm_router(self, state: dict) -> dict:
        """Route to weak or strong LLM based on user message length and existing messages"""
        user_message = state.get("user_message", "")
        message_length = len(user_message.strip())
        provider = state.get("model", "gemini")
        messages = state.get("messages", [])
        
        print(f"🔧 LLM Router - Message length: {message_length} characters")
        print(f"🔧 LLM Router - Existing messages length: {len(messages)} messages")
        
        # First message (no existing messages) should always use strong model
        if not messages or len(messages) == 0:
            state["llm_type"] = "strong"
            strong_model = ModelFactory.get_strong_model(provider)
            print(f"🔧 First message - Routing to STRONG LLM ({strong_model})")
        elif message_length > 100:
            state["llm_type"] = "strong"
            strong_model = ModelFactory.get_strong_model(provider)
            print(f"🔧 Long message - Routing to STRONG LLM ({strong_model})")
        else:
            state["llm_type"] = "weak"
            weak_model = ModelFactory.get_weak_model(provider)
            print(f"🔧 Short message - Routing to WEAK LLM ({weak_model})")
        
        return state
    
    def resume_analysis_weak(self, state: dict) -> dict:
        """Resume analysis using weak LLM"""
        provider = state.get("model", "gemini")  # Get provider from client
        weak_model = ModelFactory.get_weak_model(provider)
        return self._resume_analysis_with_model(state, provider, weak_model)
    
    def resume_analysis_strong(self, state: dict) -> dict:
        """Resume analysis using strong LLM"""
        provider = state.get("model", "gemini")  # Get provider from client
        strong_model = ModelFactory.get_strong_model(provider)
        return self._resume_analysis_with_model(state, provider, strong_model)
    
    def _resume_analysis_with_model(self, state: dict, provider: str, model_name: str) -> dict:
        """Analyze the resume and return a structured output with specific model"""
        
        # Get or create LLM instance with the specified provider and model
        llm = self._get_llm_with_model(provider, state["key"], model_name)
        
        chat_template = ChatPromptTemplate([
            ('system', system_prompt_to_tweak_resume),
            MessagesPlaceholder("history"),
            ('human', human_prompt_to_tweak_resume)
        ])
        
        # Create the chain with structured output
        chain = chat_template | llm.with_structured_output(ResumeStructuredOutput)
        
        # Prepare data for the prompt - get messages from state for history
        messages = state.get("messages", [])
        user_message = state.get("user_message", "")
                
        response = chain.invoke({
            "model": provider,
            "key": state["key"],
            "company_info": state.get("company_info", "Not provided"),
            "job_description": state.get("job_description", "Not provided"),
            "resume": state.get("resume", ""),
            "resume_context": str(state.get("resume_context", "")) if state.get("resume_context", "") else "No previous context",
            "user_message": user_message if user_message else "No specific message",
            "history": messages,  # Provide conversation history to MessagesPlaceholder
        })
        
        # Clean the response content - remove markdown code blocks if present
        cleaned_content = response.resume
        if cleaned_content.startswith("```latex"):
            cleaned_content = cleaned_content[8:]  # Remove ```latex
        if cleaned_content.startswith("```"):
            cleaned_content = cleaned_content[3:]  # Remove ```
        if cleaned_content.endswith("```"):
            cleaned_content = cleaned_content[:-3]  # Remove ending ```
        
        # Remove any leading/trailing whitespace
        cleaned_content = cleaned_content.strip()
        
        # Get existing messages from state
        existing_messages = state.get("messages", [])
        
        # Add current user message
        current_user_message = HumanMessage(content=user_message if user_message else "No specific message")
        
        # Add assistant response
        assistant_message = AIMessage(content=response.short_response)
        
        # Use add_messages to properly append new messages to existing ones
        from langgraph.graph.message import add_messages
        all_messages = add_messages(existing_messages, [current_user_message, assistant_message])
        
        # Process the resume (integrated compilation logic)
        try:
            # Return the processed resume with all necessary data
            return {
                "messages": all_messages,
                "resume": cleaned_content,
                "status": 200,
                "message": f"Resume processed successfully with {model_name}",
                "new_resume_context": state.get("new_resume_context", ""),
                "llm_type": state.get("llm_type", "unknown"),
                "model_used": model_name
            }
            
        except ValueError as e:
            print(f"Value error in resume_analysis: {e}")
            return {
                "messages": all_messages,
                "resume": cleaned_content,
                "status": 400,
                "error": f"Invalid input: {str(e)}",
                "message": f"Resume processing failed due to invalid input with {model_name}",
                "new_resume_context": state.get("new_resume_context", ""),
                "llm_type": state.get("llm_type", "unknown"),
                "model_used": model_name
            }
        except Exception as e:
            print(f"Unexpected error in resume_analysis: {e}")
            return {
                "messages": all_messages,
                "resume": cleaned_content,
                "status": 500,
                "error": f"Failed to process resume: {str(e)}",
                "message": f"Resume processing failed with {model_name}",
                "new_resume_context": state.get("new_resume_context", ""),
                "llm_type": state.get("llm_type", "unknown"),
                "model_used": model_name
            }
    
    def humanize_resume(self, state: dict) -> dict:
        """Humanize the resume using weak model for naturalness"""
        provider = state.get("model", "gemini")
        weak_model = ModelFactory.get_weak_model(provider)
        
        # Get or create LLM instance with weak model
        llm = self._get_llm_with_model(provider, state["key"], weak_model)
        
        chat_template = ChatPromptTemplate([
            ('system', system_prompt_to_humanize_pro_for_resume),
            ('human', "Resume to humanize: {resume}")
        ])
        
        # Create the chain with structured output
        chain = chat_template | llm.with_structured_output(ResumeHumanizeStructuredOutput)
        
        resume = state.get("resume", "")
        
        print(f"🔧 Humanizing resume with {weak_model}")
        
        response = chain.invoke({
            "resume": resume
        })
        
        # Clean the response content - remove markdown code blocks if present
        cleaned_content = response.resume
        if cleaned_content.startswith("```latex"):
            cleaned_content = cleaned_content[8:]  # Remove ```latex
        if cleaned_content.startswith("```"):
            cleaned_content = cleaned_content[3:]  # Remove ```
        if cleaned_content.endswith("```"):
            cleaned_content = cleaned_content[:-3]  # Remove ending ```
        
        # Remove any leading/trailing whitespace
        cleaned_content = cleaned_content.strip()
        
        # Get existing messages from state - no new messages added for humanization
        existing_messages = state.get("messages", [])
        
        try:
            # Return the humanized resume
            return {
                "messages": existing_messages,
                "resume": cleaned_content,
                "status": 200,
                "message": f"Resume humanized with {weak_model}",
                "new_resume_context": state.get("new_resume_context", ""),
                "llm_type": "humanized",
                "model_used": weak_model
            }
            
        except Exception as e:
            print(f"Error in humanize_resume: {e}")
            return {
                "messages": existing_messages,
                "resume": cleaned_content,
                "status": 500,
                "error": f"Failed to humanize resume: {str(e)}",
                "message": f"Resume humanization failed with {weak_model}",
                "new_resume_context": state.get("new_resume_context", ""),
                "llm_type": "humanized",
                "model_used": weak_model
            }