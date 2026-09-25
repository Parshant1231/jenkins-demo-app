pipeline {
   agent any

   stages {
	stage('Install Dependencies'){
	  steps {
	   sh 'npm ci'
	  }
	}

	stage ('Lint'){
	  steps {
	    sh 'npm run lint'
	  }
	}
	
	stage('Run Tests'){
	  steps {
	    sh 'npm test'
	  }
	}

   }


}
