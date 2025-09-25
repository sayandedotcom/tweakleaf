aiwords = [
  "These overused words: can, may, just, that, very, really, literally, actually, certainly, probably, basically, could, maybe, delve, embark, enlightening, esteemed, shed light, craft, crafting, imagine, realm, game-changer, unlock, discover, skyrocket, abyss, not alone, in a world where, revolutionize, disruptive, utilize, utilizing, dive deep, tapestry, illuminate, unveil, pivotal, intricate, elucidate, hence, furthermore, realm, however, harness, exciting, groundbreaking, cutting-edge, remarkable, it, remains to be seen, glimpse into, navigating, landscape, stark, testament, in summary, in conclusion, moreover, boost, skyrocketing, opened up, powerful, inquiries, ever-evolving, embarked, delved, invaluable, relentless, endeavour, insights, deep understanding, crucial, elevate, resonate, enhance, expertise, offerings, valuable, leverage, foster, systemic, inherent, treasure trove, landscape, delve, pertinent, synergy, explore, underscores, empower, unleash, intricate, folks, adhere, amplify, cognizant, conceptualize, crucial, emphasize, complexity, recognize, adapt, promote, critique, comprehensive, implications, complementary, perspectives, holistic, discern, multifaceted, nuanced, underpinnings, cultivate, integral, profound, facilitate, encompass, unravel, paramount, characterized, significant"
]

def analyze_update_context_for_coverletter(self, state: dict) -> dict:
        """Smart rule-based context filtering without LLM calls or database operations"""
        
        user_message = state.get("user_message", "").strip()
        existing_context = state.get("coverletter_context", "")
        
        print(f"🔧 Smart context filtering for message: '{user_message}'")
        print(f"🔧 Existing context length: {len(existing_context)}")
        
        # Rule-based filtering to determine if message should be appended
        should_append = self._should_append_to_context(user_message)
        
        if should_append:
            # Store user message separately instead of concatenating
            state["new_coverletter_context"] = user_message
            print(f"🔧 User message stored as new context: '{user_message}'")
        else:
            # Clear new context if message is filtered out
            state["new_coverletter_context"] = ""
            print("🔧 Message filtered out, no new context added")
        
        return state
    
def _should_append_to_context(self, user_message: str) -> bool:
        """Rule-based logic to determine if message should be appended to context"""
        if not user_message or len(user_message.strip()) < 3:
            return False
        
        user_message_lower = user_message.lower().strip()
        
        # Simple acknowledgments to ignore
        ignore_patterns = [
            'ok', 'thanks', 'yes', 'no', 'good', 'hello', 'hi', 'hey',
            'sure', 'alright', 'fine', 'great', 'awesome', 'perfect',
            'done', 'got it', 'understood', 'cool', 'nice', 'excellent'
        ]
        
        if user_message_lower in ignore_patterns:
            return False
        
        # Keywords that indicate valuable context
        valuable_keywords = [
            'prefer', 'style', 'tone', 'add', 'remove', 'change', 'modify',
            'emphasize', 'focus', 'highlight', 'mention', 'include', 'exclude',
            'professional', 'casual', 'formal', 'technical', 'creative',
            'experience', 'skill', 'achievement', 'background', 'qualification',
            'company', 'industry', 'role', 'position', 'job', 'career',
            'leadership', 'team', 'project', 'management', 'development',
            'shorter', 'longer', 'brief', 'detailed', 'specific', 'general'
        ]
        
        # Check if message contains valuable keywords
        has_valuable_keywords = any(keyword in user_message_lower for keyword in valuable_keywords)
        
        # Check if message is substantial (not just single words)
        is_substantial = len(user_message.split()) >= 2
        
        # Check if message contains specific instructions or preferences
        has_instructions = any(word in user_message_lower for word in [
            'make', 'do', 'should', 'want', 'need', 'like', 'dislike',
            'instead', 'rather', 'better', 'worse', 'more', 'less'
        ])
        
        # Append if it has valuable keywords, is substantial, or contains instructions
        should_append = has_valuable_keywords or (is_substantial and has_instructions)
        
        print(f"🔧 Context decision - Valuable keywords: {has_valuable_keywords}, "
              f"Substantial: {is_substantial}, Instructions: {has_instructions}, "
              f"Append: {should_append}")
        
        return should_append