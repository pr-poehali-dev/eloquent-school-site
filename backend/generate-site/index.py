import json
import os
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Generates website code using AI based on user prompt
    Args: event with httpMethod, body containing prompt
    Returns: Generated HTML, CSS, and structure
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    try:
        body_str = event.get('body', '{}')
        if not body_str or body_str.strip() == '':
            body_str = '{}'
        body_data = json.loads(body_str)
        prompt = body_data.get('prompt', '')
        
        if not prompt:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Prompt is required'})
            }
        
        openai_key = os.environ.get('OPENAI_API_KEY')
        if not openai_key:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'OpenAI API key not configured'})
            }
        
        from openai import OpenAI
        
        client = OpenAI(api_key=openai_key)
        
        system_prompt = """You are an expert web designer. Generate a complete, modern, responsive website based on the user's description.
Return a JSON object with this structure:
{
  "title": "Website title",
  "description": "Brief description",
  "sections": [
    {
      "type": "hero/features/pricing/contact/etc",
      "title": "Section title",
      "content": "Section content or description",
      "items": [] // Optional array for lists, features, etc
    }
  ],
  "colorScheme": {
    "primary": "#hex",
    "secondary": "#hex",
    "background": "#hex"
  }
}

Make it professional, modern, and complete. Include realistic content."""

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            response_format={"type": "json_object"}
        )
        
        generated_content = response.choices[0].message.content
        website_data = json.loads(generated_content)
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': True,
                'website': website_data,
                'prompt': prompt
            })
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': str(e)})
        }