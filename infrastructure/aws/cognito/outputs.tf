output "user_pool_id" {
  description = "The Cognito User Pool ID"
  value       = aws_cognito_user_pool.main.id
}

output "user_pool_client_id" {
  description = "The App Client ID for the user pool"
  value       = aws_cognito_user_pool_client.main.id
}

output "cognito_domain" {
  description = "The Cognito hosted UI domain"
  value       = aws_cognito_user_pool_domain.main.domain
}
