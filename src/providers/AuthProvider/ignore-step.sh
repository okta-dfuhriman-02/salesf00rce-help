#!/bin/bash

echo "ENV: $VERCEL_ENV"
echo "BUILD BRANCH: $VERCEL_GIT_COMMIT_REF"
echo "PROJECT BRANCH: $PROJECT_BRANCH"

if [[ "$VERCEL_ENV" == "production" || "$VERCEL_GIT_COMMIT_REF" == "$PROJECT_BRANCH" ]] ; then
	# Proceed with the build
	echo "✅ - Build can proceed"
  	exit 1;
else
	# Don't build
	echo "🛑 - Build cancelled"
	exit 0;
fi
