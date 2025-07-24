import { useEffect } from 'react';

/**
 * A custom hook that logs all fetch requests and their responses/errors
 */
// Helper function to get the current timestamp with milliseconds
const getTimestamp = () => {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}.${now.getMilliseconds().toString().padStart(3, '0')}`;
};

export const useRequestLogger = () => {
  useEffect(() => {
    // Store the original fetch function
    const originalFetch = window.fetch;
    
    // Track active requests
    const activeRequests = new Map();

    // Override the global fetch
    window.fetch = async (...args) => {
      const [resource, config] = args;
      const startTime = performance.now();
      const url = new URL(resource.toString(), window.location.origin);
      
      // Log all requests, even before they're made
      console.log(`[${getTimestamp()}] [Request] ${config?.method || 'GET'} ${url.toString()}`);
      
      // Safely parse request body if it exists
      let requestBody = undefined;
      if (config?.body) {
        try {
          if (typeof config.body === 'string') {
            // Try to parse as JSON, but don't fail if it's not JSON
            try {
              requestBody = JSON.parse(config.body);
            } catch {
              // If it's not JSON, just show the string (truncated if too long)
              requestBody = config.body.length > 200 ? `${config.body.substring(0, 200)}...` : config.body;
            }
          } else if (config.body instanceof FormData) {
            requestBody = '[FormData]';
          } else if (config.body instanceof Blob) {
            requestBody = '[Blob]';
          } else if (config.body instanceof ArrayBuffer) {
            requestBody = '[ArrayBuffer]';
          } else if (config.body instanceof URLSearchParams) {
            requestBody = config.body.toString();
          } else {
            requestBody = '[Unknown body type]';
          }
        } catch (e) {
          requestBody = '[Error reading body]';
        }
      }

      const requestId = `${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
      const requestInfo = {
        id: requestId,
        url: resource.toString(),
        method: config?.method || 'GET',
        startTime: performance.now(),
        status: 'pending',
      };
      
      activeRequests.set(requestId, requestInfo);
      
      console.log(`[${getTimestamp()}] [Request] ${requestInfo.method} ${requestInfo.url}`, {
        requestId,
        headers: config?.headers,
        body: requestBody,
      });

      try {
        const response = await originalFetch(resource, config);
        const endTime = performance.now();
        const duration = endTime - startTime;
        const requestInfo = activeRequests.get(requestId) || {};
        
        // Clone the response so we can read it and still pass it along
        const responseClone = response.clone();
        
        // Update request info
        requestInfo.status = 'completed';
        requestInfo.statusCode = response.status;
        requestInfo.statusText = response.statusText;
        requestInfo.duration = duration;
        
        // Log the response
        responseClone.json().then(data => {
          console.log(`[${getTimestamp()}] [Response] ${response.status} ${response.statusText} (${Math.round(duration)}ms) ${requestInfo.method} ${requestInfo.url}`, {
            requestId,
            duration: `${Math.round(duration)}ms`,
            status: response.status,
            headers: Object.fromEntries(response.headers.entries()),
            data
          });
        }).catch(() => {
          // If response is not JSON, log as text
          responseClone.text().then(text => {
            console.log(`[${getTimestamp()}] [Response] ${response.status} ${response.statusText} (${Math.round(duration)}ms) ${requestInfo.method} ${requestInfo.url}`, {
              requestId,
              duration: `${Math.round(duration)}ms`,
              status: response.status,
              headers: Object.fromEntries(response.headers.entries()),
              response: text.length > 500 ? `${text.substring(0, 500)}... [truncated]` : text
            });
          }).catch(err => {
            console.error(`[${getTimestamp()}] [Response Error] Failed to read response for ${requestInfo.method} ${requestInfo.url}`, {
              requestId,
              error: err.message,
              duration: `${Math.round(duration)}ms`,
              status: response.status
            });
          });
        });
        
        // Clean up
        activeRequests.delete(requestId);
        
        return response;
      } catch (error) {
        const endTime = Date.now();
        const duration = performance.now() - startTime;
        const requestInfo = activeRequests.get(requestId) || {};
        
        console.error(`[${getTimestamp()}] [Request Error] (${Math.round(duration)}ms) ${requestInfo.method || 'GET'} ${resource}`, {
          requestId,
          error: error.message,
          stack: error.stack,
          duration: `${Math.round(duration)}ms`
        });
        
        // Clean up
        activeRequests.delete(requestId);
        throw error;
      }
    };

    // Log XMLHttpRequest events
    const originalXHROpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
      this._url = url;
      this._method = method;
      this._startTime = Date.now();
      
      this.addEventListener('load', function() {
        const duration = Date.now() - this._startTime;
        console.log(`[XHR] ${this._method} ${this.status} (${duration}ms):`, this._url);
      });
      
      this.addEventListener('error', function() {
        const duration = Date.now() - this._startTime;
        console.error(`[XHR] Error ${this._method} (${duration}ms):`, this._url);
      });
      
      return originalXHROpen.apply(this, arguments as any);
    };

    // Cleanup function to restore original fetch and XHR
    return () => {
      window.fetch = originalFetch;
      XMLHttpRequest.prototype.open = originalXHROpen;
    };
  }, []);
};
