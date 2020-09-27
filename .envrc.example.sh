# Rename this file as .envrc
# in the root of your project

# App
export PHOTION__HTTP__PROTO="http"
export PHOTION__HTTP__HOST="localhost"
export PHOTION__HTTP__PORT="8080"
export PHOTION__HTTP__BASE_URL="$PHOTION__HTTP__PROTO://$PHOTION__HTTP__HOST:$PHOTION__HTTP__PORT"
export PHOTION_USERNAME=""

# Credentials
export AWS_REGION="eu-west-1"
export AWS_PROFILE="photion-publisher"

# Cypress
export CYPRESS_BASE_URL=$PHOTION__HTTP__BASE_URL
export CYPRESS_USERNAME=$PHOTION_USERNAME
export CYPRESS_SESSION_CREDENTIALS_AWS='[["AWS_ACCESS_KEY_ID",""],["AWS_REGION",""],["AWS_SECRET_ACCESS_KEY",""],["GCP_API_KEY",""],["GCP_API_SECRET",""]]'

# Sentry
export VUE_APP_SENTRY_DSN=""
export SENTRY_AUTH_TOKEN=""
export SENTRY_ORG=""
export SENTRY_PROJECT="photion--web-admin"
