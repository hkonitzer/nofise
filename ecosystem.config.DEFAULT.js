module.exports = {
  apps : [{
    name: "nofise",
    exec_mode: "fork",
    watch: false,
    script: 'bin/www',
    env: {
      NODE_ENV: "development",
      FILEROOT: "fileroot",
      FILEPATH: "/files/",
      URLPATH: "/"
    },
    env_production: {
      NODE_ENV: "production",
      FILEPATH: "/files/",
      URLPATH: "/",
      PORT: 3503
    }
  }]
};
