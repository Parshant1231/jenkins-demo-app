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

        DOCKER_CREDS = credentials('dockerhub-credentials')
    }


    stages {

	stage('Credential Test') {
	   steps {
	        sh '''
		   if [ -n "$DOCKER_CREDS_USR" ]; then
                     echo "Docker username credential is available"
            	   else
                	echo "Docker username credential is missing"
                        exit 1
            	   fi

            	   if [ -n "$DOCKER_CREDS_PSW" ]; then
                	echo "Docker secret is available"
           	   else 
                	echo "Docker secret is missing"
                	exit 1
            	   fi
        	'''
    		}
	}
        
	
	
	stage('Show Parameters') {
	   steps {
	     echo "Selected environment: ${params.DEPLOY_ENV}"
	   }
	}


        stage('Environment Information') {
            steps {
                echo "Application: ${APP_NAME}"
                echo "Environment: ${NODE_ENV}"
                echo "Job: ${JOB_NAME}"
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

        stage('Archive Artifact') {
            steps {
                archiveArtifacts artifacts: 'dist/**', fingerprint: true
            }
        }
    }

    post {
        success {
            echo 'CI Pipeline completed successfully!'
        }

        failure {
            echo 'CI Pipeline failed. Check the logs.'
        }

        always {
            echo 'Pipeline execution finished.'
        }
    }
}
