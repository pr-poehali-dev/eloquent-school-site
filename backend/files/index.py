'''
Business: Управление файлами проектов (создание, обновление, удаление)
Args: event - dict с httpMethod, body, queryStringParameters
      context - object с request_id
Returns: HTTP response с данными файлов
'''

import json
import os
from typing import Dict, Any
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
            project_id = params.get('project_id')
            file_id = params.get('id')
            
            if file_id:
                cursor.execute(
                    "SELECT * FROM project_files WHERE id = %s",
                    (file_id,)
                )
                file_data = cursor.fetchone()
                
                if not file_data:
                    return {
                        'statusCode': 404,
                        'headers': headers,
                        'body': json.dumps({'error': 'File not found'}),
                        'isBase64Encoded': False
                    }
                
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'body': json.dumps(dict(file_data), default=str),
                    'isBase64Encoded': False
                }
            
            elif project_id:
                cursor.execute(
                    "SELECT * FROM project_files WHERE project_id = %s ORDER BY path",
                    (project_id,)
                )
                files = cursor.fetchall()
                
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'body': json.dumps([dict(f) for f in files], default=str),
                    'isBase64Encoded': False
                }
            
            else:
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'project_id or id required'}),
                    'isBase64Encoded': False
                }
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            
            file_id = body.get('id')
            project_id = body.get('project_id')
            path = body.get('path')
            content = body.get('content', '')
            file_type = body.get('type', 'component')
            
            if not all([file_id, project_id, path]):
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'Missing required fields'}),
                    'isBase64Encoded': False
                }
            
            cursor.execute(
                "INSERT INTO project_files (id, project_id, path, content, file_type) "
                "VALUES (%s, %s, %s, %s, %s) RETURNING *",
                (file_id, project_id, path, content, file_type)
            )
            file_data = cursor.fetchone()
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': headers,
                'body': json.dumps(dict(file_data), default=str),
                'isBase64Encoded': False
            }
        
        elif method == 'PUT':
            body = json.loads(event.get('body', '{}'))
            file_id = body.get('id')
            
            if not file_id:
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'File ID required'}),
                    'isBase64Encoded': False
                }
            
            updates = []
            values = []
            
            if 'content' in body:
                updates.append('content = %s')
                values.append(body['content'])
            if 'path' in body:
                updates.append('path = %s')
                values.append(body['path'])
            if 'type' in body:
                updates.append('file_type = %s')
                values.append(body['type'])
            
            updates.append('updated_at = CURRENT_TIMESTAMP')
            values.append(file_id)
            
            cursor.execute(
                f"UPDATE project_files SET {', '.join(updates)} WHERE id = %s RETURNING *",
                tuple(values)
            )
            file_data = cursor.fetchone()
            conn.commit()
            
            if not file_data:
                return {
                    'statusCode': 404,
                    'headers': headers,
                    'body': json.dumps({'error': 'File not found'}),
                    'isBase64Encoded': False
                }
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps(dict(file_data), default=str),
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
