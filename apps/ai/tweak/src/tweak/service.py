from tweak.graph import Workflow
from tweak.coverletter.schemas import CoverLetterRequestSchema, CoverLetterResponseSchema

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
                coverletter=""
            )
        
        try:
            config={"configurable": {"thread_id": "coverletter_tweaking"}}
            
            result = self.app.invoke({
                "model": tweaking_data.model,
                "key": tweaking_data.key,
                "user_id": tweaking_data.user_id,
                "user_info": tweaking_data.user_info,
                "company_info": tweaking_data.company_info,
                "job_description": tweaking_data.job_description,
                "coverletter": tweaking_data.coverletter,
                "user_message": tweaking_data.user_message,
                "chat_history": tweaking_data.chat_history,
                "coverletter_context": "",  # Will be populated by analyze_update_context_for_coverletter
                "messages": [],
                "status": 200,
                "short_response": "",
            }, config=config)
            
            # print(f"⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️a: {self.app.get_state(config=config)}")
            
            # print(f"🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑: {list(self.app.get_state(config=config))}")
            
            print(f"⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡t: {result}")
            
            # Extract the coverletter content from the result
            # The workflow returns the final state, so we need to get the coverletter from there
            coverletter_content = result.get("coverletter", "")
            messages = result.get("messages", [])
            status = result.get("status", 200)
            
            
            return CoverLetterResponseSchema(
                messages=messages,
                status=status,
                coverletter=coverletter_content
            )
        except Exception as e:
            print(f"Error in workflow execution: {e}")
            return CoverLetterResponseSchema(
                messages=[],
                status=500,
                coverletter=""
            )