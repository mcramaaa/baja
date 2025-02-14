module.exports = {
  apps: [
    {
      name: "prod-baja",
      script: "yarn",
      args: "start",
      cwd: "/var/www/bbiz-project/baja",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
    },
  ],
};
