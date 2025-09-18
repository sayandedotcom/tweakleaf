from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import HumanMessage, AIMessage

from tweak.coverletter.schemas import CoverLetterStructuredOutput, CoverLetterStructuredOutputForUpdateUserContext
from tweak.coverletter.prompts import system_prompt_to_update_user_context_for_coverletter, human_prompt_to_tweak_coverletter, system_prompt_to_tweak_coverletter

from tweak.models.factory import ModelFactory

from tweak.utils.query import get_coverletter_context, update_coverletter_context


class CoverLetterNodes:
    def __init__(self): 
        self._llm = None
        self._current_model = None
        self._current_key = None
    
    def _get_llm(self, model: str, key: str):
        """Get or create LLM instance, reusing if model and key are the same"""
        if (self._llm is None or 
            self._current_model != model or 
            self._current_key != key):
            
            model_factory = ModelFactory()
            self._llm = model_factory.create_model(provider=model, api_key=key)
            self._current_model = model
            self._current_key = key
            
            print(f"🔧 Creating new LLM with provider: {model}, key length: {len(key) if key else 0}")
        else:
            print(f"🔧 Reusing existing LLM for provider: {model}")
            
        return self._llm
    
    def analyze_update_context_for_coverletter(self, state: dict) -> dict:
        """Analyze user message and determine if it should be appended to context"""
        
        # Get or create LLM instance
        llm = self._get_llm(state["model"], state["key"])
        
        # Fetch existing cover letter context from Supabase and store in state
        existing_context = get_coverletter_context(state["user_id"])
        
        print("EXISTING_CONTEXT:============================================================", existing_context)
        
        state["coverletter_context"] = existing_context
        
        chat_template = ChatPromptTemplate([
            ('system', system_prompt_to_update_user_context_for_coverletter),
            ('human', "User message: {user_message}")
        ])
        
        # Create the chain with structured output
        chain = chat_template | llm.with_structured_output(CoverLetterStructuredOutputForUpdateUserContext)
        
        user_msg = state.get("user_message", "No message provided")
        
        print(f"🔧 Invoking chain with user_message: {user_msg}")
        
        response = chain.invoke({
            "user_message": user_msg,
        })
        
        print("RESPONSE:============================================================", response.response)
        
        # Update context in database if response is "append"
        if response.response == "append":
            # Concatenate new message with existing context (with dots)
            current_context = existing_context if existing_context else ""
            new_context = current_context + ". " + state["user_message"] if current_context else state["user_message"]
            
            # Update in database
            update_success = update_coverletter_context(state["user_id"], new_context)
            
            print("UPDATE_SUCCESS:============================================================", update_success)
            
            if not update_success:
                print(f"Warning: Failed to update cover letter context for user {state['user_id']}")
            
            # Update the context in state with the concatenated context
            state["coverletter_context"] = new_context
        
        return state
    
    def coverletter_analysis(self, state: dict) -> dict:
        """Analyze the cover letter and return a structured output"""
        
        # Get or create LLM instance
        llm = self._get_llm(state["model"], state["key"])
        
        coverletter_context = state.get("coverletter_context")
        
        chat_template = ChatPromptTemplate([
            ('system', system_prompt_to_tweak_coverletter),
            MessagesPlaceholder("history"),
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
            "history": chat_history if chat_history else [],
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
        
        # Get existing messages from state
        existing_messages = state.get("messages", [])
        
        # Add current user message
        current_user_message = HumanMessage(content=user_message if user_message else "No specific message")
        
        # Add assistant response
        assistant_message = AIMessage(content=response.short_response)
        
        # Combine all messages in LangChain format
        all_messages = existing_messages + [current_user_message, assistant_message]
        
        # Process the cover letter (integrated compilation logic)
        try:
            # Return the processed cover letter with all necessary data
            return {
                "messages": all_messages,
                "coverletter": cleaned_content,
                "status": 200,
                "short_response": response.short_response,
                "message": "Cover letter processed successfully"
            }
            
        except Exception as e:
            print(f"Error in coverletter_analysis: {e}")
            # Return error state if processing fails
            return {
                "messages": all_messages,
                "coverletter": cleaned_content,
                "status": 500,
                "error": f"Failed to process cover letter: {str(e)}",
                "message": "Cover letter processing failed",
                "short_response": "An error occurred while processing the cover letter"
            }