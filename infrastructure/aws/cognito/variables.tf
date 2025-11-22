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
