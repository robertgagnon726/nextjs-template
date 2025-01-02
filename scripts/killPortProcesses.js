const { exec } = require('child_process');
const os = require('os');

const port = 3000;

function killProcessOnPort(port) {
  const platform = os.platform();

  if (platform === 'win32') {
    // Windows command to find and kill a process running on a specific port
    // eslint-disable-next-line max-len
    const command = `netstat -aon | findstr :${port} | find "LISTENING" | awk '{print $5}' | xargs -I {} taskkill /F /PID {}`;
    exec(command, (err, stdout, stderr) => {
      if (err) {
        return console.error(`Error: ${err}`);
      }
      if (stderr) {
        return console.error(`Error: ${stderr}`);
      }
      console.info(`Process on port ${port} has been killed`);
      console.info(stdout);
    });
  } else {
    // macOS and Linux command to find and kill a process running on a specific port
    const command = `lsof -ti:${port} | xargs kill -9`;
    exec(command, (err, stdout, stderr) => {
      if (err) {
        return console.error(`Error: ${err}`);
      }
      if (stderr) {
        return console.error(`Error: ${stderr}`);
      }
      console.info(`Process on port ${port} has been killed`);
      console.info(stdout);
    });
  }
}

killProcessOnPort(port);
