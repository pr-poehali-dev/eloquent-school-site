'''
Business: AI-генерация кода для проектов через Anthropic Claude API
Args: event - dict с httpMethod, body (prompt, project_id, action)
      context - object с request_id
Returns: Сгенерированный код или список файлов
'''

import json
import os
from typing import Dict, Any, List
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    database_url = os.environ.get('DATABASE_URL')
    return psycopg2.connect(database_url)

def get_project_context(project_id: str) -> str:
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        cursor.execute(
            "SELECT name, description FROM projects WHERE id = %s",
            (project_id,)
        )
        project = cursor.fetchone()
        
        cursor.execute(
            "SELECT path, content, file_type FROM project_files WHERE project_id = %s",
            (project_id,)
        )
        files = cursor.fetchall()
        
        context = f"Проект: {project['name']}\n"
        context += f"Описание: {project['description']}\n\n"
        context += "Существующие файлы:\n"
        
        for file in files:
            context += f"\n--- {file['path']} ---\n"
            context += file['content'][:500]
            if len(file['content']) > 500:
                context += "\n... (truncated)"
            context += "\n"
        
        return context
    finally:
        cursor.close()
        conn.close()

def generate_component_name(prompt: str) -> str:
    prompt_lower = prompt.lower()
    
    if 'форм' in prompt_lower or 'form' in prompt_lower:
        if 'контакт' in prompt_lower or 'обратн' in prompt_lower:
            return 'ContactForm'
        elif 'регистр' in prompt_lower or 'sign' in prompt_lower:
            return 'SignupForm'
        else:
            return 'CustomForm'
    elif 'кнопк' in prompt_lower or 'button' in prompt_lower:
        return 'Button'
    elif 'карточ' in prompt_lower or 'card' in prompt_lower:
        return 'Card'
    elif 'меню' in prompt_lower or 'menu' in prompt_lower:
        return 'Menu'
    elif 'хедер' in prompt_lower or 'header' in prompt_lower:
        return 'Header'
    elif 'футер' in prompt_lower or 'footer' in prompt_lower:
        return 'Footer'
    elif 'галер' in prompt_lower or 'gallery' in prompt_lower:
        return 'Gallery'
    elif 'слайдер' in prompt_lower or 'slider' in prompt_lower:
        return 'Slider'
    elif 'модал' in prompt_lower or 'modal' in prompt_lower:
        return 'Modal'
    else:
        return 'Component'

def generate_code_without_api(prompt: str, project_context: str) -> Dict[str, Any]:
    component_name = generate_component_name(prompt)
    
    template = f'''import React from 'react';

interface {component_name}Props {{
  className?: string;
}}

export const {component_name}: React.FC<{component_name}Props> = ({{ className }}) => {{
  return (
    <div className={{`${{className || ''}}`}}>
      <h2 className="text-2xl font-bold mb-4">{component_name}</h2>
      <p className="text-gray-600">
        Компонент создан по запросу: "{prompt}"
      </p>
    </div>
  );
}};

export default {component_name};
'''
    
    return {
        'component_name': component_name,
        'file_path': f'src/components/{component_name}.tsx',
        'content': template,
        'file_type': 'component'
    }

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': headers,
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    try:
        body = json.loads(event.get('body', '{}'))
        
        prompt = body.get('prompt', '').strip()
        project_id = body.get('project_id')
        
        if not prompt or not project_id:
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps({'error': 'prompt and project_id required'}),
                'isBase64Encoded': False
            }
        
        project_context = get_project_context(project_id)
        
        anthropic_key = os.environ.get('ANTHROPIC_API_KEY')
        
        if anthropic_key and anthropic_key.startswith('sk-ant-'):
            try:
                import anthropic
                
                client = anthropic.Anthropic(api_key=anthropic_key)
                
                system_prompt = """Ты опытный React/TypeScript разработчик. 
Твоя задача - генерировать чистый, современный код компонентов.

Правила:
1. Используй TypeScript с интерфейсами для props
2. Используй Tailwind CSS для стилей
3. Код должен быть готов к использованию
4. Не добавляй лишних комментариев
5. Экспортируй компонент как default
6. Возвращай ТОЛЬКО код, без markdown блоков"""

                message = client.messages.create(
                    model="claude-3-5-sonnet-20241022",
                    max_tokens=2000,
                    system=system_prompt,
                    messages=[
                        {
                            "role": "user",
                            "content": f"{project_context}\n\nЗапрос: {prompt}\n\nСоздай React компонент."
                        }
                    ]
                )
                
                generated_code = message.content[0].text
                component_name = generate_component_name(prompt)
                
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'body': json.dumps({
                        'component_name': component_name,
                        'file_path': f'src/components/{component_name}.tsx',
                        'content': generated_code,
                        'file_type': 'component',
                        'tokens': {
                            'input': message.usage.input_tokens,
                            'output': message.usage.output_tokens
                        }
                    }),
                    'isBase64Encoded': False
                }
            except Exception as api_error:
                result = generate_code_without_api(prompt, project_context)
                result['warning'] = f'API error: {str(api_error)}, used template'
                
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'body': json.dumps(result),
                    'isBase64Encoded': False
                }
        else:
            result = generate_code_without_api(prompt, project_context)
            result['warning'] = 'ANTHROPIC_API_KEY not set, used template'
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps(result),
                'isBase64Encoded': False
            }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
