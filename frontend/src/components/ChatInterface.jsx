import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import Stage1 from './Stage1';
import Stage2 from './Stage2';
import Stage3 from './Stage3';
import { useLanguage } from '../contexts/LanguageContext';
import './ChatInterface.css';

export default function ChatInterface({
  conversation,
  onSendMessage,
  isLoading,
}) {
  const [input, setInput] = useState('');
  const [msgIndex, setMsgIndex] = useState(0);
  const messagesEndRef = useRef(null);
  const { t, language } = useLanguage();

  const thinkingMessages = t('chat.thinkingMessages') || [];

  useEffect(() => {
    let interval;
    if (isLoading && thinkingMessages.length > 0) {
      interval = setInterval(() => {
        setMsgIndex((prev) => (prev + 1) % thinkingMessages.length);
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isLoading, thinkingMessages.length]);

  // Reset msgIndex when loading starts/stops
  useEffect(() => {
    if (!isLoading) {
      setMsgIndex(0);
    }
  }, [isLoading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
    }
  };

  const handleKeyDown = (e) => {
    // Submit on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  if (!conversation) {
    return (
      <div className="chat-interface">
        <div className="empty-state">
          <h2>{t('chat.welcome')}</h2>
          <p>{t('chat.welcomeDesc')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-interface">
      <div className="messages-container">
        {conversation.messages.length === 0 ? (
          <div className="empty-state">
            <h2>{t('chat.startConversation')}</h2>
            <p>{t('chat.startDesc')}</p>
          </div>
        ) : (
          conversation.messages.map((msg, index) => (
            <div key={index} className="message-group">
              {msg.role === 'user' ? (
                <div className="user-message">
                  <div className="message-label">{t('chat.you')}</div>
                  <div className="message-content">
                    <div className="markdown-content">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="assistant-message">
                  <div className="message-label">{t('chat.council')}</div>

                  {/* Stage 1 */}
                  {msg.loading?.stage1 && (
                    <div className="stage-loading">
                      <div className="spinner"></div>
                      <div className="loading-info">
                        <span>{t('chat.stage1Loading')}</span>
                        {msg.progress?.stage === 1 && (
                          <div className="progress-container">
                            <div className="progress-bar">
                              <div
                                className="progress-fill"
                                style={{ width: `${(msg.progress.current / msg.progress.total) * 100}%` }}
                              ></div>
                            </div>
                            <span className="progress-text">
                              {msg.progress.current} / {msg.progress.total} - {msg.progress.model.split('/').pop()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  {msg.stage1 && <Stage1 responses={msg.stage1} />}

                  {/* Stage 2 */}
                  {msg.loading?.stage2 && (
                    <div className="stage-loading">
                      <div className="spinner"></div>
                      <div className="loading-info">
                        <span>{t('chat.stage2Loading')}</span>
                        {msg.progress?.stage === 2 && (
                          <div className="progress-container">
                            <div className="progress-bar">
                              <div
                                className="progress-fill"
                                style={{ width: `${(msg.progress.current / msg.progress.total) * 100}%` }}
                              ></div>
                            </div>
                            <span className="progress-text">
                              {msg.progress.current} / {msg.progress.total} - {msg.progress.model.split('/').pop()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  {msg.stage2 && (
                    <Stage2
                      rankings={msg.stage2}
                      labelToModel={msg.metadata?.label_to_model}
                      aggregateRankings={msg.metadata?.aggregate_rankings}
                    />
                  )}

                  {/* Stage 3 */}
                  {msg.loading?.stage3 && (
                    <div className="stage-loading">
                      <div className="spinner"></div>
                      <span>{t('chat.stage3Loading')}</span>
                    </div>
                  )}
                  {msg.stage3 && <Stage3 finalResponse={msg.stage3} />}

                  {/* Error Display */}
                  {msg.error && (
                    <div className="error-banner" style={{
                      background: 'rgba(220, 38, 38, 0.1)',
                      border: '1px solid rgba(220, 38, 38, 0.3)',
                      borderRadius: '8px',
                      padding: '12px 16px',
                      marginTop: '12px',
                      color: '#fca5a5',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '8px',
                    }}>
                      <span style={{ fontSize: '18px' }}>⚠️</span>
                      <div>
                        <strong style={{ display: 'block', marginBottom: '4px' }}>
                          {msg.error.type === 'timeout' ? t('chat.error.timeout') :
                            msg.error.type === 'context_limit' ? t('chat.error.context') :
                              t('chat.error.general')}
                        </strong>
                        <span style={{ opacity: 0.8, fontSize: '13px' }}>{msg.error.message}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}

        {isLoading && (
          <div className="loading-indicator">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div className="loading-content">
              <span className="loading-text">
                {thinkingMessages.length > 0 ? thinkingMessages[msgIndex] : t('chat.consulting')}
              </span>
              <span className="estimated-time">
                {t('chat.estimatedTime')}
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form className="input-form" onSubmit={handleSubmit}>
        <textarea
          className="message-input"
          placeholder={t('chat.placeholder')}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          rows={3}
        />
        <button
          type="submit"
          className="send-button"
          disabled={!input.trim() || isLoading}
          title={t('chat.send')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: '20px', height: '20px' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.125A59.769 59.769 0 0121.485 12 59.768 59.768 0 013.27 20.875L5.999 12Zm0 0h7.5" />
          </svg>
        </button>
      </form>
    </div>
  );
}
