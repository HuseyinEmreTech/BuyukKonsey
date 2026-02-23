/**
 * API client for the LLM Council backend.
 */

const API_BASE = 'http://localhost:8001';

export const api = {
  /**
   * List all conversations.
   */
  async listConversations() {
    const response = await fetch(`${API_BASE}/api/conversations`);
    if (!response.ok) {
      throw new Error('Failed to list conversations');
    }
    return response.json();
  },

  /**
   * Create a new conversation.
   */
  async createConversation() {
    const response = await fetch(`${API_BASE}/api/conversations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });
    if (!response.ok) {
      throw new Error('Failed to create conversation');
    }
    return response.json();
  },

  /**
   * Get a specific conversation.
   */
  async getConversation(conversationId) {
    const response = await fetch(
      `${API_BASE}/api/conversations/${conversationId}`
    );
    if (!response.ok) {
      throw new Error('Failed to get conversation');
    }
    return response.json();
  },

  /**
   * Send a message in a conversation.
   */
  async sendMessage(conversationId, content) {
    const response = await fetch(
      `${API_BASE}/api/conversations/${conversationId}/message`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      }
    );
    if (!response.ok) {
      throw new Error('Failed to send message');
    }
    return response.json();
  },

  /**
   * Delete a specific conversation.
   */
  async deleteConversation(conversationId) {
    const response = await fetch(
      `${API_BASE}/api/conversations/${conversationId}`,
      {
        method: 'DELETE',
      }
    );
    if (!response.ok) {
      throw new Error('Failed to delete conversation');
    }
    return response.json();
  },

  /**
   * Cancel a running background process for a conversation.
   */
  async cancelConversation(conversationId) {
    const response = await fetch(
      `${API_BASE}/api/conversations/${conversationId}/cancel`,
      {
        method: 'DELETE',
      }
    );
    // Don't throw error if not found, it might have just finished
    return response.json();
  },

  /**
   * Send a message and receive streaming updates.
   * @param {string} conversationId - The conversation ID
   * @param {string} content - The message content
   * @param {function} onEvent - Callback function for each event: (eventType, data) => void
   * @returns {Promise<void>}
   */
  async sendMessageStream(conversationId, content, onEvent) {
    const controller = new AbortController();
    const CLIENT_TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes

    const timeoutId = setTimeout(() => {
      controller.abort();
      onEvent('error', {
        type: 'error',
        error_type: 'timeout',
        message: 'İstemci zaman aşımı: Sunucu 5 dakika içinde yanıt veremedi.',
      });
    }, CLIENT_TIMEOUT_MS);

    try {
      const response = await fetch(
        `${API_BASE}/api/conversations/${conversationId}/message/stream`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content }),
          signal: controller.signal,
        }
      );

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            try {
              const event = JSON.parse(data);
              onEvent(event.type, event);
            } catch (e) {
              console.error('Failed to parse SSE event:', e);
            }
          }
        }
      }
    } catch (e) {
      if (e.name === 'AbortError') {
        // Already handled by the timeout callback above
        return;
      }
      throw e;
    } finally {
      clearTimeout(timeoutId);
    }
  },

  /**
   * Get current model settings.
   */
  async getSettings() {
    const response = await fetch(`${API_BASE}/api/settings`);
    if (!response.ok) {
      throw new Error('Failed to get settings');
    }
    return response.json();
  },

  /**
   * Update model settings.
   */
  async updateSettings(settings) {
    const response = await fetch(`${API_BASE}/api/settings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settings),
    });
    if (!response.ok) {
      throw new Error('Failed to update settings');
    }
    return response.json();
  },

  /**
   * Fetch available models from OpenRouter via backend.
   */
  async getAvailableModels() {
    const response = await fetch(`${API_BASE}/api/models`);
    if (!response.ok) {
      throw new Error('Failed to fetch available models');
    }
    return response.json();
  },

  /**
   * List available models from OpenRouter.
   */
  async listModels() {
    const response = await fetch(`${API_BASE}/api/models`);
    if (!response.ok) {
      throw new Error('Failed to list models');
    }
    return response.json();
  },
};
