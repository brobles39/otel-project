# Demo Devops NodeJs

This app is a Node.js Express server that listens for incoming HTTP POST requests on the "/DevOps" endpoint. The app requires a JWT (JSON Web Token) to be present in the request headers in order to authorize access to the endpoint.

The app also checks for a specific API key in the request headers and returns an error if it is missing or incorrect. If the API key is present and correct, the app extracts the message, recipient, sender, and message time-to-live from the request body. If all of these parameters are present, the app returns a success message indicating that the message will be sent.

The app also has error handling functionality, which returns an error if the HTTP request method is not allowed, if the JWT is not authorized, or if the endpoint is not valid.

Finally, the app listens on the specified port (either the environment variable PORT or port 3000 by default), and sets up a process to gracefully handle SIGTERM signals, which allows for proper cleanup of the Node.js server when it is being shut down.

## JWT

```bash
This application uses as secret key:  'DemoSK';
The JWT is: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.pFfdS1a-YjXSGVc4hsDzHtRGNA-CfxawMq-hF7n1foI';
ApiKey = '2f5ae96c-b558-4c7b-a590-a501ae1c3f6c';
```

## Local testing

### Installation

Clone this repo.

```bash
git clone https://github.com/brobles39/dockerized-nodejs-k8s-aws-workflow.git
```

Install dependencies.

```bash
npm install
```
Run the app.

```bash
npm run start
```

Test the app.

```bash
curl -X POST -H "X-Parse-REST-API-Key: 2f5ae96c-b558-4c7b-a590-a501ae1c3f6c" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.pFfdS1a-YjXSGVc4hsDzHtRGNA-CfxawMq-hF7n1foI" -H "Content-Type: application/json" -d "{\"message\": \"This is a test\", \"to\": \"Juan Perez\", \"from\": \"Rita Asturia\", \"timeToLifeSec\": 45}" http://127.0.0.1:56458/DevOps
```

**Running tests locally.**

Unit tests.
```bash
npm run test
```

Static code analysis test
```bash
npm run lint
```

## Test the application online (**This section is currently unavailable, the eks cluster was up untill 03/05/2023**)

The application is already deployed in EKS using github actions as CI/CD tool, this is the endpoint:

```bash
http://a3b7299ce12b045fca33e0a5159db376-181428005.us-east-1.elb.amazonaws.com/devops/
```

Test the endpoint using the following command:

```bash
curl -X POST -H "X-Parse-REST-API-Key: 2f5ae96c-b558-4c7b-a590-a501ae1c3f6c" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.pFfdS1a-YjXSGVc4hsDzHtRGNA-CfxawMq-hF7n1foI" -H "Content-Type: application/json" -d "{\"message\": \"This is a test\", \"to\": \"Juan Perez\", \"from\": \"Rita Asturia\", \"timeToLifeSec\": 45}" http://a3b7299ce12b045fca33e0a5159db376-181428005.us-east-1.elb.amazonaws.com/DevOps
```


## Created resources

In the following image, one can see the two pods running, along with the LoadBalancer service, deployment and replicaset. The replicaset displays both the desired and current size of the pods.
<img src="./inform/resourcescreated.png" alt="Alt text" title="Optional title">

## CI/CD Process

Github actions was used as a CI/CD tool, basically it installs the project dependencies, logs into my personal dockerhub account, builds the application and uploads it to my dockerhub account.

As variables it has configured a dockerhub token to access the account, as well as the credentials of my personal aws account and the KUBECONFIG_FILE in base64 to point to my EKS cluster.

**Full Pipeline description:**

**1. name:** The name of the pipeline.

**2. on:** The events that trigger the pipeline, which are push events on the main branch and pull request events targeting the main branch.

**3. jobs:** The list of jobs that the pipeline will execute.

**4. build-test-analyze:** The name of the job.

**5. runs-on:** The type of virtual machine that the job will run on. In this case, it's an Ubuntu-based virtual machine.

**6. steps:** The list of steps that the job will execute.

**7. Checkout code:** This step checks out the source code of the application.

**8. Set up Node.js:** This step sets up the Node.js environment by installing the specified Node.js version.

**9. Install dependencies:** This step installs the Node.js dependencies of the application.

**10. Running unit tests:** This step runs the unit tests of the application using the "npm run test" command.

**11. Running static code analysis test:** This step runs the static code analysis test of the application using the "npm run lint" command.

**12. Build Docker image:** This step builds a Docker image of the application using the "docker build" command and tags it with the name "Demo".

**13. Login to Docker Hub:** This step logs in to Docker Hub using the Docker Hub username and access token that are stored as GitHub secrets.

**14. Push Docker image:** This step pushes the Docker image to Docker Hub using the "docker tag" and "docker push" commands. The name of the image is prefixed with the Docker Hub username.

**15. Configure AWS Credentials:** This step configures the AWS credentials that are required to deploy the application to Amazon EKS.

**16. Deploy the app to Amazon EKS:** This step deploys the application to Amazon EKS using the Kubernetes command-line tool (kubectl) and the Kubernetes deployment configuration file (k8s-deployment.yml). The Kubernetes configuration file is modified using the "envsubst" command to replace placeholders with environment variables. The Kubernetes configuration file and the Kubernetes configuration file content are stored as GitHub secrets.

## Kubenetes configuration

The **k8s-deployment.yml** file defines a Kubernetes Deployment and a Kubernetes Service for the containerized application. The Deployment specifies the number of replicas to be created, a selector for the pods, and a template for the pods which includes a single container named "Demo-app". The container is configured to use the Docker image "brobles39/Demo:latest" and listen on port 3000. The resource limits for the container are also specified in the template.

The Service is defined with the name "Demo-app" and a selector that matches the Deployment's pod selector. The Service is configured to expose port 80 which forwards to port 3000 on the pods. Additionally, the Service is of type "LoadBalancer", which means that an external load balancer will be created to distribute traffic to the pods.

## License

Copyright © 2023 Brian Robles. All rights reserved.
