from tweak.graph import Workflow
from tweak.coverletter.schemas import CoverLetterRequestSchema, CoverLetterResponseSchema, CoverLetterResponseSchemaSerializable
from tweak.utils.threads import get_or_create_thread_id, get_thread_config

class Service:
    def __init__(self):
        """Initializes the service."""
        try:
            workflow = Workflow()
            self.app = workflow.app
        except Exception as e:
            print(f"Error initializing workflow: {e}")
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
            
            # Get existing messages from thread if it exists
            from langchain_core.messages import HumanMessage, AIMessage
            
            chat_history = []
            if thread_id and tweaking_data.thread_id:  # Only if this is an existing thread
                try:
                    existing_messages = self.get_coverletter_messages(thread_id)
                    print(f"🔍 Retrieved existing messages for thread {thread_id}: {len(existing_messages)} messages")
                    print(f"🔍 Existing messages: {existing_messages}")
                    
                    if existing_messages:
                        # Convert existing messages to LangChain format
                        for msg in existing_messages:
                            if isinstance(msg, dict):
                                if msg.get("role") == "user":
                                    chat_history.append(HumanMessage(content=msg.get("content", "")))
                                elif msg.get("role") == "assistant":
                                    chat_history.append(AIMessage(content=msg.get("content", "")))
                            else:
                                # If it's already a LangChain message, use it directly
                                chat_history.append(msg)
                    print(f"🔍 Converted chat_history: {len(chat_history)} messages")
                except Exception as e:
                    print(f"Warning: Could not retrieve existing messages for thread {thread_id}: {e}")
                    chat_history = []
            
            # Also check if chat_history is provided in the request (fallback)
            if not chat_history and tweaking_data.chat_history:
                for msg in tweaking_data.chat_history:
                    if msg.get("role") == "user":
                        chat_history.append(HumanMessage(content=msg.get("content", "")))
                    elif msg.get("role") == "assistant":
                        chat_history.append(AIMessage(content=msg.get("content", "")))
            
            # Initialize empty messages array - the nodes will handle adding the user message
            messages = []
            
            print(f"🔍 Invoking workflow with chat_history: {len(chat_history)} messages")
            print(f"🔍 Chat history content: {[msg.content for msg in chat_history]}")
            
            # Prepare the input with existing messages from chat_history
            input_data = {
                "model": tweaking_data.model,
                "key": tweaking_data.key,
                "user_id": tweaking_data.user_id,
                "company_info": tweaking_data.company_info,
                "job_description": tweaking_data.job_description,
                "coverletter": tweaking_data.coverletter,
                "user_message": tweaking_data.user_message,
                "chat_history": chat_history,  # Pass the converted chat history
                "coverletter_context": tweaking_data.coverletter_context,  # Will be populated by smart context filtering
                "messages": chat_history,  # Use chat_history as the initial messages
                "status": 200,
                "short_response": "",
            }
            
            print(f"🔍 Input data messages: {len(input_data['messages'])} messages")
            print(f"🔍 Input messages content: {[msg.content for msg in input_data['messages']]}")
            
            result = self.app.invoke(input_data, config=config)
            
            print(f"⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡t: {result}")
            
            # Check thread state after workflow completion
            try:
                post_workflow_state = self.app.get_state(config=config)
                post_workflow_messages = post_workflow_state.values.get("messages", [])
                print(f"🔍 Post-workflow thread state messages: {len(post_workflow_messages)} messages")
                print(f"🔍 Post-workflow messages: {[msg.content for msg in post_workflow_messages]}")
                
                # If the thread state doesn't have the updated messages, manually update it
                if len(post_workflow_messages) < len(messages):
                    print(f"🔍 Thread state is missing messages, updating manually...")
                    # Update the thread state with the combined messages
                    update_result = self.app.update_state(config, {"messages": messages})
                    print(f"🔍 Manual update result: {update_result}")
                    
                    # Verify the update
                    updated_state = self.app.get_state(config=config)
                    updated_messages = updated_state.values.get("messages", [])
                    print(f"🔍 After manual update: {len(updated_messages)} messages")
                    print(f"🔍 Updated messages: {[msg.content for msg in updated_messages]}")
                    
            except Exception as e:
                print(f"🔍 Error getting post-workflow state: {e}")
            
            # Extract the coverletter content from the result
            # The workflow returns the final state, so we need to get the coverletter from there
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
            
            print(f"🔍 Raw messages from thread {thread_id}: {len(messages)} messages")
            print(f"🔍 Raw messages: {messages}")
            
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
            
            print(f"🔍 Converted serializable messages: {serializable_messages}")
            return serializable_messages
        except Exception as e:
            print(f"Error getting messages for thread {thread_id}: {e}")
            return []