from langchain_core.prompts import ChatPromptTemplate
from langchain_core.prompts import FewShotChatMessagePromptTemplate

few_shot_latex_system_prompt = """
**IMPORTANT: These examples ONLY demonstrate LaTeX special character escaping. DO NOT use the example content as templates. Focus solely on how special characters are escaped.**

**LaTeX SPECIAL CHARACTERS - MUST ESCAPE:**
- Dollar sign: $ → \$
- Percent sign: % → \%
- Ampersand: & → \&
- Hash: # → \#
- Underscore: _ → \_
- Left brace: {{ → \{{}}
- Right brace: }} → \{{}}
- Backslash: \ → \textbackslash
- Examples: 25% → 25\%, C++ & Python → C++ \& Python, $50,000 → \$50,000

**CRITICAL LaTeX PRESERVATION RULES:**
- NEVER modify LaTeX document structure, packages, or commands
- CHANGE only the content of the cover letter, do not change the structure or formatting
- **ABSOLUTELY DO NOT** modify or simplify line break and start a new line commands
"""

# Few-shot examples demonstrating ONLY LaTeX special character escaping mechanics
# These are intentionally abstract to avoid being used as content templates
examples = [
    {
        "input": "How do I write: The project achieved 25% growth with C++ & Python?",
        "output": "Correct LaTeX escaping: The project achieved 25\% growth with C++ \& Python"
    },
    {
        "input": "How do I write: Budget was $50,000 using C# technology?",
        "output": "Correct LaTeX escaping: Budget was \$50,000 using C\# technology"
    },
    {
        "input": "How do I write: Available at 90% with JavaScript & React experience?",
        "output": "Correct LaTeX escaping: Available at 90\% with JavaScript \& React experience"
    },
    {
        "input": "How do I write: Increased revenue by 15% and reduced costs by $10,000?",
        "output": "Correct LaTeX escaping: Increased revenue by 15\% and reduced costs by \$10,000"
    }
]


# Example prompt template for few-shot learning
few_shot_latex_prompt_template = ChatPromptTemplate.from_messages([
    ("system", few_shot_latex_system_prompt),
    ("human", "{input}"),
    ("ai", "{output}"),
])


# Few-shot prompt template
few_shot_latex_prompt = FewShotChatMessagePromptTemplate(
    example_prompt=few_shot_latex_prompt_template,
    examples=examples,
    input_variables=[],
)
