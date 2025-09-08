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
        workflow.add_node("coverletter_analysis", cover_letter_nodes.coverletter_analysis)
        workflow.add_node("compile_coverletter", cover_letter_nodes.compile_coverletter)
        
        
        # all edges - simplified flow without conditional routing
        workflow.add_edge("analyze_update_context_for_coverletter", "coverletter_analysis")
        workflow.add_edge("coverletter_analysis", "compile_coverletter")
        workflow.add_edge("compile_coverletter", END)
        
        # Set entry point
        workflow.add_edge(START, "analyze_update_context_for_coverletter")
        
        # Compile
        self.app = workflow.compile(checkpointer=self.checkpointer)
