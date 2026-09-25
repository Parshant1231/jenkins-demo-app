pipeline {
    agent any

    environment {
        APP_NAME = 'jenkins-demo-app'
        NODE_ENV = 'ci'
    }


    stages {

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
