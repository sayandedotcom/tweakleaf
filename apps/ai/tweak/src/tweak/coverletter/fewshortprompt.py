from langchain_core.prompts import ChatPromptTemplate
from langchain_core.prompts import FewShotChatMessagePromptTemplate

few_shot_latex_system_prompt = """

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

# Few-shot examples demonstrating proper LaTeX special character handling
examples = [
    {
        "input": "Please update my cover letter to mention that I increased sales by 25% and worked with C++ & Python.",
        "output": "In my previous role, I successfully increased sales by 25\% through innovative solutions. My technical expertise includes C++ \& Python programming, which I believe aligns well with your requirements."
    },
    {
        "input": "Update the cover letter to mention I worked on a project worth $50,000 and used technologies like C# and .NET.",
        "output": "In my recent role, I led a critical project valued at \$50,000, delivering exceptional results using C\# and .NET technologies. This experience has strengthened my ability to manage complex software development initiatives."
    },
    {
        "input": "Mention that I have 5+ years of experience with JavaScript & React, and I'm available at 90% capacity.",
        "output": "With over 5+ years of experience in JavaScript \& React development, I bring a strong foundation in modern web technologies. I am currently available at 90\% capacity, allowing me to dedicate significant time to this role."
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
