var messages = require('sagi-apis-client/health/v1/health_pb');
var services = require('sagi-apis-client/health/v1/health_grpc_pb');

var grpc = require('grpc');
var fs = require('fs');

function TestHealth() {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

  var ssl_creds = grpc.credentials.createSsl(
    fs.readFileSync('./ca.pem'),
    fs.readFileSync('./key.pem'),
    fs.readFileSync('./client.pem')
  );

  var options = {
    'grpc.ssl_target_name_override' : 'apis.sagittarius.ai',
    'grpc.default_authority': 'apis.sagittarius.ai',
    'rejectUnauthorized': 'false',
  };

  var client = new services.HealthClient('apis.sagittarius.ai:8443',
                                          ssl_creds, options);
  var request = new messages.HealthCheckRequest();

  client.check(request, function(err, response) {
    if (response.getStatus() !== messages.HealthCheckResponse.ServingStatus.SERVING) {
      console.log('Greeting:', err, response);
    } else {
      console.log('PASS');
    }
  });
}

TestHealth();
