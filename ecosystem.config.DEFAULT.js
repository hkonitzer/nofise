module.exports = {
  apps : [{
    name: "nofise",
    exec_mode: "fork",
    watch: false,
    script: 'bin/www',
    env: {
      NODE_ENV: "development",
      FILEROOT: "fileroot",
      URLPATH: "/"
    },
    env_production: {
      NODE_ENV: "production",
      URLPATH: "/",
      PORT: 3503
    }
  }]
};
