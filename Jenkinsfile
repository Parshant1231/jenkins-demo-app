pipeline {
    agent any

    parameters {
        choice(
            name: 'DEPLOY_ENV',
            choices: ['development', 'staging', 'production'],
            description: 'Select the deployment environment'
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
                echo "Application: ${APP_NAME}"
                echo "Environment: ${NODE_ENV}"
                echo "Deployment Environment: ${params.DEPLOY_ENV}"
                echo "Build Number: ${BUILD_NUMBER}"
                echo "Workspace: ${WORKSPACE}"
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Lint') {
            steps {
                sh 'npm run lint'
            }
        }

        stage('Test') {
            steps {
                sh 'npm test'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Docker Build') {
            steps {
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
                sh '''
                    docker push ${DOCKER_IMAGE}:${BUILD_NUMBER}
                    docker push ${DOCKER_IMAGE}:latest
                '''
            }
        }

	stage('Deploy') {
	    steps {
		sh '''
		    echo "Pulling latest Docker image..."
		    docker pull ${DOCKER_IMAGE}:latest

		    echo "Stopping old container..."
		    docker stop jenkins-demo-app || true

		    echo "Removing old container..."
		    docker rm jenkins-demo-app || true

		    echo "Starting new container..."
		    docker run -d \
		        --name jenkins-demo-app \
		        -p 3000:3000 \
		        ${DOCKER_IMAGE}:latest

		    echo "Deployment completed!"
		'''
	    }
	}

        stage('Archive Artifact') {
            steps {
                archiveArtifacts artifacts: 'dist/**', fingerprint: true
            }
        }
    }

    post {
        success {
            echo 'CI + Docker pipeline completed successfully!'
        }

        failure {
            echo 'Pipeline failed. Check the logs.'
        }

        always {
            sh 'docker logout || true'
            echo 'Pipeline execution finished.'
        }
    }
}
