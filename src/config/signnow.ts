export interface AccessTokenResponse {
  data: {
    access_token?: string;
    expires_in?: number;
    last_login?: number;
    refresh_token?: string;
    scope?: string;
    token_type?: string;
  }
  errorMessage?: string;
  errorCode?: number;
}

export interface CreateDocumentResponse {
  data: {
    id?: string;
    document_name?: string;
  }
  errorMessage?: string;
  errorCode?: number;
}