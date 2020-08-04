module.exports = {
  apps : [{
    name: "nofise",
    exec_mode: "fork",
    watch: false,
    script: 'bin/www',
    env: {
      NODE_ENV: "development",
      FILEROOT: "fileroot"
    },
    env_production: {
      NODE_ENV: "production",
      PORT: 3503
    }
  }]
};
