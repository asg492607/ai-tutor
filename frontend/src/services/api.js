const API_BASE = "http://127.0.0.1:8000/api";

async function request(endpoint, options = {}) {
  const token = localStorage.getItem("ai_tutor_token");
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  const res = await fetch(`${API_BASE}${endpoint}`, config);
  
  if (!res.ok) {
    let errorDetail = "An unexpected error occurred.";
    try {
      const errorJson = await res.json();
      errorDetail = errorJson.detail || JSON.stringify(errorJson);
    } catch {
      errorDetail = await res.text();
    }
    throw new Error(errorDetail);
  }

  return res.json();
}

export const api = {
  // Authentication
  auth: {
    login: (email, password) =>
      request("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),
    register: (email, password, name, grade_level) =>
      request("/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password, name, grade_level }),
      }),
    getMe: () => request("/auth/me"),
  },

  // Curriculum
  curriculum: {
    getSubjects: () => request("/curriculum/subjects"),
    getTopics: (subjectId) => request(`/curriculum/subjects/${subjectId}/topics`),
    getStrategies: () => request("/curriculum/strategies"),
  },

  // Tutor Sessions
  tutor: {
    createSession: (subjectId, topicId, mode, initialStrategy, initialDifficulty) =>
      request("/tutor/sessions", {
        method: "POST",
        body: JSON.stringify({
          subject_id: subjectId,
          topic_id: topicId,
          mode: mode || "Learn",
          initial_strategy: initialStrategy || "Socratic Teaching",
          initial_difficulty: initialDifficulty || "Intermediate",
        }),
      }),
    getUserSessions: () => request("/tutor/sessions"),
    getSession: (sessionId) => request(`/tutor/sessions/${sessionId}`),
    sendMessage: (sessionId, content) =>
      request(`/tutor/sessions/${sessionId}/message`, {
        method: "POST",
        body: JSON.stringify({ content }),
      }),
    requestHint: (sessionId) =>
      request(`/tutor/sessions/${sessionId}/hint`, {
        method: "POST",
      }),
    changeStrategy: (sessionId, strategyName) =>
      request(`/tutor/sessions/${sessionId}/change-strategy`, {
        method: "POST",
        body: JSON.stringify({ strategy_name: strategyName }),
      }),
  },

  // Analytics & Mastery
  analytics: {
    getMastery: () => request("/analytics/mastery"),
    getMisconceptions: () => request("/analytics/misconceptions"),
    getLearningPath: () => request("/analytics/learning-path"),
  },

  // Sandbox Code Runner
  sandbox: {
    executeCode: (code, language = "python") =>
      request("/sandbox/execute", {
        method: "POST",
        body: JSON.stringify({ code, language }),
      }),
  },
};
