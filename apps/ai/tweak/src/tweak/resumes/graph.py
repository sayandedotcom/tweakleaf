from langgraph.checkpoint.memory import InMemorySaver
from langgraph.graph import END, START, StateGraph

from tweak.resumes.nodes import ResumeNodes
from tweak.resumes.schemas import State

class ResumeWorkflow:
    def __init__(self):
        self.checkpointer = InMemorySaver()
        
        # initiate graph state
        workflow = StateGraph(State)
        
        # initiate graph nodes
        resume_nodes = ResumeNodes()
        
        # all nodes for resume
        workflow.add_node("analyze_update_context_for_resume", resume_nodes.analyze_update_context_for_resume)
        workflow.add_node("llm_router", resume_nodes.llm_router)
        workflow.add_node("resume_analysis_weak", resume_nodes.resume_analysis_weak)
        workflow.add_node("resume_analysis_strong", resume_nodes.resume_analysis_strong)
        workflow.add_node("humanize_resume", resume_nodes.humanize_resume)
        
        # Define routing function for LLM selection
        def route_decision(state: dict) -> str:
            llm_type = state.get("llm_type", "weak")
            if llm_type == "strong":
                return "resume_analysis_strong"
            else:
                return "resume_analysis_weak"
        
        # Define routing function for humanizing
        def humanize_route_decision(state: dict) -> str:
            humanized_pro = state.get("humanized_pro_for_resume", False)
            if humanized_pro:
                return "humanize_resume"
            else:
                return END
        
        # all edges with conditional routing
        workflow.add_edge("analyze_update_context_for_resume", "llm_router")
        workflow.add_conditional_edges("llm_router", route_decision, {
            "resume_analysis_weak": "resume_analysis_weak",
            "resume_analysis_strong": "resume_analysis_strong"
        })
        workflow.add_conditional_edges("resume_analysis_weak", humanize_route_decision, {
            "humanize_resume": "humanize_resume",
            END: END
        })
        workflow.add_conditional_edges("resume_analysis_strong", humanize_route_decision, {
            "humanize_resume": "humanize_resume",
            END: END
        })
        workflow.add_edge("humanize_resume", END)
        
        # Set entry point
        workflow.add_edge(START, "analyze_update_context_for_resume")
        
        # Compile
        self.app = workflow.compile(checkpointer=self.checkpointer)
