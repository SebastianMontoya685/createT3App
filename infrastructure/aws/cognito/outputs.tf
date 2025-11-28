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

output "lambda_post_confirmation_arn" {
  value = aws_lambda_function.cognito_post_confirmation.arn
}

output "user_pool_arn" {
  value = aws_cognito_user_pool.main.arn
}

output "database_url" {
  description = "PostgreSQL database connection string (sensitive)"
  value       = local.database_url
  sensitive   = true
}

output "rds_endpoint" {
  description = "RDS PostgreSQL endpoint"
  value       = aws_db_instance.main.endpoint
}

output "rds_database_name" {
  description = "RDS database name"
  value       = aws_db_instance.main.db_name
}
