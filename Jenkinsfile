
def sonarServer = 'BaseLine'
def branch = ''
def packageFlag = true
def sonarUrl='-Dsonar.host.url=http://10.136.5.190:9000'
def noteToExecute = ''

properties([[$class: 'BuildDiscarderProperty', strategy: [$class: 'LogRotator', artifactDaysToKeepStr: '', artifactNumToKeepStr: '10', daysToKeepStr: '45', numToKeepStr: '10']]]);

node {
  if ( getURI().contains("buildBranch") ) {
        packageFlag = true
        noteToExecute = "$JENKINS_SLAVES_FOR_BRANCHES"
    } else {
       //sonarUrl='-Dsonar.host.url=http://10.136.5.190:9020'
       //sonarServer = 'Development'
       branch = env.BRANCH_NAME
       branch =branch.split("/")[1]
       noteToExecute = "$JENKINS_SLAVES_FOR_BRANCHES"
    }
}

node(label: noteToExecute) {
  stage('Checkout') {
        if(fileExists('WebContent')){  
        sh "rm -r  WebContent" 
    }
    checkout scm
    def revmap = scm.parseRevisionFile(currentBuild.rawBuild)
    svnRevision = revmap.get(getURI())
  }
 stage('Sonar') {
   def scannerHome = tool 'DefaultSonarRuner_2.4'
    if ( isUnix() ){
      withSonarQubeEnv(sonarServer) {
        echo "sonarServer: ${sonarServer}"
      sh "${scannerHome}/bin/sonar-runner -Dsonar.branch.name=" + branch +" "+ sonarUrl
      }
    }else{
      withSonarQubeEnv(sonarServer) {
      bat "${scannerHome}/bin/sonar-runner -Dsonar.branch.name=" + branch +" "+ sonarUrl  
      }
    }
  }
 
  stage('Compile') {
	if ( isUnix() ){
	  	sh 'lessc -v'
		sh 'lessc ./WebContent/bel-main-style.less -x > ./WebContent/bel-main-style.css'
	}else{
    	bat 'lessc -v'
		 bat 'lessc ./WebContent/bel-main-style.less -x > ./WebContent/bel-main-style.css'
	  }
  } 
  if(packageFlag){
    stage('Package'){ 
        def  versionZipName = "BLUE_BUILD_${BUILD_ID}_REV_${svnRevision}"
      if ( isUnix() ) {
          sh "mkdir -p Blue" 
          sh "cp -f WebContent/bel-main-style.css Blue"
          sh "cp -f WebContent/indexBlue.html Blue"
		  sh "cp -f WebContent/indexBlueResponsive.html Blue"
          sh "cp -r WebContent/g-libreries/fonts Blue/fonts"
          sh "cp -r WebContent/resources/js Blue/js"
          sh "cp -r WebContent/resources/images Blue/images"
          sh "zip -r ${versionZipName}.zip Blue/*"
          sh "rm -r Blue"
      }else{
        if(fileExists('Blue')){  
            bat "rd /s/q Blue" 
        }
        bat "md Blue"
        bat "md Blue\\Blue"
        bat "xcopy WebContent\\bel-main-style.css Blue\\Blue /y"
        bat "xcopy WebContent\\indexBlue.html Blue\\Blue /y"
		bat "xcopy WebContent\\indexBlueResponsive.html Blue\\Blue /y"
        bat "xcopy WebContent\\resources\\js Blue\\Blue\\js /s/i/y"
        bat "xcopy WebContent\\resources\\images Blue\\Blue\\images /s/i/y"
        bat "xcopy WebContent\\g-libreries\\fonts Blue\\Blue\\fonts /s/i/y"
        zip zipFile: "${versionZipName}.zip", archive: false, dir: 'Blue'  //Se necesita instalar el plugin: Pipeline Utility Steps
        bat "rd /s/q Blue" 
      }
       archiveArtifacts artifacts: "${versionZipName}.zip", fingerprint: false, onlyIfSuccessful: true
    }
  }
   
}
def getURI(){
    def remote = scm.locations.first().remote
    return remote.split('@').first()
}