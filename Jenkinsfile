pipeline {
    agent any

    parameters {

	choice(
	    name: 'ACTION',
	    choices: ['deploy', 'rollback'],
	    description: 'Choose whether to deploy the new build or rollback to a previous build'
	)

        choice(
            name: 'DEPLOY_ENV',
            choices: ['development', 'staging', 'production'],
            description: 'Select the deployment environment'
        )

   	string(
           name: 'ROLLBACK_VERSION',
           defaultValue: '19',
           description: 'Jenkins build number to deploy when ACTION is rollback'
    	)

    }

    environment {
        APP_NAME = 'jenkins-demo-app'
        NODE_ENV = 'ci'

        DOCKER_IMAGE = 'kanvit279/jenkins-demo-app'
        DOCKER_CREDENTIALS = credentials('dockerhub-credentials')
    }

    stages {

        stage('Environment Information') {
            steps {
                echo "======================================"
                echo "Environment Information"
                echo "======================================"
                echo "Application: ${APP_NAME}"
                echo "Environment: ${NODE_ENV}"
                echo "Deployment Environment: ${params.DEPLOY_ENV}"
                echo "Job: ${JOB_NAME}"
                echo "Build Number: ${BUILD_NUMBER}"
                echo "Workspace: ${WORKSPACE}"
                echo "======================================"
            }
        }

        stage('Install Dependencies') {
            steps {
                echo "Installing dependencies..."
                sh 'npm ci'
            }
        }

        stage('Lint') {
            steps {
                echo "Running ESLint..."
                sh 'npm run lint'
            }
        }

        stage('Test') {
            steps {
                echo "Running tests..."
                sh 'npm test'
            }
        }

        stage('Build') {
            steps {
                echo "Building application..."
                sh 'npm run build'
            }
        }

        stage('Docker Build') {
            steps {
                echo "Building Docker image..."

                sh '''
                    docker build \
                        -t ${DOCKER_IMAGE}:${BUILD_NUMBER} \
                        -t ${DOCKER_IMAGE}:latest \
                        .
                '''
            }
        }

        stage('Docker Login') {
            steps {
                echo "Logging in to Docker Hub..."

                sh '''
                    echo "$DOCKER_CREDENTIALS_PSW" | \
                    docker login \
                        -u "$DOCKER_CREDENTIALS_USR" \
                        --password-stdin
                '''
            }
        }

        stage('Docker Push') {
            steps {
                echo "Pushing Docker images..."

                sh '''
                    docker push ${DOCKER_IMAGE}:${BUILD_NUMBER}
                    docker push ${DOCKER_IMAGE}:latest
                '''
            }
        }

	stage('Deploy') {
	    steps {
		sh '''
		    set -e

		    if [ "$ACTION" = "rollback" ]; then
		        IMAGE="${DOCKER_IMAGE}:${ROLLBACK_VERSION}"
		        echo "======================================"
		        echo "ROLLBACK DEPLOYMENT"
		        echo "Deploying: $IMAGE"
		        echo "======================================"
		    else
		        IMAGE="${DOCKER_IMAGE}:${BUILD_NUMBER}"
		        echo "======================================"
		        echo "NORMAL DEPLOYMENT"
		        echo "Deploying: $IMAGE"
		        echo "======================================"
		    fi

		    docker pull "$IMAGE"

		    echo "Stopping old container..."
		    docker stop jenkins-demo-app || true

		    echo "Removing old container..."
		    docker rm jenkins-demo-app || true

		    echo "Starting container..."
		    docker run -d \
		        --name jenkins-demo-app \
		        -p 3000:3000 \
		        "$IMAGE"

		    echo "Deployment completed!"
		'''
	    }
	}



        stage('Health Check') {
            steps {
                sh '''
                    echo "Waiting for application to start..."
                    sleep 5

                    echo "Checking application health..."

                    curl --fail http://localhost:3000/health

                    echo ""
                    echo "Application is healthy!"
                '''
            }
        }

        stage('Archive Artifact') {
            steps {
                archiveArtifacts(
                    artifacts: 'dist/**',
                    fingerprint: true
                )
            }
        }
    }

    post {

        success {
            echo "======================================"
            echo "CI + CD PIPELINE SUCCESSFUL"
            echo "======================================"
            echo "Application: ${APP_NAME}"
            echo "Environment: ${params.DEPLOY_ENV}"
            echo "Docker Image: ${DOCKER_IMAGE}:${BUILD_NUMBER}"
            echo "======================================"
        }

        failure {
            echo "======================================"
            echo "PIPELINE FAILED"
            echo "Check the Jenkins console logs."
            echo "======================================"
        }

        always {
            sh 'docker logout || true'
            echo "Pipeline execution finished."
        }
    }
}
