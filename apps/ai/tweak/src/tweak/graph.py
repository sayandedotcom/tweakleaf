from langgraph.checkpoint.memory import InMemorySaver
from langgraph.graph import END, START, StateGraph

from tweak.coverletter.nodes import CoverLetterNodes
from tweak.schemas import State

class Workflow:
    def __init__(self):
        self.checkpointer = InMemorySaver()
        
        # initiate graph state
        workflow = StateGraph(State)
        
        # initiate graph nodes
        cover_letter_nodes = CoverLetterNodes()
        
        # all nodes for cover letter
        workflow.add_node("analyze_update_context_for_coverletter", cover_letter_nodes.analyze_update_context_for_coverletter)
        workflow.add_node("llm_router", cover_letter_nodes.llm_router)
        workflow.add_node("coverletter_analysis_weak", cover_letter_nodes.coverletter_analysis_weak)
        workflow.add_node("coverletter_analysis_strong", cover_letter_nodes.coverletter_analysis_strong)
        workflow.add_node("humanize_coverletter", cover_letter_nodes.humanize_coverletter)
        
        # Define routing function for LLM selection
        def route_decision(state: dict) -> str:
            llm_type = state.get("llm_type", "weak")
            if llm_type == "strong":
                return "coverletter_analysis_strong"
            else:
                return "coverletter_analysis_weak"
        
        # Define routing function for humanizing
        def humanize_route_decision(state: dict) -> str:
            humanized_pro = state.get("humanized_pro_for_coverletter", False)
            if humanized_pro:
                return "humanize_coverletter"
            else:
                return END
        
        # all edges with conditional routing
        workflow.add_edge("analyze_update_context_for_coverletter", "llm_router")
        workflow.add_conditional_edges("llm_router", route_decision, {
            "coverletter_analysis_weak": "coverletter_analysis_weak",
            "coverletter_analysis_strong": "coverletter_analysis_strong"
        })
        workflow.add_conditional_edges("coverletter_analysis_weak", humanize_route_decision, {
            "humanize_coverletter": "humanize_coverletter",
            END: END
        })
        workflow.add_conditional_edges("coverletter_analysis_strong", humanize_route_decision, {
            "humanize_coverletter": "humanize_coverletter",
            END: END
        })
        workflow.add_edge("humanize_coverletter", END)
        
        # Set entry point
        workflow.add_edge(START, "analyze_update_context_for_coverletter")
        
        # Compile
        self.app = workflow.compile(checkpointer=self.checkpointer)
