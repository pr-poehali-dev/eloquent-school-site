const API_ENDPOINTS = {
  projects: 'https://functions.poehali.dev/34890564-a51a-4c95-ae0b-e95a2699a7b3',
  files: 'https://functions.poehali.dev/10777aea-79cb-4fdf-a0aa-daf22c226a15',
  aiAssistant: 'https://functions.poehali.dev/12efab3c-e1d6-498f-8d36-1b727fe476a7',
};

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'building' | 'deployed';
  created_at?: string;
  updated_at?: string;
  url?: string;
  color: string;
  owner_id?: string;
  file_count?: number;
}

export interface ProjectFile {
  id: string;
  project_id?: string;
  path: string;
  content: string;
  file_type?: string;
  type?: 'component' | 'page' | 'style' | 'config';
  created_at?: string;
  updated_at?: string;
}

export interface ProjectWithFiles extends Project {
  files: ProjectFile[];
}

export interface AIGenerateResponse {
  component_name: string;
  file_path: string;
  content: string;
  file_type: string;
  tokens?: {
    input: number;
    output: number;
  };
  warning?: string;
}

export const api = {
  projects: {
    getAll: async (): Promise<Project[]> => {
      const response = await fetch(API_ENDPOINTS.projects);
      if (!response.ok) throw new Error('Failed to fetch projects');
      return response.json();
    },

    getById: async (id: string): Promise<ProjectWithFiles> => {
      const response = await fetch(`${API_ENDPOINTS.projects}?id=${id}`);
      if (!response.ok) throw new Error('Failed to fetch project');
      return response.json();
    },

    create: async (project: Partial<Project> & { files?: ProjectFile[] }): Promise<Project> => {
      const response = await fetch(API_ENDPOINTS.projects, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(project),
      });
      if (!response.ok) throw new Error('Failed to create project');
      return response.json();
    },

    update: async (id: string, updates: Partial<Project>): Promise<Project> => {
      const response = await fetch(API_ENDPOINTS.projects, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, ...updates }),
      });
      if (!response.ok) throw new Error('Failed to update project');
      return response.json();
    },
  },

  files: {
    getByProject: async (projectId: string): Promise<ProjectFile[]> => {
      const response = await fetch(`${API_ENDPOINTS.files}?project_id=${projectId}`);
      if (!response.ok) throw new Error('Failed to fetch files');
      return response.json();
    },

    getById: async (id: string): Promise<ProjectFile> => {
      const response = await fetch(`${API_ENDPOINTS.files}?id=${id}`);
      if (!response.ok) throw new Error('Failed to fetch file');
      return response.json();
    },

    create: async (file: Partial<ProjectFile>): Promise<ProjectFile> => {
      const response = await fetch(API_ENDPOINTS.files, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(file),
      });
      if (!response.ok) throw new Error('Failed to create file');
      return response.json();
    },

    update: async (id: string, updates: Partial<ProjectFile>): Promise<ProjectFile> => {
      const response = await fetch(API_ENDPOINTS.files, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, ...updates }),
      });
      if (!response.ok) throw new Error('Failed to update file');
      return response.json();
    },
  },

  ai: {
    generate: async (projectId: string, prompt: string): Promise<AIGenerateResponse> => {
      const response = await fetch(API_ENDPOINTS.aiAssistant, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          project_id: projectId,
          prompt: prompt,
        }),
      });
      if (!response.ok) throw new Error('Failed to generate code');
      return response.json();
    },
  },
};