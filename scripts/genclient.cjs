const { exec } = require('child_process');
// eslint-disable-next-line max-len
// skipcq: JS-0258
const fs = require('fs-extra'); // fs-extra is a module that extends the built-in fs module with additional features, like recursive directory removal.

// Define the command for OpenAPI generator
const openApiGeneratorCommand =
  'openapi-generator-cli generate -g typescript-axios --additional-properties=typescriptThreePlus=true --additional-properties=supportsES6=true --additional-properties=withSeparateModelsAndApi=true --additional-properties=apiPackage=api --additional-properties=modelPackage=model --skip-validate-spec -i http://localhost:8080/api-json -o src/generated/api-client';
// Function to remove the generated directory and then generate the API client
function generateApiClient() {
  console.info('Removing existing generated directory...');

  // Remove the src/generated directory
  fs.remove('./src/generated', (err) => {
    if (err) return console.error('Error: ', err);

    console.info('Generating API client...');
    // Execute the OpenAPI generator command
    return exec(openApiGeneratorCommand, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`Stderr: ${stderr}`);
        return;
      }
      console.info(`Stdout: ${stdout}`);
      console.info('API client generated successfully!');
      return;
    });
  });
}

// Run the function
generateApiClient();
