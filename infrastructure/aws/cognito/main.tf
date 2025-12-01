# ============================================================================
# Locals - computed values
# ============================================================================

locals {
  # Use provided database_url or construct from RDS instance
  database_url = var.database_url != "" ? var.database_url : "postgresql://${var.db_username}:${random_password.db_password.result}@${aws_db_instance.main.endpoint}/${var.db_name}"
}

# ============================================================================
# Cognito Resources
# ============================================================================

resource "aws_cognito_user_pool" "main" {
  name                     = var.user_pool_name
  auto_verified_attributes = ["email"]

  password_policy {
    minimum_length    = 8
    require_lowercase = true
    require_numbers   = true
    require_symbols   = true
    require_uppercase = true
  }

  schema {
    attribute_data_type = "String"
    name               = "email"
    required           = true
    mutable            = true
  }

  lambda_config {
    post_confirmation = aws_lambda_function.cognito_post_confirmation.arn
  }
}

resource "aws_cognito_user_pool_client" "main" {
  name         = var.app_client_name
  user_pool_id = aws_cognito_user_pool.main.id
  generate_secret = false
  prevent_user_existence_errors = "ENABLED"

  explicit_auth_flows = [
    "ALLOW_USER_PASSWORD_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_USER_SRP_AUTH",
    "ALLOW_CUSTOM_AUTH",
  ]

  allowed_oauth_flows = ["code", "implicit"]
  allowed_oauth_scopes = ["email", "openid", "profile"]
  allowed_oauth_flows_user_pool_client = true
  callback_urls = var.callback_urls
  logout_urls   = var.logout_urls
}

resource "aws_cognito_user_pool_domain" "main" {
  domain       = var.cognito_domain_prefix
  user_pool_id = aws_cognito_user_pool.main.id
}

resource "aws_iam_role" "lambda_post_confirmation_role" {
  name = "cognito-post-confirmation-lambda-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Effect = "Allow",
      Principal = { Service = "lambda.amazonaws.com" },
      Action = "sts:AssumeRole",
    }],
  })
}

resource "aws_iam_role_policy_attachment" "lambda_basic" {
  role       = aws_iam_role.lambda_post_confirmation_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_lambda_layer_version" "prisma_client" {
  filename            = "prisma-layer.zip"
  layer_name          = "prisma-client-layer"
  compatible_runtimes = ["nodejs20.x"]
}

resource "aws_lambda_function" "cognito_post_confirmation" {
  s3_bucket        = var.lambda_artifact_s3_bucket
  s3_key           = var.lambda_artifact_s3_key
  function_name    = "cognito-post-confirmation-sync"
  handler          = var.lambda_post_confirmation_handler
  role             = aws_iam_role.lambda_post_confirmation_role.arn
  runtime          = "nodejs20.x"
  # source_code_hash not needed for S3 deployments - Terraform detects changes via s3_key
  timeout          = 30
  memory_size      = 256
  environment {
    variables = {
      DATABASE_URL = local.database_url
      NODE_ENV     = "production"
    }
  }
  layers = [aws_lambda_layer_version.prisma_client.arn]
}

resource "aws_lambda_permission" "cognito_post_confirmation_permission" {
  statement_id  = "AllowExecutionFromCognito"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.cognito_post_confirmation.function_name
  principal     = "cognito-idp.amazonaws.com"
  source_arn    = aws_cognito_user_pool.main.arn
}

# ============================================================================
# RDS PostgreSQL Database
# ============================================================================

# Random password for RDS master user
resource "random_password" "db_password" {
  length  = 16
  special = true
  # Exclude characters that RDS doesn't allow: '/', '@', '"', ' '
  override_special = "!#$%&*()-_=+[]{}<>:?"
}

# Store password in AWS Secrets Manager (optional but recommended)
resource "aws_secretsmanager_secret" "db_password" {
  name = "${var.user_pool_name}-db-password"
}

resource "aws_secretsmanager_secret_version" "db_password" {
  secret_id     = aws_secretsmanager_secret.db_password.id
  secret_string = random_password.db_password.result
}

# Security group for RDS - allow inbound PostgreSQL from Lambda/your IPs
resource "aws_security_group" "rds" {
  name        = "${var.user_pool_name}-rds-sg"
  description = "Security group for RDS PostgreSQL database"

  ingress {
    description = "PostgreSQL from Lambda"
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    # Allow from anywhere for now (Lambda can access public RDS)
    # For production, restrict to specific IPs or VPC
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.user_pool_name}-rds-sg"
  }
}

# DB Subnet Group (RDS requires at least 2 AZs)
data "aws_availability_zones" "available" {
  state = "available"
}

resource "aws_db_subnet_group" "main" {
  name       = "${var.user_pool_name}-db-subnet-group"
  subnet_ids = data.aws_subnets.default.ids

  tags = {
    Name = "${var.user_pool_name}-db-subnet-group"
  }
}

# Get default VPC subnets
data "aws_vpc" "default" {
  default = true
}

data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

# RDS PostgreSQL Instance
resource "aws_db_instance" "main" {
  identifier             = "${var.user_pool_name}-db"
  engine                 = "postgres"
  #engine_version         = "15.5"  # Use available version (or remove to use default)
  instance_class         = var.db_instance_class
  allocated_storage      = 20
  max_allocated_storage  = 100
  storage_type           = "gp3"
  storage_encrypted      = true

  db_name  = var.db_name
  username = var.db_username
  password = random_password.db_password.result

  vpc_security_group_ids = [aws_security_group.rds.id]
  db_subnet_group_name   = aws_db_subnet_group.main.name

  publicly_accessible    = true # Allow Lambda to access (for serverless, public is often needed)
  skip_final_snapshot   = true  # Set to false for production
  backup_retention_period = 0   # 0 for free tier (set to 7+ for production)
  backup_window         = "03:00-04:00"
  maintenance_window    = "mon:04:00-mon:05:00"

  enabled_cloudwatch_logs_exports = ["postgresql", "upgrade"]

  tags = {
    Name = "${var.user_pool_name}-postgres"
  }
}
