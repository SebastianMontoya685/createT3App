variable "aws_region" {
  description = "The AWS region to deploy resources in."
  type        = string
  default     = "us-east-1"
}

variable "user_pool_name" {
  description = "The name for the Cognito user pool."
  type        = string
  default     = "my-app-users"
}

variable "app_client_name" {
  description = "The name for the Cognito user pool client."
  type        = string
  default     = "my-app-client"
}

variable "callback_urls" {
  description = "List of allowed callback URLs."
  type        = list(string)
  default     = ["http://localhost:3000/"]
}

variable "logout_urls" {
  description = "List of allowed logout URLs."
  type        = list(string)
  default     = ["http://localhost:3000/"]
}

variable "cognito_domain_prefix" {
  description = "Prefix for Cognito hosted UI domain (must be globally unique)"
  type        = string
  default     = "my-tutoring-center-demo"
}

variable "lambda_post_confirmation_filename" {
  description = "Path to the zip file for the post-confirmation lambda"
  type        = string
  default     = "lambda-post-confirmation.zip"
}

variable "lambda_post_confirmation_handler" {
  description = "Handler for post-confirmation lambda"
  type        = string
  default     = "index.handler"
}

variable "database_url" {
  description = "Database connection string used by lambda trigger (optional - will use RDS if not provided)"
  type        = string
  default     = ""
}

variable "db_instance_class" {
  description = "RDS instance class (e.g., db.t3.micro for free tier, db.t3.small for production)"
  type        = string
  default     = "db.t3.micro"
}

variable "db_name" {
  description = "Name of the PostgreSQL database to create"
  type        = string
  default     = "appdb"
}

variable "db_username" {
  description = "Master username for RDS PostgreSQL"
  type        = string
  default     = "postgres"
}

variable "lambda_artifact_s3_bucket" {
  description = "S3 bucket where the lambda zip is stored"
  type        = string
}

variable "lambda_artifact_s3_key" {
  description = "S3 key (path) for the lambda zip"
  type        = string
}
