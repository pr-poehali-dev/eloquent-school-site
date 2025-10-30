'''
Business: CRUD операции с проектами (создание, чтение, обновление, удаление)
Args: event - dict с httpMethod, body, queryStringParameters
      context - object с request_id, function_name
Returns: HTTP response с проектами или статусом операции
'''

import json
import os
from typing import Dict, Any, List, Optional
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    database_url = os.environ.get('DATABASE_URL')
    return psycopg2.connect(database_url)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
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
    
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        if method == 'GET':
            params = event.get('queryStringParameters') or {}
            project_id = params.get('id')
            
            if project_id:
                cursor.execute(
                    "SELECT * FROM projects WHERE id = %s",
                    (project_id,)
                )
                project = cursor.fetchone()
                
                if project:
                    cursor.execute(
                        "SELECT * FROM project_files WHERE project_id = %s ORDER BY path",
                        (project_id,)
                    )
                    files = cursor.fetchall()
                    
                    result = dict(project)
                    result['files'] = [dict(f) for f in files]
                    
                    return {
                        'statusCode': 200,
                        'headers': headers,
                        'body': json.dumps(result, default=str),
                        'isBase64Encoded': False
                    }
                else:
                    return {
                        'statusCode': 404,
                        'headers': headers,
                        'body': json.dumps({'error': 'Project not found'}),
                        'isBase64Encoded': False
                    }
            else:
                cursor.execute(
                    "SELECT p.*, COUNT(pf.id) as file_count FROM projects p "
                    "LEFT JOIN project_files pf ON p.id = pf.project_id "
                    "GROUP BY p.id ORDER BY p.created_at DESC"
                )
                projects = cursor.fetchall()
                
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'body': json.dumps([dict(p) for p in projects], default=str),
                    'isBase64Encoded': False
                }
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            
            project_id = body.get('id')
            name = body.get('name')
            description = body.get('description', '')
            status = body.get('status', 'active')
            color = body.get('color', 'from-purple-500 to-pink-500')
            owner_id = event.get('headers', {}).get('X-User-Id', 'anonymous')
            
            if not project_id or not name:
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'Missing required fields'}),
                    'isBase64Encoded': False
                }
            
            cursor.execute(
                "INSERT INTO projects (id, name, description, status, color, owner_id) "
                "VALUES (%s, %s, %s, %s, %s, %s) RETURNING *",
                (project_id, name, description, status, color, owner_id)
            )
            project = cursor.fetchone()
            
            files = body.get('files', [])
            for file_data in files:
                cursor.execute(
                    "INSERT INTO project_files (id, project_id, path, content, file_type) "
                    "VALUES (%s, %s, %s, %s, %s)",
                    (file_data['id'], project_id, file_data['path'], 
                     file_data['content'], file_data.get('type', 'page'))
                )
            
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': headers,
                'body': json.dumps(dict(project), default=str),
                'isBase64Encoded': False
            }
        
        elif method == 'PUT':
            body = json.loads(event.get('body', '{}'))
            project_id = body.get('id')
            
            if not project_id:
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'Project ID required'}),
                    'isBase64Encoded': False
                }
            
            updates = []
            values = []
            
            if 'name' in body:
                updates.append('name = %s')
                values.append(body['name'])
            if 'description' in body:
                updates.append('description = %s')
                values.append(body['description'])
            if 'status' in body:
                updates.append('status = %s')
                values.append(body['status'])
            if 'url' in body:
                updates.append('url = %s')
                values.append(body['url'])
            
            updates.append('updated_at = CURRENT_TIMESTAMP')
            values.append(project_id)
            
            cursor.execute(
                f"UPDATE projects SET {', '.join(updates)} WHERE id = %s RETURNING *",
                tuple(values)
            )
            project = cursor.fetchone()
            conn.commit()
            
            if not project:
                return {
                    'statusCode': 404,
                    'headers': headers,
                    'body': json.dumps({'error': 'Project not found'}),
                    'isBase64Encoded': False
                }
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps(dict(project), default=str),
                'isBase64Encoded': False
            }
        
        else:
            return {
                'statusCode': 405,
                'headers': headers,
                'body': json.dumps({'error': 'Method not allowed'}),
                'isBase64Encoded': False
            }
    
    except Exception as e:
        conn.rollback()
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
    finally:
        cursor.close()
        conn.close()
