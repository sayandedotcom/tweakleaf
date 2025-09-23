from tweak.coverletter.graph import CoverLetterWorkflow
from tweak.coverletter.schemas import CoverLetterRequestSchema, CoverLetterResponseSchema, CoverLetterResponseSchemaSerializable
from tweak.utils.threads import get_or_create_thread_id, get_thread_config

class CoverLetterService:
    def __init__(self):
        """Initializes the cover letter service."""
        try:
            workflow = CoverLetterWorkflow()
            self.app = workflow.app
        except Exception as e:
            print(f"Error initializing cover letter workflow: {e}")
            self.app = None
    
    def start_tweaking_coverletter(self, tweaking_data: CoverLetterRequestSchema) -> CoverLetterResponseSchema:
        """Starts the cover letter tweaking process."""
        
        if not self.app:
            return CoverLetterResponseSchema(
                messages=[],
                status=500,
                coverletter="",
                thread_id=""
            )
        
        try:
            # Get or create thread ID
            thread_id = get_or_create_thread_id(tweaking_data.thread_id)
            config = get_thread_config(thread_id)
            
            # Get existing messages from thread state
            
            existing_messages = []
            if thread_id and tweaking_data.thread_id:  # Only if this is an existing thread
                try:
                    state = self.app.get_state(config=config)
                    existing_messages = state.values.get("messages", [])
                    print(f"🔍 Retrieved existing messages for thread {thread_id}: {len(existing_messages)} messages")
                except Exception as e:
                    print(f"Warning: Could not retrieve existing messages for thread {thread_id}: {e}")
                    existing_messages = []
            
            # Prepare the input data - messages will be handled by the workflow
            input_data = {
                "model": tweaking_data.model,
                "key": tweaking_data.key,
                "user_id": tweaking_data.user_id,
                "company_info": tweaking_data.company_info,
                "job_description": tweaking_data.job_description,
                "coverletter": tweaking_data.coverletter,
                "user_message": tweaking_data.user_message,
                "coverletter_context": tweaking_data.coverletter_context,
                "messages": existing_messages,  # Pass existing messages to workflow
                "humanized_pro_for_coverletter": tweaking_data.humanized_pro_for_coverletter,
                "status": 200,
            }
            
            print(f"🔍 Invoking workflow with {len(existing_messages)} existing messages")
            
            result = self.app.invoke(input_data, config=config)
            
            print(f"⚡ Workflow result: {result}")
            
            # Extract the coverletter content and messages from the result
            coverletter_content = result.get("coverletter", "")
            messages = result.get("messages", [])
            status = result.get("status", 200)
            
            # Convert BaseMessage objects to serializable format
            serializable_messages = []
            for msg in messages:
                if hasattr(msg, 'type') and hasattr(msg, 'content'):
                    # Map LangChain message types to role names
                    role = "user" if msg.type == "human" else "assistant"
                    serializable_messages.append({
                        "role": role,
                        "content": msg.content
                    })
                else:
                    # Fallback for other message types
                    serializable_messages.append({
                        "role": "unknown",
                        "content": str(msg)
                    })
            
            return CoverLetterResponseSchemaSerializable(
                messages=serializable_messages,
                status=status,
                coverletter=coverletter_content,
                thread_id=thread_id,
                new_coverletter_context=result.get("new_coverletter_context", ""),
                llm_type=result.get("llm_type", "unknown"),
                model_used=result.get("model_used", "unknown")
            )
        except Exception as e:
            print(f"Error in workflow execution: {e}")
            import traceback
            traceback.print_exc()
            return CoverLetterResponseSchemaSerializable(
                messages=[],
                status=500,
                coverletter="",
                thread_id="",
                new_coverletter_context="",
                llm_type="unknown",
                model_used="unknown"
            )

    def get_coverletter_messages(self, thread_id: str):
        """Gets the cover letter messages for a given thread id."""
        if not self.app:
            return []
        try:
            config = get_thread_config(thread_id)
            state = self.app.get_state(config=config)
            messages = state.values.get("messages", [])
            
            print(f"🔍 Retrieved {len(messages)} messages from thread {thread_id}")
            
            # Convert LangChain messages to serializable format
            serializable_messages = []
            for msg in messages:
                if hasattr(msg, 'type') and hasattr(msg, 'content'):
                    # Map LangChain message types to role names
                    role = "user" if msg.type == "human" else "assistant"
                    serializable_messages.append({
                        "role": role,
                        "content": msg.content
                    })
                elif isinstance(msg, dict):
                    # Already in serializable format
                    serializable_messages.append(msg)
                else:
                    # Fallback for other message types
                    serializable_messages.append({
                        "role": "unknown",
                        "content": str(msg)
                    })
            
            return serializable_messages
        except Exception as e:
            print(f"Error getting messages for thread {thread_id}: {e}")
            return []
