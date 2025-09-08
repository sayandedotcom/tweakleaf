from datetime import datetime

from langchain_core.prompts import ChatPromptTemplate

from tweak.coverletter.schemas import CoverLetterRequestSchema, CoverLetterStructuredOutput, CoverLetterStructuredOutputForUpdateUserContext, ChatMessage
from tweak.coverletter.prompts import system_prompt_to_update_user_context_for_coverletter, human_prompt_to_tweak_coverletter, system_prompt_to_tweak_coverletter

from tweak.models.factory import ModelFactory

from tweak.utils.supabase import get_coverletter_context, update_coverletter_context

class CoverLetterNodes:
    def __init__(self): 
        pass
    
    def analyze_update_context_for_coverletter(self, state: dict) -> dict:
        """Analyze user message and determine if it should be appended to context"""
        # Validate required fields
        if not state.get("model") or not state.get("key") or not state.get("user_id"):
            return {
                "messages": [],
                "coverletter": state.get("coverletter", ""),
                "status": 400,
                "error": "Model, API key, and user_id are required",
                "short_response": "Missing required fields"
            }
        
        # Dynamically create LLM based on user's model and key
        model_factory = ModelFactory()
        
        # Determine model provider from model name
        model = state["model"]
        model_provider = model.lower()
        
        if model_provider not in ["openai", "anthropic", "gemini", "deepseek"]:
            # If user provides a custom model name, try to infer provider
            if "gpt" in model.lower():
                model_provider = "openai"
            elif "claude" in model.lower():
                model_provider = "anthropic"
            elif "gemini" in model.lower():
                model_provider = "gemini"
            elif "deepseek" in model.lower():
                model_provider = "deepseek"
            else:
                # Throw error if we can't determine the provider
                raise ValueError(f"Unable to determine model provider for model: {model}. Please specify a supported model or use a model name that clearly indicates the provider (e.g., gpt-4, claude-3, gemini-pro, deepseek-chat)")
        
        llm = model_factory.create_model(
            provider=model_provider, 
            api_key=state["key"]
        )
        
        # Fetch existing cover letter context from Supabase and store in state
        existing_context = get_coverletter_context(state["user_id"])
        
        state["coverletter_context"] = existing_context
        
        chat_template = ChatPromptTemplate([
            ('system', system_prompt_to_update_user_context_for_coverletter),
        ])
        
        # Create the chain with structured output
        chain = chat_template | llm.with_structured_output(CoverLetterStructuredOutputForUpdateUserContext)
        
        user_msg = state.get("user_message", "No message provided")
        
        response = chain.invoke({
            "user_message": user_msg,
        })
        
        
        # Update context in database if response is "append"
        if response.response == "append":
            # Concatenate new message with existing context (with dots)
            current_context = existing_context if existing_context else ""
            new_context = current_context + ". " + state["user_message"] if current_context else state["user_message"]
            
            # Update in database
            update_success = update_coverletter_context(state["user_id"], new_context)
            
            if not update_success:
                print(f"Warning: Failed to update cover letter context for user {state['user_id']}")
            
            # Update the context in state with the concatenated context
            state["coverletter_context"] = new_context
        
        return state
    
    def coverletter_analysis(self, state: dict) -> dict:
        """Analyze the cover letter and return a structured output"""
        
        # Dynamically create LLM based on user's model and key
        model_factory = ModelFactory()
        
        # Determine model provider from model name
        model = state["model"]
        model_provider = model.lower()
        
        llm = model_factory.create_model(
            provider=model_provider, 
            api_key=state["key"]
        )
        
        # Fetch cover letter context from Supabase
        coverletter_context = state.get("coverletter_context")
        
        chat_template = ChatPromptTemplate([
            ('system', system_prompt_to_tweak_coverletter),
            ('human', human_prompt_to_tweak_coverletter)
        ])
        
        # Create the chain with structured output
        chain = chat_template | llm.with_structured_output(CoverLetterStructuredOutput)
        
        # Prepare chat history for the prompt
        chat_history = state.get("chat_history", [])
        user_message = state.get("user_message", "")
        
        response = chain.invoke({
            "model": state["model"],
            "key": state["key"],
            "user_info": state.get("user_info", "Not provided"),
            "company_info": state.get("company_info", "Not provided"),
            "job_description": state.get("job_description", "Not provided"),
            "coverletter": state.get("coverletter", ""),
            "coverletter_context": str(coverletter_context) if coverletter_context else "No previous context",
            "user_message": user_message if user_message else "No specific message",
            "chat_history": str(chat_history) if chat_history else "No chat history",
        })
        
        # Clean the response content - remove markdown code blocks if present
        cleaned_content = response.coverletter
        if cleaned_content.startswith("```latex"):
            cleaned_content = cleaned_content[8:]  # Remove ```latex
        if cleaned_content.startswith("```"):
            cleaned_content = cleaned_content[3:]  # Remove ```
        if cleaned_content.endswith("```"):
            cleaned_content = cleaned_content[:-3]  # Remove ending ```
        
        # Remove any leading/trailing whitespace
        cleaned_content = cleaned_content.strip()
        
        # Create chat messages for the conversation
        current_time = datetime.now().isoformat()
        
        # Add user message if provided
        chat_messages = []
        if user_message:
            chat_messages.append(ChatMessage(
                role="user",
                content=user_message,
                timestamp=current_time
            ))
        
        # Add assistant response
        chat_messages.append(ChatMessage(
            role="assistant",
            content=response.short_response,
            timestamp=current_time
        ))
        
        # Combine with existing chat history
        all_messages = state.get("messages", []) + chat_messages
        
        return {
            "messages": all_messages,
            "coverletter": cleaned_content,
            "status": 200,
            "short_response": response.short_response,
        }
    
    def compile_coverletter(self, state: dict) -> dict:
        """Process the cover letter (removed async compilation for now)"""
        try:
            # Get the cover letter content from state
            coverletter_content = state["coverletter"]
            messages = state.get("messages", [])
            short_response = state.get("short_response", "Cover letter updated successfully")
            
            # Return the processed cover letter (without PDF compilation for now)
            return {
                "coverletter": coverletter_content,
                "messages": messages,
                "status": 200,
                "short_response": short_response,
                "message": "Cover letter processed successfully"
            }
            
        except Exception as e:
            print(f"Error in compile_coverletter: {e}")
            # Return error state if processing fails
            return {
                "coverletter": state.get("coverletter", ""),
                "messages": state.get("messages", []),
                "status": 500,
                "error": f"Failed to process cover letter: {str(e)}",
                "message": "Cover letter processing failed"
            }