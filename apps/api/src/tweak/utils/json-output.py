import json
import jsbeautifier

def output2json(self, output) -> dict:
    """Convert GPT function_call output to JSON."""
    opts = jsbeautifier.default_options()
    return json.loads(jsbeautifier.beautify(output["function_call"]["arguments"], opts))