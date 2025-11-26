// Utilitaires pour le debug des API
export const debugApiResponse = (apiName, response) => {
  if (process.env.NODE_ENV === 'development') {
    console.group(`🔍 API Debug: ${apiName}`);
    console.log("Response:", response);
    console.log("Type:", typeof response);
    console.log("Keys:", response && typeof response === 'object' ? Object.keys(response) : 'N/A');
    console.groupEnd();
  }
};

export const safeExtractId = (response, apiName = 'Unknown') => {
  debugApiResponse(apiName, response);
  
  if (response && response.thread && response.thread._id) {
    return response.thread._id;
  } else if (response && response.thread && response.thread.id) {
    return response.thread.id;
  } else if (response && response._id) {
    return response._id;
  } else if (response && response.id) {
    return response.id;
  } else if (typeof response === 'string') {
    return response;
  }
  
  throw new Error(`Format de réponse inattendu pour ${apiName}: ${JSON.stringify(response)}`);
};